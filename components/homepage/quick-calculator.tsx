

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Calculator,
  ArrowRight,
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { formatCurrency } from '@/lib/calculations';
import { US_STATES } from '@/lib/constants';
import { analytics } from '@/lib/analytics';

interface QuickCalcData {
  state: string;
  systemSize: number;
  ppw: number;
  dealType: 'ownership' | 'lease';
  currentCommission: number;
  adders: number;
}

interface QuickCalcResults {
  partnerCommission: number;
  currentCommission: number;
  difference: number;
  annualDifference: number;
  showPartner: boolean;
  baseline: number;
  stateAvailable: boolean;
}

export default function QuickCalculator() {
  const router = useRouter();
  const [formData, setFormData] = useState<QuickCalcData>({
    state: '',
    systemSize: 0,
    ppw: 0,
    dealType: 'ownership',
    currentCommission: 0,
    adders: 0
  });
  
  const [results, setResults] = useState<QuickCalcResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof QuickCalcData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.state) newErrors.state = 'Please select your state';
    if (formData.systemSize <= 0) newErrors.systemSize = 'System size must be greater than 0';
    if (formData.ppw <= 0) newErrors.ppw = 'PPW must be greater than 0';
    if (formData.currentCommission < 0) newErrors.currentCommission = 'Commission cannot be negative';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = async () => {
    if (!validateForm()) return;
    
    // Track calculation start
    analytics.quickCalcStarted({
      state: formData.state,
      dealType: formData.dealType
    });
    
    setIsCalculating(true);
    
    try {
      const response = await fetch('/api/quick-calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Calculation failed');
      }
      
      const data: QuickCalcResults = await response.json();
      
      // Track calculation completion
      analytics.quickCalcCompleted({
        state: formData.state,
        partnerAdvantage: data.showPartner,
        commissionDifference: data.difference
      });
      
      // Add a small delay for better UX
      setTimeout(() => {
        setResults(data);
        setIsCalculating(false);
      }, 1500);
      
    } catch (error) {
      console.error('Quick calculation error:', error);
      setIsCalculating(false);
      setErrors({ general: 'Unable to calculate. Please try again.' });
    }
  };

  const handleGetFullAnalysis = () => {
    // Track full analysis click
    analytics.fullAnalysisClicked({
      state: formData.state,
      prePopulatedData: true,
      source: 'quick_calculator'
    });
    
    // Store quick calc data for pre-population
    const quickCalcData = {
      state: formData.state,
      systemSize: formData.systemSize.toString(),
      priceAmount: formData.ppw,
      dealType: formData.dealType,
      commissionEarned: formData.currentCommission.toString(),
      roofingAdder: formData.adders.toString(),
    };
    
    sessionStorage.setItem('quickCalcData', JSON.stringify(quickCalcData));
    
    // Navigate to lead capture with pre-population flag
    router.push('/calculator/sales-rep/step-1?prefill=true');
  };

  const handleConnectWithPartners = () => {
    // Track partner connection click
    analytics.partnerConnectionClicked({
      state: formData.state,
      hasAdvantage: results?.showPartner || false
    });
    
    // Store quick calc data and navigate to contact
    const quickCalcData = {
      state: formData.state,
      systemSize: formData.systemSize.toString(),
      priceAmount: formData.ppw,
      dealType: formData.dealType,
      commissionEarned: formData.currentCommission.toString(),
      partnerAdvantage: results?.difference || 0,
    };
    
    sessionStorage.setItem('quickCalcData', JSON.stringify(quickCalcData));
    router.push('/contact');
  };

  return (
    <section className="bg-muted/30 py-16">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-success rounded-full flex items-center justify-center">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Quick Commission Comparison</h2>
            <p className="text-xl text-muted-foreground mb-2">
              Compare solar commission opportunities instantly
            </p>
            <p className="text-muted-foreground">
              Get a quick comparison in 30 seconds - no signup required
            </p>
          </div>

          <Card className="backdrop-blur-sm bg-card/50 border-2 border-primary/10">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Calculator Form */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Step 1: Select Your State</h3>
                    <div className="space-y-2">
                      <Select 
                        value={formData.state} 
                        onValueChange={(value) => handleInputChange('state', value)}
                      >
                        <SelectTrigger className={errors.state ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Choose your state" />
                        </SelectTrigger>
                        <SelectContent>
                          {US_STATES.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.state && (
                        <p className="text-sm text-red-500 flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.state}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Step 2: Your Current Deal Example</h3>
                    <div className="space-y-4">
                      {/* System Size */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="systemSize">System Size (kW)</Label>
                          <Input
                            id="systemSize"
                            type="number"
                            step="0.1"
                            inputMode="decimal"
                            placeholder="8.5"
                            value={formData.systemSize || ''}
                            onChange={(e) => handleInputChange('systemSize', parseFloat(e.target.value) || 0)}
                            className={`${errors.systemSize ? 'border-red-500' : ''} text-lg`}
                          />
                          {errors.systemSize && (
                            <p className="text-xs text-red-500">{errors.systemSize}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="ppw">Your PPW Rate ($)</Label>
                          <Input
                            id="ppw"
                            type="number"
                            step="0.01"
                            inputMode="decimal"
                            placeholder="4.50"
                            value={formData.ppw || ''}
                            onChange={(e) => handleInputChange('ppw', parseFloat(e.target.value) || 0)}
                            className={`${errors.ppw ? 'border-red-500' : ''} text-lg`}
                          />
                          {errors.ppw && (
                            <p className="text-xs text-red-500">{errors.ppw}</p>
                          )}
                        </div>
                      </div>

                      {/* Deal Type */}
                      <div className="space-y-2">
                        <Label>Deal Type</Label>
                        <RadioGroup
                          value={formData.dealType}
                          onValueChange={(value: 'ownership' | 'lease') => handleInputChange('dealType', value)}
                          className="flex space-x-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="ownership" id="ownership" />
                            <Label htmlFor="ownership">Ownership</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="lease" id="lease" />
                            <Label htmlFor="lease">Lease/PPA</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Your Commission */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentCommission">Your Commission ($)</Label>
                          <Input
                            id="currentCommission"
                            type="number"
                            inputMode="numeric"
                            placeholder="1500"
                            value={formData.currentCommission || ''}
                            onChange={(e) => handleInputChange('currentCommission', parseFloat(e.target.value) || 0)}
                            className={`${errors.currentCommission ? 'border-red-500' : ''} text-lg`}
                          />
                          {errors.currentCommission && (
                            <p className="text-xs text-red-500">{errors.currentCommission}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="adders">Adders (optional) ($)</Label>
                          <Input
                            id="adders"
                            type="number"
                            inputMode="numeric"
                            placeholder="2000"
                            value={formData.adders || ''}
                            onChange={(e) => handleInputChange('adders', parseFloat(e.target.value) || 0)}
                            className="text-lg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Step 3: See Partner Comparison</h3>
                    <Button
                      onClick={handleCalculate}
                      disabled={isCalculating}
                      className="w-full btn-gradient text-white text-lg py-3"
                      size="lg"
                    >
                      {isCalculating ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Calculating...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Calculator className="h-5 w-5" />
                          <span>Calculate Now</span>
                        </div>
                      )}
                    </Button>
                    
                    {errors.general && (
                      <p className="text-sm text-red-500 flex items-center space-x-1 mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.general}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Results Display */}
                <div className="space-y-6">
                  <AnimatePresence mode="wait">
                    {results && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                      >
                        {/* Results Header */}
                        <div>
                          <h3 className="text-xl font-semibold mb-4">Your Commission Comparison</h3>
                        </div>

                        {/* Side-by-side Results */}
                        <div className="grid gap-4">
                          {/* Your Company Column */}
                          <div className="p-4 bg-muted/50 rounded-lg border">
                            <h4 className="font-semibold mb-2">Your Company</h4>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Commission: {formatCurrency(results.currentCommission)}</p>
                              <p className="text-sm text-muted-foreground">Annual (36 deals): {formatCurrency(results.currentCommission * 36)}</p>
                            </div>
                          </div>

                          {/* Partner Network Column - Only show if better */}
                          {results.showPartner && (
                            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                              <h4 className="font-semibold mb-2 text-primary">Partner Network</h4>
                              <div className="space-y-1">
                                <p className="text-sm">Commission: {formatCurrency(results.partnerCommission)}</p>
                                <p className="text-sm">Annual (36 deals): {formatCurrency(results.partnerCommission * 36)}</p>
                                <p className="text-sm font-semibold text-success">
                                  Difference: +{formatCurrency(results.difference)} per deal
                                </p>
                                <p className="text-sm font-semibold text-success">
                                  Annual Increase: +{formatCurrency(results.annualDifference)}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Conditional CTAs */}
                        {results.showPartner ? (
                          <div className="space-y-4 p-4 bg-success/10 rounded-lg border border-success/20">
                            <div className="text-center">
                              <h4 className="font-semibold text-success mb-2 flex items-center justify-center space-x-2">
                                <CheckCircle className="h-5 w-5" />
                                <span>Partner Opportunity Available in {formData.state}!</span>
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Partner companies in {formData.state} are offering {formatCurrency(results.difference)} more per deal
                                for reps with your profile.
                              </p>
                            </div>
                            
                            <div className="space-y-3">
                              <Button
                                onClick={handleGetFullAnalysis}
                                className="w-full btn-gradient text-white"
                                size="lg"
                              >
                                <div className="flex items-center space-x-2">
                                  <TrendingUp className="h-4 w-4" />
                                  <span>Get Full Analysis</span>
                                </div>
                              </Button>
                              
                              <Button
                                onClick={handleConnectWithPartners}
                                variant="outline"
                                className="w-full"
                                size="lg"
                              >
                                <div className="flex items-center space-x-2">
                                  <ArrowRight className="h-4 w-4" />
                                  <span>Connect with Partners</span>
                                </div>
                              </Button>
                            </div>
                          </div>
                        ) : results.stateAvailable ? (
                          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                            <div className="text-center">
                              <h4 className="font-semibold mb-2">Your Current Commission is Competitive</h4>
                              <p className="text-sm text-muted-foreground">
                                While your commission is competitive, partner companies may offer additional benefits 
                                like recruiting income and equity opportunities.
                              </p>
                            </div>
                            
                            <Button
                              onClick={handleGetFullAnalysis}
                              variant="outline"
                              className="w-full"
                              size="lg"
                            >
                              <div className="flex items-center space-x-2">
                                <Zap className="h-4 w-4" />
                                <span>Still Interested in Partner Network?</span>
                              </div>
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4 p-4 bg-amber/10 rounded-lg border border-amber/20">
                            <div className="text-center">
                              <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-2">
                                Expanding to {formData.state} Soon
                              </h4>
                              <p className="text-sm text-amber-600 dark:text-amber-400">
                                We're expanding to {formData.state} soon. Join our waitlist for early access to partner opportunities.
                              </p>
                            </div>
                            
                            <Button
                              onClick={handleConnectWithPartners}
                              variant="outline"
                              className="w-full border-amber-300 text-amber-700 hover:bg-amber-50"
                              size="lg"
                            >
                              <div className="flex items-center space-x-2">
                                <ArrowRight className="h-4 w-4" />
                                <span>Join {formData.state} Waitlist</span>
                              </div>
                            </Button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Placeholder when no results */}
                  {!results && !isCalculating && (
                    <div className="flex items-center justify-center h-64 text-muted-foreground">
                      <div className="text-center">
                        <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Enter your details and click "Calculate Now" to see your comparison</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

