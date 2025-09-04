

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft,
  Award,
  DollarSign,
  Users,
  Star,
  Download,
  ExternalLink,
  Mail,
  Calculator,
  TrendingUp
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/calculations';
import TeamLeaderLayout from './team-leader-layout';

interface CalculatorData {
  leadCapture?: any;
  currentCompany?: any;
  calculationResults?: any;
  overrideData?: any;
  overrideResults?: any;
  recruitingData?: any;
  recruitingResults?: any;
  equityData?: any;
  equityResults?: any;
}

export default function LeadershipOpportunitySummary() {
  const router = useRouter();
  const [data, setData] = useState<CalculatorData>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load data from localStorage
    const savedData = localStorage.getItem('calculatorData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setData(parsedData);
    }
  }, []);

  const handleBack = () => {
    router.push('/calculator/team-leader/step-6');
  };

  const handleStartOver = () => {
    localStorage.removeItem('calculatorData');
    router.push('/');
  };

  // Calculate 5-year projections
  const calculate5YearProjections = () => {
    const personalCommissionAnnual = (data.calculationResults?.repCommission || 0) * 36; // 3 installs/month
    const currentCompanyAnnual = (parseFloat(data.currentCompany?.commissionEarned) || 0) * 36;
    const overrideIncomeAnnual = data.overrideResults?.annualOverrides || 0;
    const recruitingIncomeAnnual = data.recruitingResults?.totalAnnualRecruiting || 0;
    const equityBuyoutValue = data.equityResults?.yourShare || 0;

    const personal5Year = personalCommissionAnnual * 5;
    const override5Year = overrideIncomeAnnual * 5;
    const recruiting5Year = recruitingIncomeAnnual * 5;
    const total5YearIncome = personal5Year + override5Year + recruiting5Year;
    const total5YearWithEquity = total5YearIncome + equityBuyoutValue;

    const current5Year = currentCompanyAnnual * 5;
    const opportunityDifference = total5YearWithEquity - current5Year;

    return {
      personalCommissionAnnual,
      currentCompanyAnnual,
      overrideIncomeAnnual,
      recruitingIncomeAnnual,
      equityBuyoutValue,
      personal5Year,
      override5Year,
      recruiting5Year,
      total5YearIncome,
      total5YearWithEquity,
      current5Year,
      opportunityDifference
    };
  };

  const projections = calculate5YearProjections();

  if (!data.leadCapture) {
    return (
      <TeamLeaderLayout title="Team Leadership Calculator" totalSteps={7}>
        <div className="p-6 md:p-8">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">No data found. Please start the calculator from the beginning.</p>
            <Button onClick={handleStartOver}>Start Over</Button>
          </div>
        </div>
      </TeamLeaderLayout>
    );
  }

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
              <Award className="h-8 w-8 text-white" />
            </motion.div>
            
            <h1 className="text-4xl font-bold mb-2">Complete Leadership Opportunity Summary</h1>
            <p className="text-muted-foreground text-lg">
              Your comprehensive leadership opportunity analysis through partner companies
            </p>
          </div>

          {/* Personal Info Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <span>Your Leadership Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Experience Level</p>
                  <p className="font-semibold">{data.leadCapture.experience} years</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Career Installs</p>
                  <p className="font-semibold">{data.leadCapture.careerInstalls}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Primary Motivator</p>
                  <p className="font-semibold capitalize">{data.leadCapture.motivator?.replace('-', ' ')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Income Breakdown */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Annual Income Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <span>Annual Income Breakdown</span>
                </CardTitle>
                <CardDescription>
                  Based on your current deal specifications (36 deals annually)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personal Commission */}
                <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                  <div>
                    <p className="font-medium">Personal Commission</p>
                    <p className="text-sm text-muted-foreground">Current vs Partner Network</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatCurrency(projections.personalCommissionAnnual)}</p>
                    {projections.personalCommissionAnnual > projections.currentCompanyAnnual && (
                      <p className="text-sm text-success">+{formatCurrency(projections.personalCommissionAnnual - projections.currentCompanyAnnual)}</p>
                    )}
                  </div>
                </div>

                {/* Override Income */}
                <div className="flex justify-between items-center p-3 bg-success/5 rounded-lg">
                  <div>
                    <p className="font-medium">Override Income</p>
                    <p className="text-sm text-muted-foreground">{data.overrideResults?.monthlyDeals} deals/month from {data.overrideData?.teamMembers} team members</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-success">{formatCurrency(projections.overrideIncomeAnnual)}</p>
                  </div>
                </div>

                {/* Recruiting Income */}
                <div className="flex justify-between items-center p-3 bg-amber/5 rounded-lg">
                  <div>
                    <p className="font-medium">Recruiting Income</p>
                    <p className="text-sm text-muted-foreground">
                      {(data.recruitingData?.firstGenTeam || 0) + (data.recruitingData?.secondGenTeam || 0) + (data.recruitingData?.thirdGenTeam || 0)} total reps across 3 generations
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-amber-600">{formatCurrency(projections.recruitingIncomeAnnual)}</p>
                  </div>
                </div>

                {/* Total Annual */}
                <Separator />
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-primary/10 to-success/10 rounded-lg border border-primary/20">
                  <div>
                    <p className="font-bold text-lg">Total Annual Income</p>
                    <p className="text-sm text-muted-foreground">Personal + Override + Recruiting</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-2xl text-primary">{formatCurrency(projections.personalCommissionAnnual + projections.overrideIncomeAnnual + projections.recruitingIncomeAnnual)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2029 Equity & 5-Year Value */}
            <Card className="border-success/20 bg-success/5">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-success" />
                  <span>2029 Equity & 5-Year Value</span>
                </CardTitle>
                <CardDescription>
                  Complete opportunity value including equity buyout
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Equity Buyout */}
                <div className="text-center p-4 bg-success/10 rounded-lg border border-success/20">
                  <p className="text-sm text-muted-foreground mb-1">2029 Equity Buyout</p>
                  <p className="text-3xl font-bold text-success">{formatCurrency(projections.equityBuyoutValue)}</p>
                  <p className="text-xs text-muted-foreground">
                    Based on {data.equityData?.totalSystems} annual installs ({data.equityResults?.tier} tier)
                  </p>
                </div>

                {/* 5-Year Breakdown */}
                <div className="space-y-3">
                  <h4 className="font-semibold">5-Year Income Breakdown:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Personal Commission (5 years):</span>
                      <span className="font-medium">{formatCurrency(projections.personal5Year)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Override Income (5 years):</span>
                      <span className="font-medium">{formatCurrency(projections.override5Year)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Recruiting Income (5 years):</span>
                      <span className="font-medium">{formatCurrency(projections.recruiting5Year)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>2029 Equity Buyout:</span>
                      <span className="font-medium">{formatCurrency(projections.equityBuyoutValue)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>TOTAL 5-YEAR VALUE:</span>
                      <span className="text-success">{formatCurrency(projections.total5YearWithEquity)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Opportunity Comparison */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Leadership Opportunity vs Current Position</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="p-6 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Current 5-Year Projection</p>
                  <p className="text-2xl font-bold">{formatCurrency(projections.current5Year)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Personal commission only</p>
                </div>
                
                <div className="p-6 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-2">Partner Network 5-Year</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(projections.total5YearWithEquity)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Complete leadership package</p>
                </div>
                
                <div className="p-6 bg-success/10 rounded-lg border border-success/20">
                  <p className="text-sm text-muted-foreground mb-2">Opportunity Difference</p>
                  <p className="text-2xl font-bold text-success">+{formatCurrency(projections.opportunityDifference)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Additional value through partners</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Connect with Partner Companies */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Ready to Explore This Leadership Opportunity?</CardTitle>
              <CardDescription>
                Connect with partner companies offering these comprehensive leadership packages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">What Happens Next:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Review with qualified partner companies</li>
                    <li>• Discuss leadership role requirements</li>
                    <li>• Explore team building opportunities</li>
                    <li>• Understand territory and market potential</li>
                    <li>• Get clarity on timeline and expectations</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-primary" />
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
                      <p>Have questions about leadership opportunities, team requirements, or partnership details? 
                      Email us first and we'll respond within 24 hours.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Disclaimer */}
          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 mb-8">
            <CardContent className="pt-6">
              <div className="text-center">
                <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-2">
                  Important Disclaimer
                </h4>
                <p className="text-sm text-amber-600 dark:text-amber-400 leading-relaxed">
                  These projections represent potential opportunities with partner companies in our network. 
                  Beacon Solar Solutions facilitates connections but does not directly employ team leaders. 
                  All leadership positions and compensation packages are with third-party solar companies. 
                  Actual results may vary based on market conditions, individual performance, and company policies.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Equity Calculator</span>
            </Button>

            <div className="flex space-x-4">
              <Button variant="outline" onClick={handleStartOver}>
                Start New Calculation
              </Button>
              
              <Button className="btn-gradient text-white">
                <div className="flex items-center space-x-2">
                  <ExternalLink className="h-4 w-4" />
                  <span>Connect with Partners</span>
                </div>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </TeamLeaderLayout>
  );
}

