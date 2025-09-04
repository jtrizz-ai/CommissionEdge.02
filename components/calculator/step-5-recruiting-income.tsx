

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
import { 
  ArrowRight, 
  Users,
  Target,
  DollarSign,
  Info,
  TrendingUp,
  UserPlus
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/calculations';
import TeamLeaderLayout from './team-leader-layout';

interface RecruitingData {
  firstGenTeam: number;
  secondGenTeam: number;
  thirdGenTeam: number;
  avgInstallsPerRep: number;
}

interface CalculatorData {
  leadCapture?: any;
  currentCompany?: any;
  calculationResults?: any;
  overrideData?: any;
  overrideResults?: any;
  recruitingData?: RecruitingData;
}

// Leadership recruiting rates (higher than regular sales reps)
const LEADERSHIP_RECRUITING_RATES = {
  firstGen: 0.075,   // 7.5% of company profits
  secondGen: 0.065,  // 6.5% of company profits  
  thirdGen: 0.06     // 6.0% of company profits
};

export default function RecruitingIncomeCalculator() {
  const router = useRouter();
  const [data, setData] = useState<CalculatorData>({});
  const [recruitingInputs, setRecruitingInputs] = useState<RecruitingData>({
    firstGenTeam: 10,
    secondGenTeam: 20,
    thirdGenTeam: 40,
    avgInstallsPerRep: 3
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load data from localStorage
    const savedData = localStorage.getItem('calculatorData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setData(parsedData);
    }
  }, []);

  // Calculate recruiting income per generation
  const calculateRecruitingIncome = () => {
    const { firstGenTeam, secondGenTeam, thirdGenTeam, avgInstallsPerRep } = recruitingInputs;
    
    // Use company profits from override calculation or default
    const companyProfitPerDeal = data.overrideResults?.companyProfit || 1080;
    
    const firstGenMonthly = firstGenTeam * avgInstallsPerRep * companyProfitPerDeal * LEADERSHIP_RECRUITING_RATES.firstGen;
    const secondGenMonthly = secondGenTeam * avgInstallsPerRep * companyProfitPerDeal * LEADERSHIP_RECRUITING_RATES.secondGen;
    const thirdGenMonthly = thirdGenTeam * avgInstallsPerRep * companyProfitPerDeal * LEADERSHIP_RECRUITING_RATES.thirdGen;
    
    const totalMonthlyRecruiting = firstGenMonthly + secondGenMonthly + thirdGenMonthly;
    const totalAnnualRecruiting = totalMonthlyRecruiting * 12;
    
    // Combined with override income
    const monthlyOverrides = data.overrideResults?.monthlyOverrides || 0;
    const combinedMonthly = monthlyOverrides + totalMonthlyRecruiting;
    const combinedAnnual = combinedMonthly * 12;
    
    return {
      firstGenMonthly,
      secondGenMonthly, 
      thirdGenMonthly,
      totalMonthlyRecruiting,
      totalAnnualRecruiting,
      monthlyOverrides,
      combinedMonthly,
      combinedAnnual,
      companyProfitPerDeal
    };
  };

  const recruitingResults = calculateRecruitingIncome();

  const handleInputChange = (field: keyof RecruitingData, value: number) => {
    setRecruitingInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = async () => {
    setIsLoading(true);
    
    // Save recruiting data
    const updatedData = {
      ...data,
      recruitingData: recruitingInputs,
      recruitingResults
    };
    
    localStorage.setItem('calculatorData', JSON.stringify(updatedData));
    
    // Navigate to next step
    router.push('/calculator/team-leader/step-6');
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
              <Users className="h-8 w-8 text-white" />
            </motion.div>
            
            <h1 className="text-3xl font-bold mb-2">Multi-Generation Recruiting Income</h1>
            <p className="text-muted-foreground text-lg">
              Calculate your recruiting income potential across multiple generations through partner companies
            </p>
          </div>

          {/* Team Structure Controls */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Generation Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserPlus className="h-5 w-5 text-primary" />
                  <span>Your Team Breakdown</span>
                </CardTitle>
                <CardDescription>
                  Adjust team sizes for each generation of recruits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 1st Generation */}
                <div className="space-y-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between">
                    <Label className="font-semibold">1st Generation (Direct Reports)</Label>
                    <Badge className="bg-primary text-primary-foreground">7.5% Rate</Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[recruitingInputs.firstGenTeam]}
                      onValueChange={([value]) => handleInputChange('firstGenTeam', value)}
                      max={50}
                      min={0}
                      step={1}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={recruitingInputs.firstGenTeam}
                      onChange={(e) => handleInputChange('firstGenTeam', parseInt(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">reps</span>
                  </div>
                </div>

                {/* 2nd Generation */}
                <div className="space-y-3 p-4 bg-success/5 rounded-lg border border-success/20">
                  <div className="flex items-center justify-between">
                    <Label className="font-semibold">2nd Generation (Their Reports)</Label>
                    <Badge variant="secondary">6.5% Rate</Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[recruitingInputs.secondGenTeam]}
                      onValueChange={([value]) => handleInputChange('secondGenTeam', value)}
                      max={100}
                      min={0}
                      step={1}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={recruitingInputs.secondGenTeam}
                      onChange={(e) => handleInputChange('secondGenTeam', parseInt(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">reps</span>
                  </div>
                </div>

                {/* 3rd Generation */}
                <div className="space-y-3 p-4 bg-amber/5 rounded-lg border border-amber/20">
                  <div className="flex items-center justify-between">
                    <Label className="font-semibold">3rd Generation (Their Reports)</Label>
                    <Badge variant="outline">6.0% Rate</Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[recruitingInputs.thirdGenTeam]}
                      onValueChange={([value]) => handleInputChange('thirdGenTeam', value)}
                      max={200}
                      min={0}
                      step={1}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={recruitingInputs.thirdGenTeam}
                      onChange={(e) => handleInputChange('thirdGenTeam', parseInt(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">reps</span>
                  </div>
                </div>

                {/* Average Installs */}
                <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                  <Label className="font-semibold">Average Installs per Rep per Month</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[recruitingInputs.avgInstallsPerRep]}
                      onValueChange={([value]) => handleInputChange('avgInstallsPerRep', value)}
                      max={10}
                      min={1}
                      step={1}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={recruitingInputs.avgInstallsPerRep}
                      onChange={(e) => handleInputChange('avgInstallsPerRep', parseInt(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">installs</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Display */}
            <Card className="border-success/20 bg-success/5">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-success" />
                  <span>Recruiting Income Breakdown</span>
                </CardTitle>
                <CardDescription>
                  Your potential recruiting income from multi-generational teams
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Generation Breakdown */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                      <div>
                        <p className="font-medium">1st Gen: {recruitingInputs.firstGenTeam} reps × {recruitingInputs.avgInstallsPerRep} installs</p>
                        <p className="text-sm text-muted-foreground">{recruitingInputs.firstGenTeam * recruitingInputs.avgInstallsPerRep} deals × {formatCurrency(recruitingResults.companyProfitPerDeal * LEADERSHIP_RECRUITING_RATES.firstGen)}/deal</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">{formatCurrency(recruitingResults.firstGenMonthly)}</p>
                        <p className="text-sm text-muted-foreground">/month</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                      <div>
                        <p className="font-medium">2nd Gen: {recruitingInputs.secondGenTeam} reps × {recruitingInputs.avgInstallsPerRep} installs</p>
                        <p className="text-sm text-muted-foreground">{recruitingInputs.secondGenTeam * recruitingInputs.avgInstallsPerRep} deals × {formatCurrency(recruitingResults.companyProfitPerDeal * LEADERSHIP_RECRUITING_RATES.secondGen)}/deal</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-success">{formatCurrency(recruitingResults.secondGenMonthly)}</p>
                        <p className="text-sm text-muted-foreground">/month</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-amber/10 rounded-lg">
                      <div>
                        <p className="font-medium">3rd Gen: {recruitingInputs.thirdGenTeam} reps × {recruitingInputs.avgInstallsPerRep} installs</p>
                        <p className="text-sm text-muted-foreground">{recruitingInputs.thirdGenTeam * recruitingInputs.avgInstallsPerRep} deals × {formatCurrency(recruitingResults.companyProfitPerDeal * LEADERSHIP_RECRUITING_RATES.thirdGen)}/deal</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-amber-600">{formatCurrency(recruitingResults.thirdGenMonthly)}</p>
                        <p className="text-sm text-muted-foreground">/month</p>
                      </div>
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="space-y-4 pt-4 border-t border-success/20">
                    <div className="flex justify-between">
                      <p className="font-semibold">Total Monthly Recruiting Income:</p>
                      <p className="text-xl font-bold text-success">{formatCurrency(recruitingResults.totalMonthlyRecruiting)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-semibold">Annual Recruiting Income:</p>
                      <p className="text-lg font-bold">{formatCurrency(recruitingResults.totalAnnualRecruiting)}</p>
                    </div>
                  </div>

                  {/* Combined Leadership Income */}
                  <div className="p-4 bg-gradient-to-r from-primary/10 to-success/10 rounded-lg border border-primary/20">
                    <h4 className="font-semibold mb-3 text-center">Combined Leadership Income</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Override Income:</span>
                        <span className="font-medium">{formatCurrency(recruitingResults.monthlyOverrides)}/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Recruiting Income:</span>
                        <span className="font-medium">{formatCurrency(recruitingResults.totalMonthlyRecruiting)}/month</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-primary/20 font-bold text-lg">
                        <span>Total Monthly:</span>
                        <span className="text-primary">{formatCurrency(recruitingResults.combinedMonthly)}</span>
                      </div>
                      <div className="text-center text-muted-foreground">
                        ({formatCurrency(recruitingResults.combinedAnnual)} annually)
                      </div>
                    </div>
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
                  <p className="font-semibold text-primary">Leadership Recruiting Income Rates</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    As a district manager or team leader, you earn higher recruiting income rates compared to individual sales reps. 
                    These percentages apply to company profits from each deal your network closes, creating substantial passive income 
                    as your organization grows through partner companies.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

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
                  <span>Continue to 2029 Equity Calculator</span>
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

