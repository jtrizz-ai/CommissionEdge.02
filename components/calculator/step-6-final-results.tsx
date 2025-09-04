
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Trophy,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Users,
  Calculator,
  Share2,
  Download,
  ArrowLeft,
  Star,
  Zap,
  Target,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { formatCurrency, calculateCommission, calculateBuilderPay } from '@/lib/calculations';
import { US_STATES, DEAL_TYPES } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';

interface CalculatorData {
  leadCapture?: any;
  currentCompany?: any;
  calculationResults?: any;
}

interface OpenCalculatorInputs {
  systemSize: string;
  state: string;
  dealType: 'ownership' | 'lease' | '';
  priceAmount: string;
}

export default function FinalResults() {
  const [data, setData] = useState<CalculatorData>({});
  const [showOpenCalculator, setShowOpenCalculator] = useState(false);
  const [openCalcInputs, setOpenCalcInputs] = useState<OpenCalculatorInputs>({
    systemSize: '',
    state: '',
    dealType: '',
    priceAmount: ''
  });
  const [openCalcResults, setOpenCalcResults] = useState<any>(null);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [hasSubmittedLead, setHasSubmittedLead] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('calculatorData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setData(parsedData);
        
        // Pre-populate open calculator with current data
        if (parsedData.currentCompany) {
          setOpenCalcInputs({
            systemSize: parsedData.currentCompany.systemSize || '',
            state: parsedData.currentCompany.state || '',
            dealType: parsedData.currentCompany.dealType || '',
            priceAmount: parsedData.currentCompany.priceAmount || ''
          });
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
        router.push('/calculator/sales-rep/step-1');
      }
    } else {
      router.push('/calculator/sales-rep/step-1');
    }
  }, [router]);

  const handleBack = () => {
    router.push('/calculator/sales-rep/step-5');
  };

  const handleStartOver = () => {
    localStorage.removeItem('calculatorData');
    router.push('/');
  };

  const handleShareResults = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CommissionEdge Calculator Results',
          text: `I just discovered my true solar commission potential with CommissionEdge! Check out this professional calculator.`,
          url: window.location.origin
        });
      } catch (error) {
        console.log('Error sharing:', error);
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    toast({
      title: "Link Copied",
      description: "CommissionEdge calculator link copied to clipboard!",
    });
  };

  const handleSubmitLead = async () => {
    if (!data.leadCapture) return;
    
    setIsSubmittingLead(true);
    
    try {
      // Here we would normally submit to database
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setHasSubmittedLead(true);
      toast({
        title: "Information Submitted Successfully!",
        description: "We'll connect you with hiring companies in our network within 24 hours.",
      });

      // Send results email (simulated)
      toast({
        title: "Results Email Sent",
        description: `Detailed analysis sent to ${data.leadCapture.email}`,
      });
    } catch (error) {
      console.error('Error submitting lead:', error);
      toast({
        title: "Submission Error",
        description: "There was an issue submitting your information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const calculateOpenResults = () => {
    if (!data.leadCapture || !openCalcInputs.systemSize || !openCalcInputs.state || 
        !openCalcInputs.dealType || !openCalcInputs.priceAmount) {
      setOpenCalcResults(null);
      return;
    }

    const calculationInputs = {
      systemSize: parseFloat(openCalcInputs.systemSize),
      state: openCalcInputs.state,
      dealType: openCalcInputs.dealType as 'ownership' | 'lease',
      priceAmount: parseFloat(openCalcInputs.priceAmount),
      roofingAdder: 0,
      mpuAdder: 0,
      batteryAdder: 0,
      otherAdder: 0,
      experience: data.leadCapture.experience,
      careerInstalls: data.leadCapture.careerInstalls
    };

    const results = calculateCommission(calculationInputs);
    setOpenCalcResults(results);
  };

  useEffect(() => {
    calculateOpenResults();
  }, [openCalcInputs, data.leadCapture]);

  if (!data.leadCapture || !data.currentCompany || !data.calculationResults) {
    return (
      <div className="p-6 md:p-8 text-center">
        <div className="max-w-md mx-auto">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Missing Data</h2>
          <p className="text-muted-foreground mb-4">
            Please complete the previous steps to see your final results.
          </p>
          <Button onClick={() => router.push('/calculator/sales-rep/step-1')}>
            Start Over
          </Button>
        </div>
      </div>
    );
  }

  const { leadCapture, currentCompany, calculationResults } = data;
  const currentCommission = parseFloat(currentCompany.commissionEarned) || 0;
  const projectedCommission = calculationResults.repCommission;
  const annualIncrease = (projectedCommission - currentCommission) * 12;

  // Calculate recruiting income example
  const builderPayExample = calculateBuilderPay({
    generation1Reps: 3,
    generation2Reps: 0,
    generation3Reps: 0,
    avgInstallsPerMonth: 3,
    avgSystemSize: parseFloat(currentCompany.systemSize) || 10,
    avgCompanyProfits: calculationResults.companyProfits || 1000
  }, projectedCommission);

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
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-success to-primary rounded-full flex items-center justify-center"
          >
            <Trophy className="h-8 w-8 text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-bold mb-2">Your Solar Career Analysis</h1>
          <p className="text-muted-foreground text-lg">
            Complete commission breakdown and next steps for {leadCapture.name}
          </p>
          
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Badge variant="secondary">{leadCapture.experience} years experience</Badge>
            <Badge variant="secondary">{leadCapture.careerInstalls} installs</Badge>
            <Badge variant="secondary">Seeking {leadCapture.motivator.toLowerCase()}</Badge>
          </div>
        </div>

        {/* Key Results Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-success/5">
            <CardHeader>
              <CardTitle className="text-center">Your Opportunity Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Personal Commission Increase</p>
                  <p className="text-2xl font-bold text-primary">
                    {annualIncrease > 0 ? `+${formatCurrency(annualIncrease)}` : formatCurrency(projectedCommission * 12)}
                  </p>
                  <p className="text-xs text-muted-foreground">Per year (12 deals)</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Recruiting Income Example</p>
                  <p className="text-2xl font-bold text-success">
                    +{formatCurrency(builderPayExample.annualBuilderPay)}
                  </p>
                  <p className="text-xs text-muted-foreground">With 3 recruits annually</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">2029 Equity Value</p>
                  <p className="text-2xl font-bold text-success">
                    {formatCurrency(builderPayExample.equityValue2029)}
                  </p>
                  <p className="text-xs text-muted-foreground">Wealth building opportunity</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-primary/20">
                <div className="text-center">
                  <p className="font-semibold mb-2">Total Annual Potential with Recruiting Income</p>
                  <p className="text-4xl font-bold text-success">
                    {formatCurrency(builderPayExample.combinedAnnualIncome)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(projectedCommission * 12)} personal + {formatCurrency(builderPayExample.annualBuilderPay)} recruiting income
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Legal Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-8"
        >
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-amber-700 dark:text-amber-300">Employment Disclaimer</p>
                <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                  These calculations represent potential earnings with solar industry partners. Beacon Solar Solutions 
                  facilitates introductions but does not directly employ sales representatives. All employment relationships 
                  are with independent solar companies and installers in our partner network.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Next Steps CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Connect with Partner Companies</CardTitle>
              <CardDescription className="text-center">
                Multiple ways to explore opportunities in our network of solar companies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center space-x-2">
                    <Star className="h-5 w-5 text-primary" />
                    <span>Express Interest</span>
                  </h4>
                  
                  {!hasSubmittedLead ? (
                    <div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Connect with hiring companies in our network. We'll review your profile and facilitate introductions.
                      </p>
                      <Button
                        onClick={handleSubmitLead}
                        className="w-full btn-gradient text-white"
                        size="lg"
                        disabled={isSubmittingLead}
                      >
                        {isSubmittingLead ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Submitting...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Connect Me With Partner Companies</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="p-4 bg-success/10 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-success">Information Submitted!</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            We'll review your profile and connect you with hiring companies in our network within 24 hours.
                            Results have been emailed to {leadCapture.email}.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-primary" />
                    <span>Questions Before Connecting</span>
                  </h4>
                  
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href="mailto:beaconsolarsolution@gmail.com" className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>Email: beaconsolarsolution@gmail.com</span>
                      </a>
                    </Button>
                    
                    <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg">
                      <p>Have questions about opportunities, commission structure, or partnership details? 
                      Email us first and we'll respond within 24 hours.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Open Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    <span>Open Calculator</span>
                  </CardTitle>
                  <CardDescription>
                    Experiment with different deal scenarios
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowOpenCalculator(!showOpenCalculator)}
                >
                  {showOpenCalculator ? 'Hide' : 'Show'} Calculator
                </Button>
              </div>
            </CardHeader>
            
            {showOpenCalculator && (
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>System Size (kW)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="e.g., 12.5"
                        value={openCalcInputs.systemSize}
                        onChange={(e) => setOpenCalcInputs(prev => ({
                          ...prev,
                          systemSize: e.target.value
                        }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>State</Label>
                      <Select 
                        value={openCalcInputs.state} 
                        onValueChange={(value) => setOpenCalcInputs(prev => ({
                          ...prev,
                          state: value
                        }))}
                      >
                        <SelectTrigger>
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
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Deal Type</Label>
                      <Select 
                        value={openCalcInputs.dealType} 
                        onValueChange={(value) => setOpenCalcInputs(prev => ({
                          ...prev,
                          dealType: value as 'ownership' | 'lease'
                        }))}
                      >
                        <SelectTrigger>
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
                    </div>

                    <div className="space-y-2">
                      <Label>Price Per Watt ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="e.g., 4.50"
                        value={openCalcInputs.priceAmount}
                        onChange={(e) => setOpenCalcInputs(prev => ({
                          ...prev,
                          priceAmount: e.target.value
                        }))}
                      />
                    </div>
                  </div>

                  {openCalcResults && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="p-4 bg-primary/10 rounded-lg"
                    >
                      <h4 className="font-semibold mb-3">Calculation Results</h4>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Baseline PPW</p>
                          <p className="font-semibold">
                            {openCalcResults.baseline > 0 
                              ? `$${openCalcResults.baseline.toFixed(3)}`
                              : 'Not Available'
                            }
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Company Profits</p>
                          <p className="font-semibold">{formatCurrency(openCalcResults.companyProfits)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Your Commission</p>
                          <p className="font-semibold text-primary text-lg">
                            {formatCurrency(openCalcResults.repCommission)}
                          </p>
                        </div>
                      </div>
                      
                      {openCalcResults.baseline === 0 && (
                        <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                          <p className="text-sm text-amber-600 dark:text-amber-400">
                            This state is not currently in our service area.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        </motion.div>

        {/* Share & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Share Your Results</CardTitle>
              <CardDescription className="text-center">
                Help others discover their solar commission potential
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="outline" onClick={handleShareResults}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Calculator
                </Button>
                
                <Button variant="outline" onClick={handleCopyLink}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
                
                <Button variant="outline" onClick={() => window.print()}>
                  <Download className="h-4 w-4 mr-2" />
                  Print Results
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex justify-between pt-6"
        >
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Recruiting Income</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleStartOver}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Start New Calculation</span>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
