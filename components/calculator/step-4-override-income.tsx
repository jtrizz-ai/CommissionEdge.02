

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { 
  ArrowRight, 
  Calculator,
  Users,
  Target,
  DollarSign,
  Info,
  TrendingUp
} from 'lucide-react';
import { formatCurrency, formatNumber, getBaselinePrice } from '@/lib/calculations';
import TeamLeaderLayout from './team-leader-layout';

interface OverrideData {
  systemSize: number;
  grossPPW: number;
  state: string;
  baseline: number;
  teamMembers: number;
  installsPerMember: number;
}

interface CalculatorData {
  leadCapture?: any;
  currentCompany?: any;
  calculationResults?: any;
  overrideData?: OverrideData;
}

export default function OverrideIncomeCalculator() {
  const router = useRouter();
  const [data, setData] = useState<CalculatorData>({});
  const [overrideInputs, setOverrideInputs] = useState<OverrideData>({
    systemSize: 8.5,
    grossPPW: 4.50,
    state: 'CA',
    baseline: 2.15,
    teamMembers: 5,
    installsPerMember: 5
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load data from localStorage
    const savedData = localStorage.getItem('calculatorData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setData(parsedData);
      
      // Auto-fill state and baseline if available
      if (parsedData.leadCapture?.state) {
        const state = parsedData.leadCapture.state;
        const baseline = getBaselinePrice(state, 'lease') || 2.15;
        setOverrideInputs(prev => ({
          ...prev,
          state,
          baseline
        }));
      }
    }
  }, []);

  // Calculate override income
  const calculateOverrides = () => {
    const { systemSize, grossPPW, baseline, teamMembers, installsPerMember } = overrideInputs;
    
    const profitPerWatt = grossPPW - baseline;
    const systemWatts = systemSize * 1000;
    const totalProfit = profitPerWatt * systemWatts;
    const companyProfit = totalProfit * 0.8; // Company keeps 80%
    const overridePerDeal = companyProfit * 0.05; // 5% override rate
    
    const monthlyDeals = teamMembers * installsPerMember;
    const monthlyOverrides = overridePerDeal * monthlyDeals;
    const annualOverrides = monthlyOverrides * 12;
    
    return {
      profitPerWatt,
      totalProfit,
      companyProfit,
      overridePerDeal,
      monthlyDeals,
      monthlyOverrides,
      annualOverrides
    };
  };

  const overrideResults = calculateOverrides();

  const handleInputChange = (field: keyof OverrideData, value: number) => {
    setOverrideInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = async () => {
    setIsLoading(true);
    
    // Save override data
    const updatedData = {
      ...data,
      overrideData: overrideInputs,
      overrideResults
    };
    
    localStorage.setItem('calculatorData', JSON.stringify(updatedData));
    
    // Navigate to next step
    router.push('/calculator/team-leader/step-5');
  };

  return (
    <TeamLeaderLayout title="Team Leadership Calculator" totalSteps={7}>
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
              className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-success rounded-full flex items-center justify-center"
            >
              <Calculator className="h-8 w-8 text-white" />
            </motion.div>
            
            <h1 className="text-3xl font-bold mb-2">Override Income Calculator</h1>
            <p className="text-muted-foreground text-lg">
              Calculate your potential override income from leading a high-performing team
            </p>
          </div>

          {/* Calculator Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Input Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span>Team & Deal Parameters</span>
                </CardTitle>
                <CardDescription>
                  Adjust the parameters to match your leadership scenario
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* System Size */}
                <div className="space-y-2">
                  <Label htmlFor="systemSize">Average System Size (kW)</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[overrideInputs.systemSize]}
                      onValueChange={([value]) => handleInputChange('systemSize', value)}
                      max={15}
                      min={4}
                      step={0.5}
                      className="flex-1"
                    />
                    <Input
                      id="systemSize"
                      type="number"
                      value={overrideInputs.systemSize}
                      onChange={(e) => handleInputChange('systemSize', parseFloat(e.target.value))}
                      className="w-20"
                      step="0.5"
                    />
                  </div>
                </div>

                {/* Gross PPW */}
                <div className="space-y-2">
                  <Label htmlFor="grossPPW">Gross Price Per Watt ($)</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[overrideInputs.grossPPW]}
                      onValueChange={([value]) => handleInputChange('grossPPW', value)}
                      max={5}
                      min={2.5}
                      step={0.05}
                      className="flex-1"
                    />
                    <Input
                      id="grossPPW"
                      type="number"
                      value={overrideInputs.grossPPW}
                      onChange={(e) => handleInputChange('grossPPW', parseFloat(e.target.value))}
                      className="w-20"
                      step="0.05"
                    />
                  </div>
                </div>

                {/* Team Size */}
                <div className="space-y-2">
                  <Label htmlFor="teamMembers">Number of Team Members</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[overrideInputs.teamMembers]}
                      onValueChange={([value]) => handleInputChange('teamMembers', value)}
                      max={50}
                      min={1}
                      step={1}
                      className="flex-1"
                    />
                    <Input
                      id="teamMembers"
                      type="number"
                      value={overrideInputs.teamMembers}
                      onChange={(e) => handleInputChange('teamMembers', parseInt(e.target.value))}
                      className="w-20"
                    />
                  </div>
                </div>

                {/* Installs Per Member */}
                <div className="space-y-2">
                  <Label htmlFor="installsPerMember">Avg Installs per Team Member/Month</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[overrideInputs.installsPerMember]}
                      onValueChange={([value]) => handleInputChange('installsPerMember', value)}
                      max={20}
                      min={1}
                      step={1}
                      className="flex-1"
                    />
                    <Input
                      id="installsPerMember"
                      type="number"
                      value={overrideInputs.installsPerMember}
                      onChange={(e) => handleInputChange('installsPerMember', parseInt(e.target.value))}
                      className="w-20"
                    />
                  </div>
                </div>

                {/* State & Baseline Info */}
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm">
                    <p><strong>State:</strong> {overrideInputs.state}</p>
                    <p><strong>Baseline:</strong> {formatCurrency(overrideInputs.baseline)}/watt</p>
                    <p className="text-muted-foreground mt-1">
                      Profit per watt: {formatCurrency(overrideInputs.grossPPW - overrideInputs.baseline)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Display */}
            <Card className="border-success/20 bg-success/5">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-success" />
                  <span>Override Income Results</span>
                </CardTitle>
                <CardDescription>
                  Your potential override income from team leadership
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-background/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Monthly Deals</p>
                      <p className="text-2xl font-bold text-primary">
                        {overrideResults.monthlyDeals}
                      </p>
                    </div>
                    <div className="p-3 bg-background/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Override per Deal</p>
                      <p className="text-2xl font-bold text-success">
                        {formatCurrency(overrideResults.overridePerDeal)}
                      </p>
                    </div>
                  </div>

                  {/* Income Summary */}
                  <div className="space-y-4 pt-4 border-t border-success/20">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Monthly Override Income</p>
                      <p className="text-3xl font-bold text-success">
                        {formatCurrency(overrideResults.monthlyOverrides)}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Annual Override Income</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(overrideResults.annualOverrides)}
                      </p>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center space-x-2">
                      <Info className="h-4 w-4 text-primary" />
                      <span>Calculation Breakdown</span>
                    </h4>
                    <div className="text-sm space-y-1">
                      <p>System: {overrideInputs.systemSize}kW @ {formatCurrency(overrideInputs.grossPPW)} PPW</p>
                      <p>Team: {overrideInputs.teamMembers} members × {overrideInputs.installsPerMember} installs = {overrideResults.monthlyDeals} deals/month</p>
                      <p>Override Rate: 5% of company profits per deal</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation */}
          <div className="flex justify-center">
            <Button
              onClick={handleNext}
              disabled={isLoading}
              size="lg"
              className="btn-gradient text-white min-w-48"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Continue to Recruiting Income</span>
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

