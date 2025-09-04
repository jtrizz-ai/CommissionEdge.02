

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowRight, 
  Star,
  Target,
  DollarSign,
  Info,
  TrendingUp,
  Calculator
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/calculations';
import TeamLeaderLayout from './team-leader-layout';

interface EquityData {
  totalSystems: number;
  selfGenPercentage: number;
  avgSystemSize: number;
  managerPercentage: number;
}

interface CalculatorData {
  leadCapture?: any;
  currentCompany?: any;
  calculationResults?: any;
  overrideData?: any;
  overrideResults?: any;
  recruitingData?: any;
  recruitingResults?: any;
  equityData?: EquityData;
}

// 2029 Equity Buyout Rate Structure
const EQUITY_RATES = {
  '0-149': { selfGen: 0.00, companyLeads: 0.00 },
  '150-249': { selfGen: 0.06, companyLeads: 0.03 },
  '250-399': { selfGen: 0.07, companyLeads: 0.035 },
  '400-599': { selfGen: 0.08, companyLeads: 0.04 },
  '600-799': { selfGen: 0.09, companyLeads: 0.045 },
  '800+': { selfGen: 0.10, companyLeads: 0.05 }
};

// Function to determine tier based on total installs
const getTier = (totalInstalls: number): keyof typeof EQUITY_RATES => {
  if (totalInstalls < 150) return '0-149';
  if (totalInstalls < 250) return '150-249';
  if (totalInstalls < 400) return '250-399';
  if (totalInstalls < 600) return '400-599';
  if (totalInstalls < 800) return '600-799';
  return '800+';
};

export default function EquityBuyoutCalculator() {
  const router = useRouter();
  const [data, setData] = useState<CalculatorData>({});
  const [equityInputs, setEquityInputs] = useState<EquityData>({
    totalSystems: 720,
    selfGenPercentage: 70,
    avgSystemSize: 8500,
    managerPercentage: 100
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load data from localStorage
    const savedData = localStorage.getItem('calculatorData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setData(parsedData);
      
      // Auto-calculate total systems from previous data
      if (parsedData.overrideResults && parsedData.recruitingResults) {
        const overrideDeals = parsedData.overrideResults.monthlyDeals * 12 || 0;
        const recruitingDeals = 
          ((parsedData.recruitingData.firstGenTeam || 0) + 
           (parsedData.recruitingData.secondGenTeam || 0) + 
           (parsedData.recruitingData.thirdGenTeam || 0)) * 
          (parsedData.recruitingData.avgInstallsPerRep || 3) * 12;
        
        const totalCalculated = overrideDeals + recruitingDeals;
        if (totalCalculated > 0) {
          setEquityInputs(prev => ({
            ...prev,
            totalSystems: totalCalculated
          }));
        }
      }
    }
  }, []);

  // Calculate equity buyout value
  const calculateEquity = () => {
    const { totalSystems, selfGenPercentage, avgSystemSize, managerPercentage } = equityInputs;
    
    const tier = getTier(totalSystems);
    const rates = EQUITY_RATES[tier];
    
    const selfGenProjects = Math.floor(totalSystems * (selfGenPercentage / 100));
    const companyProjects = totalSystems - selfGenProjects;
    
    const selfGenValue = selfGenProjects * avgSystemSize * rates.selfGen;
    const companyValue = companyProjects * avgSystemSize * rates.companyLeads;
    const totalPool = selfGenValue + companyValue;
    
    const yourShare = totalPool * (managerPercentage / 100);
    
    return {
      tier,
      rates,
      selfGenProjects,
      companyProjects,
      selfGenValue,
      companyValue,
      totalPool,
      yourShare
    };
  };

  const equityResults = calculateEquity();

  const handleInputChange = (field: keyof EquityData, value: number) => {
    setEquityInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = async () => {
    setIsLoading(true);
    
    // Save equity data
    const updatedData = {
      ...data,
      equityData: equityInputs,
      equityResults
    };
    
    localStorage.setItem('calculatorData', JSON.stringify(updatedData));
    
    // Navigate to next step
    router.push('/calculator/team-leader/step-7');
  };

  // Get all tier info for display
  const getTierInfo = () => {
    return Object.entries(EQUITY_RATES).map(([tierName, rates]) => ({
      name: tierName,
      selfGen: rates.selfGen,
      companyLeads: rates.companyLeads,
      isActive: tierName === equityResults.tier
    }));
  };

  return (
    <TeamLeaderLayout title="Team Leadership Calculator" totalSteps={7}>
      <div className="p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-success rounded-full flex items-center justify-center"
            >
              <Star className="h-8 w-8 text-white" />
            </motion.div>
            
            <h1 className="text-3xl font-bold mb-2">2029 Equity Buyout Calculator</h1>
            <p className="text-muted-foreground text-lg">
              Calculate your potential 2029 equity buyout value based on team performance and leadership achievements
            </p>
          </div>

          {/* Rate Tier Structure */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-primary" />
                <span>2029 Equity Buyout Rate Structure</span>
              </CardTitle>
              <CardDescription>
                Rates per watt based on total annual installs (12-month period before buyout)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {getTierInfo().map((tier) => (
                  <div
                    key={tier.name}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      tier.isActive
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-muted bg-muted/20'
                    }`}
                  >
                    <div className="text-center">
                      <h4 className={`font-semibold mb-2 ${tier.isActive ? 'text-primary' : ''}`}>
                        {tier.name} Installs
                      </h4>
                      {tier.isActive && <Badge className="mb-2">Your Tier</Badge>}
                      <div className="space-y-1 text-sm">
                        <p>Self-Gen: <span className="font-bold">${tier.selfGen.toFixed(3)}/watt</span></p>
                        <p>Company Leads: <span className="font-bold">${tier.companyLeads.toFixed(3)}/watt</span></p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Calculator Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Input Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  <span>Equity Parameters</span>
                </CardTitle>
                <CardDescription>
                  Adjust the parameters based on your projected team performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Total Systems */}
                <div className="space-y-2">
                  <Label htmlFor="totalSystems">Total Systems (12-month period)</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[equityInputs.totalSystems]}
                      onValueChange={([value]) => handleInputChange('totalSystems', value)}
                      max={1500}
                      min={100}
                      step={10}
                      className="flex-1"
                    />
                    <Input
                      id="totalSystems"
                      type="number"
                      value={equityInputs.totalSystems}
                      onChange={(e) => handleInputChange('totalSystems', parseInt(e.target.value))}
                      className="w-24"
                      step="10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Based on your team's override income + recruiting network performance
                  </p>
                </div>

                {/* Self-Generated Percentage */}
                <div className="space-y-2">
                  <Label htmlFor="selfGenPercentage">Self-Generated Projects (%)</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[equityInputs.selfGenPercentage]}
                      onValueChange={([value]) => handleInputChange('selfGenPercentage', value)}
                      max={100}
                      min={0}
                      step={5}
                      className="flex-1"
                    />
                    <Input
                      id="selfGenPercentage"
                      type="number"
                      value={equityInputs.selfGenPercentage}
                      onChange={(e) => handleInputChange('selfGenPercentage', parseInt(e.target.value))}
                      className="w-20"
                      step="5"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                  <Progress value={equityInputs.selfGenPercentage} className="h-2" />
                </div>

                {/* Average System Size */}
                <div className="space-y-2">
                  <Label htmlFor="avgSystemSize">Average System Size (watts)</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[equityInputs.avgSystemSize]}
                      onValueChange={([value]) => handleInputChange('avgSystemSize', value)}
                      max={15000}
                      min={5000}
                      step={500}
                      className="flex-1"
                    />
                    <Input
                      id="avgSystemSize"
                      type="number"
                      value={equityInputs.avgSystemSize}
                      onChange={(e) => handleInputChange('avgSystemSize', parseInt(e.target.value))}
                      className="w-24"
                      step="500"
                    />
                  </div>
                </div>

                {/* Manager Percentage */}
                <div className="space-y-2">
                  <Label htmlFor="managerPercentage">Your Manager Equity Percentage</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[equityInputs.managerPercentage]}
                      onValueChange={([value]) => handleInputChange('managerPercentage', value)}
                      max={100}
                      min={50}
                      step={5}
                      className="flex-1"
                    />
                    <Input
                      id="managerPercentage"
                      type="number"
                      value={equityInputs.managerPercentage}
                      onChange={(e) => handleInputChange('managerPercentage', parseInt(e.target.value))}
                      className="w-20"
                      step="5"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Leadership roles typically qualify for 80-100% of available equity pool
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Results Display */}
            <Card className="border-success/20 bg-success/5">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-success" />
                  <span>2029 Equity Buyout Projection</span>
                </CardTitle>
                <CardDescription>
                  Your projected equity value based on team performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Current Tier Display */}
                  <div className="p-4 bg-primary/10 rounded-lg text-center">
                    <h4 className="font-bold text-lg text-primary mb-2">
                      Your Tier: {equityResults.tier} Installs
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Self-Gen Rate</p>
                        <p className="font-bold">${equityResults.rates.selfGen.toFixed(3)}/watt</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Company Rate</p>
                        <p className="font-bold">${equityResults.rates.companyLeads.toFixed(3)}/watt</p>
                      </div>
                    </div>
                  </div>

                  {/* Calculation Breakdown */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3">Equity Calculation:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total Systems (12 months):</span>
                          <span className="font-medium">{formatNumber(equityInputs.totalSystems)} installs</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Self-Generated ({equityInputs.selfGenPercentage}%):</span>
                          <span className="font-medium">{formatNumber(equityResults.selfGenProjects)} installs</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Company Leads ({100 - equityInputs.selfGenPercentage}%):</span>
                          <span className="font-medium">{formatNumber(equityResults.companyProjects)} installs</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-success/20">
                      <div className="flex justify-between">
                        <span>Self-Gen Value:</span>
                        <span className="font-medium">{formatCurrency(equityResults.selfGenValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Company Value:</span>
                        <span className="font-medium">{formatCurrency(equityResults.companyValue)}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Total Equity Pool:</span>
                        <span>{formatCurrency(equityResults.totalPool)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-success pt-2 border-t border-success/20">
                        <span>Your Share ({equityInputs.managerPercentage}%):</span>
                        <span>{formatCurrency(equityResults.yourShare)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Final Buyout Value */}
                  <div className="p-4 bg-gradient-to-r from-success/10 to-primary/10 rounded-lg text-center border border-success/20">
                    <h4 className="font-semibold mb-2">Total 2029 Buyout Value</h4>
                    <p className="text-3xl font-bold text-success">{formatCurrency(equityResults.yourShare)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Section */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-primary">How the 2029 Equity Buyout Works</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    The 2029 equity buyout is based on your team's performance in the final 12-month period before the buyout date. 
                    Self-generated projects (leads you or your team develop) earn higher rates than company-provided leads. 
                    Higher total install volumes unlock better per-watt rates across all tiers. This creates substantial value 
                    for successful team leaders who build large, productive organizations through partner companies.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-center">
            <Button
              onClick={handleNext}
              disabled={isLoading || equityInputs.totalSystems < 150}
              size="lg"
              className="btn-gradient text-white min-w-48"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : equityInputs.totalSystems < 150 ? (
                <span>Need 150+ installs to qualify</span>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>View Complete Summary</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </TeamLeaderLayout>
  );
}

