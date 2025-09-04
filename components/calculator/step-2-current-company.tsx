
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building2, 
  DollarSign, 
  Calculator,
  Zap,
  Home,
  Battery,
  Plus,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Users,
  Info
} from 'lucide-react';
import { DEAL_TYPES, PRICING_STRUCTURES, US_STATES } from '@/lib/constants';
import { calculateCommission, formatCurrency } from '@/lib/calculations';
import { useToast } from '@/hooks/use-toast';

interface CurrentCompanyData {
  systemSize: string;
  state: string;
  dealType: 'ownership' | 'lease' | '';
  pricingStructure: 'ppw' | 'epc' | '';
  priceAmount: string;
  commissionEarned: string;
  roofingAdder: string;
  mpuAdder: string;
  batteryAdder: string;
  otherAdder: string;
}

interface CurrentCompanyCalculatorProps {
  calculatorType?: 'sales-rep' | 'team-leader';
}

export default function CurrentCompanyCalculator({ calculatorType = 'sales-rep' }: CurrentCompanyCalculatorProps = {}) {
  const [formData, setFormData] = useState<CurrentCompanyData>({
    systemSize: '',
    state: '',
    dealType: '',
    pricingStructure: 'ppw',
    priceAmount: '',
    commissionEarned: '',
    roofingAdder: '0',
    mpuAdder: '0',
    batteryAdder: '0',
    otherAdder: '0'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [leadCaptureData, setLeadCaptureData] = useState<any>(null);
  const router = useRouter();
  const { toast } = useToast();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('calculatorData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData?.leadCapture) {
          setLeadCaptureData(parsedData.leadCapture);
          // Pre-fill state from lead capture if available
          if (parsedData.leadCapture.state && !formData.state) {
            setFormData(prev => ({ ...prev, state: parsedData.leadCapture.state }));
          }
        }
        if (parsedData?.currentCompany) {
          setFormData(parsedData.currentCompany);
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever formData changes
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('calculatorData') || '{}');
    savedData.currentCompany = formData;
    localStorage.setItem('calculatorData', JSON.stringify(savedData));
  }, [formData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.systemSize || parseFloat(formData.systemSize) <= 0) {
      newErrors.systemSize = 'Please enter a valid system size';
    }

    if (!formData.state) {
      newErrors.state = 'Please select a state';
    }

    if (!formData.dealType) {
      newErrors.dealType = 'Please select a deal type';
    }

    if (!formData.priceAmount || parseFloat(formData.priceAmount) <= 0) {
      newErrors.priceAmount = 'Please enter a valid price amount';
    }

    if (!formData.commissionEarned || parseFloat(formData.commissionEarned) < 0) {
      newErrors.commissionEarned = 'Please enter your commission earned';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Calculate commission with current data
      if (leadCaptureData && formData.dealType && formData.state) {
        const calculationInputs = {
          systemSize: parseFloat(formData.systemSize),
          state: formData.state,
          dealType: formData.dealType as 'ownership' | 'lease',
          priceAmount: parseFloat(formData.priceAmount),
          roofingAdder: parseFloat(formData.roofingAdder) || 0,
          mpuAdder: parseFloat(formData.mpuAdder) || 0,
          batteryAdder: parseFloat(formData.batteryAdder) || 0,
          otherAdder: parseFloat(formData.otherAdder) || 0,
          experience: leadCaptureData.experience,
          careerInstalls: leadCaptureData.careerInstalls
        };

        const results = calculateCommission(calculationInputs);
        
        // Save calculation results to localStorage
        const savedData = JSON.parse(localStorage.getItem('calculatorData') || '{}');
        savedData.calculationResults = results;
        localStorage.setItem('calculatorData', JSON.stringify(savedData));
      }

      toast({
        title: "Calculation Complete",
        description: "Your current company data has been analyzed!",
      });

      // Navigate to step 3
      router.push(`/calculator/${calculatorType}/step-3`);
    } catch (error) {
      console.error('Error calculating commission:', error);
      toast({
        title: "Calculation Error",
        description: "There was an issue with the calculations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: keyof CurrentCompanyData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBack = () => {
    router.push(`/calculator/${calculatorType}/step-1`);
  };

  // Calculate live commission preview if all fields are filled
  const getCommissionPreview = () => {
    if (!leadCaptureData || !formData.systemSize || !formData.state || !formData.dealType || !formData.priceAmount) {
      return null;
    }

    try {
      const calculationInputs = {
        systemSize: parseFloat(formData.systemSize),
        state: formData.state,
        dealType: formData.dealType as 'ownership' | 'lease',
        priceAmount: parseFloat(formData.priceAmount),
        roofingAdder: parseFloat(formData.roofingAdder) || 0,
        mpuAdder: parseFloat(formData.mpuAdder) || 0,
        batteryAdder: parseFloat(formData.batteryAdder) || 0,
        otherAdder: parseFloat(formData.otherAdder) || 0,
        experience: leadCaptureData.experience,
        careerInstalls: leadCaptureData.careerInstalls
      };

      return calculateCommission(calculationInputs);
    } catch {
      return null;
    }
  };

  const commissionPreview = getCommissionPreview();

  return (
    <div className="p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center"
          >
            <Building2 className="h-8 w-8 text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-bold mb-2">Current Company Calculator</h1>
          <p className="text-muted-foreground text-lg">
            Enter your current deal details to see how our commission structure compares
          </p>
          
          {leadCaptureData && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm">
                <strong>Hello {leadCaptureData.name}!</strong> Based on your {leadCaptureData.experience} years of experience 
                and {leadCaptureData.careerInstalls} career installs, you qualify for our 
                <span className="font-semibold text-primary">
                  {leadCaptureData.experience === '6-10' || leadCaptureData.experience === '10+' || 
                   ['21-50', '51-100', '100+'].includes(leadCaptureData.careerInstalls) ? ' 60%' : ' 50%'}
                </span> commission rate.
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Deal Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  <span>Deal Details</span>
                </CardTitle>
                <CardDescription>
                  Enter the specifics of a recent or typical deal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="systemSize">System Size (kW) *</Label>
                    <div className="relative">
                      <Zap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="systemSize"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="e.g., 12.5"
                        value={formData.systemSize}
                        onChange={(e) => updateField('systemSize', e.target.value)}
                        className={`pl-10 ${errors.systemSize ? 'border-destructive' : ''}`}
                      />
                    </div>
                    {errors.systemSize && (
                      <p className="text-sm text-destructive">{errors.systemSize}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>State *</Label>
                    <Select 
                      value={formData.state} 
                      onValueChange={(value) => updateField('state', value)}
                    >
                      <SelectTrigger className={errors.state ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {US_STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.state && (
                      <p className="text-sm text-destructive">{errors.state}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Deal Type *</Label>
                  <Select 
                    value={formData.dealType} 
                    onValueChange={(value) => updateField('dealType', value)}
                  >
                    <SelectTrigger className={errors.dealType ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select deal type" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEAL_TYPES.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.dealType && (
                    <p className="text-sm text-destructive">{errors.dealType}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pricing Structure */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <span>Pricing Structure</span>
                </CardTitle>
                <CardDescription>
                  How does your current company price solar installations?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Pricing Method</Label>
                    <Select 
                      value={formData.pricingStructure} 
                      onValueChange={(value) => updateField('pricingStructure', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PRICING_STRUCTURES.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priceAmount">
                      {formData.pricingStructure === 'ppw' ? 'Price Per Watt ($)' : 'Total System Price ($)'} *
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="priceAmount"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder={formData.pricingStructure === 'ppw' ? 'e.g., 4.50' : 'e.g., 35000'}
                        value={formData.priceAmount}
                        onChange={(e) => updateField('priceAmount', e.target.value)}
                        className={`pl-10 ${errors.priceAmount ? 'border-destructive' : ''}`}
                      />
                    </div>
                    {errors.priceAmount && (
                      <p className="text-sm text-destructive">{errors.priceAmount}</p>
                    )}
                    {formData.pricingStructure === 'epc' && formData.priceAmount && formData.systemSize && (
                      <p className="text-sm text-muted-foreground">
                        Equivalent PPW: ${(parseFloat(formData.priceAmount) / (parseFloat(formData.systemSize) * 1000)).toFixed(3)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commissionEarned">Commission You Earned ($) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="commissionEarned"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="e.g., 2500"
                      value={formData.commissionEarned}
                      onChange={(e) => updateField('commissionEarned', e.target.value)}
                      className={`pl-10 ${errors.commissionEarned ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.commissionEarned && (
                    <p className="text-sm text-destructive">{errors.commissionEarned}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Adders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5 text-primary" />
                  <span>Adders & Additional Costs</span>
                </CardTitle>
                <CardDescription>
                  Any additional work that reduced company profits (optional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="roofingAdder">Roofing Work ($)</Label>
                    <div className="relative">
                      <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="roofingAdder"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0"
                        value={formData.roofingAdder}
                        onChange={(e) => updateField('roofingAdder', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mpuAdder">Main Panel Upgrade ($)</Label>
                    <div className="relative">
                      <Zap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="mpuAdder"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0"
                        value={formData.mpuAdder}
                        onChange={(e) => updateField('mpuAdder', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="batteryAdder">Battery Storage ($)</Label>
                    <div className="relative">
                      <Battery className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="batteryAdder"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0"
                        value={formData.batteryAdder}
                        onChange={(e) => updateField('batteryAdder', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="otherAdder">Other Additional Costs ($)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="otherAdder"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0"
                        value={formData.otherAdder}
                        onChange={(e) => updateField('otherAdder', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recruiting Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="border-success/20 bg-success/5">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-success" />
                  <span>Recruiting Preview</span>
                </CardTitle>
                <CardDescription>
                  Get a glimpse of recruiting income potential through partner companies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-success/10 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center space-x-2">
                    <Info className="h-4 w-4 text-success" />
                    <span>What if you recruited 3 reps?</span>
                  </h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Each rep averages 3 installs per month</p>
                    <p>• You earn 2.5% of company profits on their deals</p>
                    <p>• Plus your personal commission continues</p>
                    {commissionPreview && commissionPreview.companyProfits > 0 && (
                      <p className="font-semibold text-success mt-2">
                        Estimated monthly recruiting income: ~{formatCurrency(commissionPreview.companyProfits * 0.025 * 3 * 3)}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Live Preview */}
          {commissionPreview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span>Live Calculation Preview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Your Current Commission</p>
                      <p className="text-2xl font-bold text-primary">{formatCurrency(parseFloat(formData.commissionEarned) || 0)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Our Projected Commission</p>
                      <p className="text-2xl font-bold text-success">{formatCurrency(commissionPreview.repCommission)}</p>
                    </div>
                  </div>
                  
                  {commissionPreview.baseline === 0 && (
                    <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <p className="text-sm text-amber-600 dark:text-amber-400">
                        Note: This state is not currently in our service area, so calculations show $0. 
                        We'll still analyze the structure for comparison purposes.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-between pt-6"
          >
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>

            <Button
              type="submit"
              size="lg"
              className="btn-gradient text-white min-w-[200px]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Calculating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Continue to Comparison</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
