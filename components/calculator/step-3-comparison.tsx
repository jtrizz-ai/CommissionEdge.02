
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Users,
  Award,
  ArrowRight,
  ArrowLeft,
  Calculator,
  Building,
  Target,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { formatCurrency, formatNumber, calculateBuilderPay } from '@/lib/calculations';
import { useToast } from '@/hooks/use-toast';

interface CalculatorData {
  leadCapture?: any;
  currentCompany?: any;
  calculationResults?: any;
}

interface ComparisonResultsProps {
  calculatorType?: 'sales-rep' | 'team-leader';
}

export default function ComparisonResults({ calculatorType = 'sales-rep' }: ComparisonResultsProps = {}) {
  const [data, setData] = useState<CalculatorData>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('calculatorData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setData(parsedData);
      } catch (error) {
        console.error('Error loading saved data:', error);
        // Redirect back to step 1 if data is corrupted
        router.push(`/calculator/${calculatorType}/step-1`);
      }
    } else {
      // No data found, redirect to step 1
      router.push(`/calculator/${calculatorType}/step-1`);
    }
  }, [router, calculatorType]);

  const handleContinue = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      router.push(`/calculator/${calculatorType}/step-4`);
    }, 1000);
  };

  const handleBack = () => {
    router.push(`/calculator/${calculatorType}/step-2`);
  };

  if (!data.leadCapture || !data.currentCompany || !data.calculationResults) {
    return (
      <div className="p-6 md:p-8 text-center">
        <div className="max-w-md mx-auto">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Missing Data</h2>
          <p className="text-muted-foreground mb-4">
            Please complete the previous steps to see your comparison results.
          </p>
          <Button onClick={() => router.push(`/calculator/${calculatorType}/step-1`)}>
            Start Over
          </Button>
        </div>
      </div>
    );
  }

  const { leadCapture, currentCompany, calculationResults } = data;
  const currentCommission = parseFloat(currentCompany.commissionEarned) || 0;
  const projectedCommission = calculationResults.repCommission;
  const difference = projectedCommission - currentCommission;
  const percentageIncrease = currentCommission > 0 ? (difference / currentCommission) * 100 : 0;

  // Calculate builder pay example (3 reps, 3 installs/month each)
  const builderPayExample = calculateBuilderPay({
    generation1Reps: 3,
    generation2Reps: 0,
    generation3Reps: 0,
    avgInstallsPerMonth: 3,
    avgSystemSize: parseFloat(currentCompany.systemSize) || 10,
    avgCompanyProfits: calculationResults.companyProfits || 1000
  }, projectedCommission);

  const annualPersonalIncrease = difference * 12;
  const totalCombinedAnnual = (projectedCommission * 12) + builderPayExample.annualBuilderPay;

  return (
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
            <TrendingUp className="h-8 w-8 text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-bold mb-2">Our vs Theirs Comparison</h1>
          <p className="text-muted-foreground text-lg">
            See how your earning potential compares with our commission structure
          </p>
          
          <div className="mt-4">
            <Badge variant={difference > 0 ? 'success' : difference < 0 ? 'destructive' : 'secondary'} className="text-sm">
              {difference > 0 && '+'}
              {formatCurrency(difference)} difference per deal
            </Badge>
          </div>
        </div>

        {/* Main Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Current Company */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <span>Your Current Company</span>
                  </CardTitle>
                  {currentCompany.company && (
                    <Badge variant="outline">{currentCompany.company}</Badge>
                  )}
                </div>
                <CardDescription>Based on your submitted deal details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">System Size</p>
                      <p className="font-semibold">{currentCompany.systemSize} kW</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Deal Type</p>
                      <p className="font-semibold capitalize">{currentCompany.dealType}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Price Per Watt</p>
                      <p className="font-semibold">
                        ${currentCompany.pricingStructure === 'ppw' 
                          ? currentCompany.priceAmount 
                          : (parseFloat(currentCompany.priceAmount) / (parseFloat(currentCompany.systemSize) * 1000)).toFixed(3)
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">State</p>
                      <p className="font-semibold">{currentCompany.state}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="text-center">
                      <p className="text-muted-foreground text-sm mb-1">Your Commission</p>
                      <p className="text-3xl font-bold text-muted-foreground">
                        {formatCurrency(currentCommission)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Our Company */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full border-primary/20 bg-primary/5">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <span>Partner Company Network</span>
                  </CardTitle>
                  <Badge className="bg-primary text-primary-foreground">Network Opportunity</Badge>
                </div>
                <CardDescription>Same deal with partner commission structure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Baseline PPW</p>
                      <p className="font-semibold">
                        {calculationResults.baseline > 0 
                          ? `$${calculationResults.baseline.toFixed(3)}`
                          : 'Not Available'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Company Profits</p>
                      <p className="font-semibold">{formatCurrency(calculationResults.companyProfits)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Commission Rate</p>
                      <p className="font-semibold">
                        {(calculationResults.commissionMultiplier * 100).toFixed(0)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Adders</p>
                      <p className="font-semibold">{formatCurrency(calculationResults.totalAdders)}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="text-center">
                      <p className="text-muted-foreground text-sm mb-1">Your Commission</p>
                      <p className="text-3xl font-bold text-primary">
                        {formatCurrency(projectedCommission)}
                      </p>
                      {difference > 0 && (
                        <div className="flex items-center justify-center space-x-1 mt-2">
                          <TrendingUp className="h-4 w-4 text-success" />
                          <span className="text-sm text-success font-medium">
                            +{formatCurrency(difference)} (+{percentageIncrease.toFixed(1)}%)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recruiting Income Example Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <Card className="border-success/20 bg-success/5">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-success" />
                <span>Recruiting Income Example</span>
              </CardTitle>
              <CardDescription>
                Real potential when you build a team of 3 representatives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-success/20 rounded-full flex items-center justify-center">
                    <Calculator className="h-6 w-6 text-success" />
                  </div>
                  <h4 className="font-semibold mb-2">The Scenario</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• You recruit 3 representatives</p>
                    <p>• Each averages 3 installs/month</p>
                    <p>• You earn 2.5% builder pay on their deals</p>
                    <p>• Based on avg company profits of {formatCurrency(calculationResults.companyProfits)}</p>
                  </div>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-success/20 rounded-full flex items-center justify-center">
                    <Target className="h-6 w-6 text-success" />
                  </div>
                  <h4 className="font-semibold mb-2">Monthly Income</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Personal Commission</p>
                      <p className="font-bold">{formatCurrency(projectedCommission)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Recruiting Income</p>
                      <p className="font-bold text-success">{formatCurrency(builderPayExample.monthlyBuilderPay)}</p>
                    </div>
                    <div className="pt-2 border-t border-success/20">
                      <p className="text-sm text-muted-foreground">Combined Total</p>
                      <p className="text-xl font-bold text-success">{formatCurrency(builderPayExample.combinedMonthlyIncome)}</p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-success/20 rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6 text-success" />
                  </div>
                  <h4 className="font-semibold mb-2">Annual Projection</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Personal Commission</p>
                      <p className="font-bold">{formatCurrency(projectedCommission * 12)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Recruiting Income</p>
                      <p className="font-bold text-success">{formatCurrency(builderPayExample.annualBuilderPay)}</p>
                    </div>
                    <div className="pt-2 border-t border-success/20">
                      <p className="text-sm text-muted-foreground">Combined Total</p>
                      <p className="text-xl font-bold text-success">{formatCurrency(totalCombinedAnnual)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-success/10 rounded-lg">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-success">Key Advantage: Passive Income Growth</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      While you continue selling and earning personal commissions, your recruited team generates 
                      additional passive income through Recruiting Income. This example shows just 3 recruits - 
                      imagine the potential with 10, 25, or 50 team members!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Annual Comparison Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <span>Annual Earning Comparison</span>
              </CardTitle>
              <CardDescription>
                Based on 3 installs per month (36 deals annually)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Current Annual (36 deals)</p>
                  <p className="text-2xl font-bold">{formatCurrency(currentCommission * 36)}</p>
                </div>
                
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Personal Only (Partner rates)</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(projectedCommission * 36)}</p>
                  {annualPersonalIncrease > 0 && (
                    <p className="text-sm text-success mt-1">+{formatCurrency((projectedCommission - currentCommission) * 36)}</p>
                  )}
                </div>
                
                <div className="text-center p-4 bg-success/10 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">With Recruiting Income (3 reps)</p>
                  <p className="text-2xl font-bold text-success">{formatCurrency((projectedCommission * 36) + builderPayExample.annualBuilderPay)}</p>
                  <p className="text-sm text-success mt-1">
                    +{formatCurrency((projectedCommission * 36) + builderPayExample.annualBuilderPay - (currentCommission * 36))}
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
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mb-8"
        >
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-blue-700 dark:text-blue-300">Partner Network Opportunity</p>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  These projections show potential earnings with companies in our network. Beacon Solar Solutions 
                  connects professionals with opportunities but does not directly employ sales representatives.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {calculationResults.baseline === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-8"
          >
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-amber-600">Territory Expansion Notice</p>
                    <p className="text-sm text-amber-600 mt-1">
                      {currentCompany.state} is not currently in our active service territory. However, partner companies 
                      are rapidly expanding and may have opportunities available. The calculations above demonstrate 
                      commission structures for comparison purposes.
                    </p>
                  </div>
                </div>
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
            <span>Back to Calculator</span>
          </Button>

          <Button
            onClick={handleContinue}
            size="lg"
            className="btn-gradient text-white min-w-[200px]"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>{calculatorType === 'team-leader' ? 'Continue to Override Calculator' : 'Continue to Analysis'}</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
