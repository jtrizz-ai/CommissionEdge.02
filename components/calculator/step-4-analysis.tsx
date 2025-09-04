
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Target,
  TrendingUp,
  Users,
  Heart,
  Clock,
  Award,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Star,
  Lightbulb,
  Zap,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { formatCurrency, calculateBuilderPay } from '@/lib/calculations';

interface CalculatorData {
  leadCapture?: any;
  currentCompany?: any;
  calculationResults?: any;
}

interface PersonalizedBenefit {
  icon: any;
  title: string;
  description: string;
  highlight: string;
}

export default function DetailedAnalysis() {
  const [data, setData] = useState<CalculatorData>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('calculatorData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setData(parsedData);
      } catch (error) {
        console.error('Error loading saved data:', error);
        router.push('/calculator/sales-rep/step-1');
      }
    } else {
      router.push('/calculator/sales-rep/step-1');
    }
  }, [router]);

  const handleContinue = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push('/calculator/sales-rep/step-5');
    }, 1000);
  };

  const handleBack = () => {
    router.push('/calculator/sales-rep/step-3');
  };

  if (!data.leadCapture || !data.currentCompany || !data.calculationResults) {
    return (
      <div className="p-6 md:p-8 text-center">
        <div className="max-w-md mx-auto">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Missing Data</h2>
          <p className="text-muted-foreground mb-4">
            Please complete the previous steps to see your personalized analysis.
          </p>
          <Button onClick={() => router.push('/calculator/sales-rep/step-1')}>
            Start Over
          </Button>
        </div>
      </div>
    );
  }

  const { leadCapture, currentCompany, calculationResults } = data;

  // Generate personalized benefits based on motivator
  const getPersonalizedBenefits = (): PersonalizedBenefit[] => {
    const benefits: Record<string, PersonalizedBenefit> = {
      'Higher commission': {
        icon: TrendingUp,
        title: 'Superior Commission Structure',
        description: 'Our transparent, performance-based commission system ensures you earn what you deserve. With baseline pricing and profit-sharing, your income grows with your success.',
        highlight: `Up to ${(calculationResults.commissionMultiplier * 100).toFixed(0)}% commission rate on company profits`
      },
      'Better leads': {
        icon: Target,
        title: 'Premium Lead Generation System',
        description: 'Access our proprietary lead generation technology, qualified appointment setting, and territory management system that converts at industry-leading rates.',
        highlight: `${leadCapture.companyLeads} out of 10 company leads + support for your self-gen efforts`
      },
      'More support': {
        icon: Users,
        title: 'Comprehensive Support Network',
        description: 'From initial training to ongoing mentorship, technical support, and sales coaching - we invest in your success with resources most companies can\'t match.',
        highlight: 'Dedicated success manager + peer mentor network'
      },
      'Flexible schedule': {
        icon: Clock,
        title: 'Work-Life Integration',
        description: 'Set your own schedule while meeting performance goals. Our remote-first culture and flexible approach lets you work when and where you\'re most productive.',
        highlight: 'Flexible hours with performance-based metrics'
      },
      'Career growth': {
        icon: Award,
        title: 'Accelerated Career Development',
        description: 'Clear advancement paths from individual contributor to team leader, district manager, and regional director. Recruiting income creates passive income as you grow.',
        highlight: 'Leadership track with long-term wealth building opportunities'
      }
    };

    const primaryBenefit = benefits[leadCapture.motivator];
    
    // Add secondary benefits
    const allBenefits = [primaryBenefit];
    
    // Always include recruiting income as secondary benefit
    if (leadCapture.motivator !== 'Career growth') {
      allBenefits.push({
        icon: Users,
        title: 'Legacy Recruiting Income Opportunity',
        description: 'Partner companies in our network offer profit-sharing when you help them grow through recruiting, creating genuine passive income opportunities.',
        highlight: '2.5% recruiting income on 1st generation recruits through partner companies'
      });
    }

    // Add experience-appropriate benefit based on install count
    const installCount = ['21-50', '51-100', '100+'].includes(leadCapture.careerInstalls);
    if (installCount) {
      allBenefits.push({
        icon: Star,
        title: 'Industry Veterans Recognition Program',
        description: 'Your proven track record is valued and rewarded through partner companies. Immediate access to highest commission tiers and fast-track leadership opportunities.',
        highlight: `${leadCapture.careerInstalls} career installs = qualified for network partner's highest tier earnings`
      });
    } else {
      allBenefits.push({
        icon: Lightbulb,
        title: 'Performance-Based Commission Structure',
        description: 'Partner companies offer above industry average commission policy from day one, with clear advancement opportunities as you build your track record.',
        highlight: 'Above industry average from day one, 10% increase when you reach 20+ installs'
      });
    }

    return allBenefits;
  };

  const personalizedBenefits = getPersonalizedBenefits();
  const projectedCommission = calculationResults.repCommission;
  const currentCommission = parseFloat(currentCompany.commissionEarned) || 0;
  const monthlyIncrease = projectedCommission - currentCommission;
  const annualIncrease = monthlyIncrease * 12;

  // Calculate various scenarios based on 3 installs/month (36 deals annually)
  const scenarios = [
    {
      title: 'Personal Sales Only',
      subtitle: '3 installs per month (36 annually)',
      annual: projectedCommission * 36,
      monthly: projectedCommission * 3,
      description: 'Focus purely on personal production through partner companies'
    },
    {
      title: 'Light Network Building',
      subtitle: '1 recruit through partner, 2 deals/month',
      annual: (projectedCommission * 36) + (calculationResults.companyProfits * 0.025 * 1 * 2 * 12),
      monthly: (projectedCommission * 3) + (calculationResults.companyProfits * 0.025 * 1 * 2),
      description: 'Balanced approach with minimal recruiting through partner network'
    },
    {
      title: 'Active Network Builder',
      subtitle: '3 recruits through partners, 3 deals/month each',
      annual: (projectedCommission * 36) + (calculationResults.companyProfits * 0.025 * 3 * 3 * 12),
      monthly: (projectedCommission * 3) + (calculationResults.companyProfits * 0.025 * 3 * 3),
      description: 'Active recruiting through partner network with substantial passive income'
    }
  ];

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
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-success rounded-full flex items-center justify-center"
          >
            <Target className="h-8 w-8 text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-bold mb-2">
            Personalized Benefits Analysis
          </h1>
          <p className="text-muted-foreground text-lg">
            Tailored insights based on your experience, goals, and motivations
          </p>
          
          <div className="mt-4">
            <Badge variant="secondary" className="text-sm">
              Customized for {leadCapture.name} • {leadCapture.experience} years • {leadCapture.motivator}
            </Badge>
          </div>
        </div>

        {/* Key Benefits Cards */}
        <div className="space-y-6 mb-8">
          {personalizedBenefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className={index === 0 ? 'border-primary/20 bg-primary/5' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${index === 0 ? 'bg-primary/20' : 'bg-muted'}`}>
                      <benefit.icon className={`h-5 w-5 ${index === 0 ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <span>{benefit.title}</span>
                      {index === 0 && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Primary Match
                        </Badge>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">{benefit.description}</p>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                    <span className="font-medium text-success">{benefit.highlight}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Annual Earning Projections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Annual Earning Scenarios</span>
              </CardTitle>
              <CardDescription>
                Different paths to grow your income based on your preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {scenarios.map((scenario, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    className={`p-4 rounded-lg border ${
                      index === 1 
                        ? 'border-primary/20 bg-primary/5' 
                        : index === 2 
                        ? 'border-success/20 bg-success/5'
                        : 'border-border bg-card'
                    }`}
                  >
                    <div className="text-center">
                      <h4 className="font-semibold mb-1">{scenario.title}</h4>
                      <p className="text-xs text-muted-foreground mb-3">{scenario.subtitle}</p>
                      
                      <div className="space-y-2 mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Monthly</p>
                          <p className="font-bold">{formatCurrency(scenario.monthly)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Annual</p>
                          <p className={`text-lg font-bold ${
                            index === 1 ? 'text-primary' : index === 2 ? 'text-success' : ''
                          }`}>
                            {formatCurrency(scenario.annual)}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-xs text-muted-foreground">{scenario.description}</p>
                      
                      {index === 1 && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          Balanced Approach
                        </Badge>
                      )}
                      {index === 2 && (
                        <Badge className="mt-2 text-xs bg-success text-success-foreground">
                          Maximum Growth
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>



        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-8"
        >
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-success/5">
            <CardHeader>
              <CardTitle className="text-center">Your Opportunity Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                {annualIncrease > 0 ? (
                  <div>
                    <p className="text-muted-foreground">Annual commission increase potential</p>
                    <p className="text-3xl font-bold text-success">+{formatCurrency(annualIncrease)}</p>
                    <p className="text-sm text-muted-foreground">Based on 12 similar deals per year</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-muted-foreground">Annual earning potential</p>
                    <p className="text-3xl font-bold text-primary">{formatCurrency(projectedCommission * 12)}</p>
                    <p className="text-sm text-muted-foreground">Plus builder pay opportunities</p>
                  </div>
                )}
                
                <div className="pt-4 border-t space-y-2">
                  <p className="font-semibold">Why this works for you:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge variant="secondary">{leadCapture.experience} years experience</Badge>
                    <Badge variant="secondary">Motivated by {leadCapture.motivator.toLowerCase()}</Badge>
                    <Badge variant="secondary">{leadCapture.selfGenLeads}/{leadCapture.companyLeads} lead mix</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex justify-between pt-6"
        >
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Comparison</span>
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
                <span>Learn About Recruiting Income</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
