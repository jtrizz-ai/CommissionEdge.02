
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Users,
  TrendingUp,
  Award,
  Calculator,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  Building2,
  Target,
  Crown,
  Zap,
  Info,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { formatCurrency, calculateBuilderPay } from '@/lib/calculations';

interface BuilderPayScenario {
  title: string;
  description: string;
  generation1: number;
  generation2: number;
  generation3: number;
  avgInstalls: number;
}

interface CalculatorData {
  leadCapture?: any;
  currentCompany?: any;
  calculationResults?: any;
}

export default function RecruitingIncomeExplanation() {
  const [data, setData] = useState<CalculatorData>({});
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [customReps, setCustomReps] = useState([10, 5, 2]);
  const [customInstalls, setCustomInstalls] = useState(3);
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
      router.push('/calculator/sales-rep/step-6');
    }, 1000);
  };

  const handleBack = () => {
    router.push('/calculator/sales-rep/step-4');
  };

  if (!data.leadCapture || !data.currentCompany || !data.calculationResults) {
    return (
      <div className="p-6 md:p-8 text-center">
        <div className="max-w-md mx-auto">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Missing Data</h2>
          <p className="text-muted-foreground mb-4">
            Please complete the previous steps to see the builder pay breakdown.
          </p>
          <Button onClick={() => router.push('/calculator/sales-rep/step-1')}>
            Start Over
          </Button>
        </div>
      </div>
    );
  }

  const { leadCapture, currentCompany, calculationResults } = data;

  // Predefined scenarios
  const scenarios: BuilderPayScenario[] = [
    {
      title: 'Getting Started',
      description: 'First few recruits, building your foundation',
      generation1: 3,
      generation2: 0,
      generation3: 0,
      avgInstalls: 3
    },
    {
      title: 'Growing Team',
      description: 'Established team with second generation starting',
      generation1: 10,
      generation2: 5,
      generation3: 0,
      avgInstalls: 3
    },
    {
      title: 'Established Network',
      description: 'Multi-generational team with passive income',
      generation1: 25,
      generation2: 15,
      generation3: 8,
      avgInstalls: 3
    }
  ];

  // Calculate builder pay for different scenarios
  const getScenarioResults = (scenario: BuilderPayScenario) => {
    return calculateBuilderPay({
      generation1Reps: scenario.generation1,
      generation2Reps: scenario.generation2,
      generation3Reps: scenario.generation3,
      avgInstallsPerMonth: scenario.avgInstalls,
      avgSystemSize: parseFloat(currentCompany.systemSize) || 10,
      avgCompanyProfits: calculationResults.companyProfits || 1000
    }, calculationResults.repCommission);
  };

  // Calculate custom scenario
  const customResults = calculateBuilderPay({
    generation1Reps: customReps[0],
    generation2Reps: customReps[1],
    generation3Reps: customReps[2],
    avgInstallsPerMonth: customInstalls,
    avgSystemSize: parseFloat(currentCompany.systemSize) || 10,
    avgCompanyProfits: calculationResults.companyProfits || 1000
  }, calculationResults.repCommission);

  const selectedResults = getScenarioResults(scenarios[selectedScenario]);

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
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-success to-primary rounded-full flex items-center justify-center"
          >
            <Users className="h-8 w-8 text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-bold mb-2">Legacy Recruiting Income Full Explanation</h1>
          <p className="text-muted-foreground text-lg">
            Complete breakdown of multi-generation network building and 2029 equity opportunities through partner companies
          </p>
        </div>

        {/* Legacy Recruiting Income Structure Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5 text-primary" />
                <span>How Legacy Recruiting Income Works</span>
              </CardTitle>
              <CardDescription>
                Transparent profit-sharing structure through partner companies that rewards network building
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-success/10 to-success/5 rounded-lg">
                  <div className="w-12 h-12 mx-auto mb-3 bg-success/20 rounded-full flex items-center justify-center">
                    <Crown className="h-6 w-6 text-success" />
                  </div>
                  <h4 className="font-semibold text-success mb-2">1st Generation</h4>
                  <p className="text-2xl font-bold text-success mb-2">2.5%</p>
                  <p className="text-sm text-muted-foreground">
                    Direct recruits you personally bring to the team
                  </p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                  <div className="w-12 h-12 mx-auto mb-3 bg-primary/20 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-primary mb-2">2nd Generation</h4>
                  <p className="text-2xl font-bold text-primary mb-2">1.5%</p>
                  <p className="text-sm text-muted-foreground">
                    People recruited by your direct recruits
                  </p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-lg">
                  <div className="w-12 h-12 mx-auto mb-3 bg-amber-500/20 rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6 text-amber-600" />
                  </div>
                  <h4 className="font-semibold text-amber-600 mb-2">3rd Generation</h4>
                  <p className="text-2xl font-bold text-amber-600 mb-2">1.0%</p>
                  <p className="text-sm text-muted-foreground">
                    Third level down in your organization
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-primary">Key Point: Partner Company Profit Sharing</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Recruiting income percentages apply to partner company profits (after their 80% share), not gross revenue. 
                      This ensures sustainable growth and aligns everyone's interests with long-term success across the network.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Scenario Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-primary" />
                <span>Legacy Recruiting Income Scenarios</span>
              </CardTitle>
              <CardDescription>
                Explore different network sizes and their income potential through partner companies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {scenarios.map((scenario, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-300 ${
                        selectedScenario === index
                          ? 'ring-2 ring-primary shadow-lg shadow-primary/20'
                          : 'hover:shadow-lg'
                      }`}
                      onClick={() => setSelectedScenario(index)}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">{scenario.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {scenario.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>1st Gen:</span>
                            <span className="font-semibold">{scenario.generation1} reps</span>
                          </div>
                          <div className="flex justify-between">
                            <span>2nd Gen:</span>
                            <span className="font-semibold">{scenario.generation2} reps</span>
                          </div>
                          <div className="flex justify-between">
                            <span>3rd Gen:</span>
                            <span className="font-semibold">{scenario.generation3} reps</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Selected Scenario Results */}
              <motion.div
                key={selectedScenario}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="p-6 bg-gradient-to-br from-primary/5 to-success/5 rounded-lg"
              >
                <h4 className="font-semibold mb-4 text-center">
                  {scenarios[selectedScenario].title} - Income Breakdown
                </h4>
                
                <div className="grid md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Personal Commission</p>
                    <p className="text-xl font-bold">{formatCurrency(calculationResults.repCommission)}</p>
                    <p className="text-xs text-muted-foreground">Monthly</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Recruiting Income</p>
                    <p className="text-xl font-bold text-success">
                      {formatCurrency(selectedResults.monthlyBuilderPay)}
                    </p>
                    <p className="text-xs text-muted-foreground">Monthly</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Combined Monthly</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(selectedResults.combinedMonthlyIncome)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Combined Annual</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(selectedResults.combinedAnnualIncome)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-primary/20">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">2029 Equity Buyout Value</p>
                    <p className="text-3xl font-bold text-success">
                      {formatCurrency(selectedResults.equityValue2029)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      12-month pre-buyout calculation
                    </p>
                  </div>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Custom Recruiting Income Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-primary" />
                <span>Custom Legacy Recruiting Income Calculator</span>
              </CardTitle>
              <CardDescription>
                Adjust the parameters to see your personalized projections through partner companies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">1st Generation Reps</label>
                      <span className="text-sm font-semibold">{customReps[0]}</span>
                    </div>
                    <Slider
                      value={[customReps[0]]}
                      onValueChange={(value) => setCustomReps([value[0] ?? 0, customReps[1], customReps[2]])}
                      max={50}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">2nd Generation Reps</label>
                      <span className="text-sm font-semibold">{customReps[1]}</span>
                    </div>
                    <Slider
                      value={[customReps[1]]}
                      onValueChange={(value) => setCustomReps([customReps[0], value[0] ?? 0, customReps[2]])}
                      max={25}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">3rd Generation Reps</label>
                      <span className="text-sm font-semibold">{customReps[2]}</span>
                    </div>
                    <Slider
                      value={[customReps[2]]}
                      onValueChange={(value) => setCustomReps([customReps[0], customReps[1], value[0] ?? 0])}
                      max={15}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="max-w-md mx-auto">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Avg Installs/Month per Rep</label>
                      <span className="text-sm font-semibold">{customInstalls}</span>
                    </div>
                    <Slider
                      value={[customInstalls]}
                      onValueChange={(value) => setCustomInstalls(value[0] ?? 3)}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Custom Results */}
                <div className="p-6 bg-gradient-to-br from-success/10 to-primary/10 rounded-lg">
                  <h4 className="font-semibold mb-4 text-center">Your Custom Scenario</h4>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Monthly Recruiting Income:</span>
                        <span className="font-bold text-success">
                          {formatCurrency(customResults.monthlyBuilderPay)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Combined Monthly:</span>
                        <span className="font-bold text-primary">
                          {formatCurrency(customResults.combinedMonthlyIncome)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Combined Annual:</span>
                        <span className="font-bold text-primary">
                          {formatCurrency(customResults.combinedAnnualIncome)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">2029 Equity Value</p>
                      <p className="text-2xl font-bold text-success">
                        {formatCurrency(customResults.equityValue2029)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 2029 Equity Buyout Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <Card className="border-success/20 bg-success/5">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-success" />
                <span>2029 Equity Buyout Opportunity</span>
              </CardTitle>
              <CardDescription>
                Wealth building through equity participation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-success/10 rounded-lg">
                  <h4 className="font-semibold text-success mb-2">How the Equity Program Works</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Recruiting Income percentages are converted to equity stakes in partner companies</p>
                    <p>• In 2029, partner companies plan a structured buyout of equity positions</p>
                    <p>• Calculation based on 12-month trailing Recruiting Income earnings</p>
                    <p>• Provides substantial wealth-building opportunity beyond monthly income</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border border-success/20 rounded-lg">
                    <h5 className="font-semibold mb-2">5-Year Timeline</h5>
                    <p className="text-sm text-muted-foreground">
                      Build your team and earn monthly builder pay through 2029
                    </p>
                  </div>
                  <div className="text-center p-4 border border-success/20 rounded-lg">
                    <h5 className="font-semibold mb-2">Equity Conversion</h5>
                    <p className="text-sm text-muted-foreground">
                      Monthly builder pay translates to ownership percentage
                    </p>
                  </div>
                  <div className="text-center p-4 border border-success/20 rounded-lg">
                    <h5 className="font-semibold mb-2">Buyout Value</h5>
                    <p className="text-sm text-muted-foreground">
                      12x your final year's builder pay income
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-primary/10 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-primary">Example Wealth Building Path</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        A rep who builds a team generating {formatCurrency(customResults.monthlyBuilderPay)}/month 
                        in builder pay would have an estimated 2029 buyout value of{' '}
                        <span className="font-bold text-success">{formatCurrency(customResults.equityValue2029)}</span>. 
                        This creates generational wealth while you continue earning monthly income.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 5-Year Wealth Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>5-Year Wealth Building Timeline</span>
              </CardTitle>
              <CardDescription>
                Your journey from individual contributor to equity holder
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-5 gap-4">
                {[
                  { year: 2025, phase: 'Foundation', focus: 'Personal sales + first recruits', income: 'Commission + initial builder pay' },
                  { year: 2026, phase: 'Growth', focus: 'Team expansion', income: 'Growing passive income' },
                  { year: 2027, phase: 'Scale', focus: 'Multi-generation team', income: 'Substantial builder pay' },
                  { year: 2028, phase: 'Optimize', focus: 'Team leadership', income: 'Peak earning period' },
                  { year: 2029, phase: 'Harvest', focus: 'Equity buyout', income: 'Wealth realization event' }
                ].map((stage, index) => (
                  <div key={stage.year} className="text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                      index === 4 
                        ? 'bg-success text-success-foreground' 
                        : 'bg-primary/20 text-primary'
                    }`}>
                      <span className="font-bold text-sm">{stage.year}</span>
                    </div>
                    <h5 className="font-semibold mb-1">{stage.phase}</h5>
                    <p className="text-xs text-muted-foreground mb-2">{stage.focus}</p>
                    <Badge variant={index === 4 ? 'default' : 'secondary'} className="text-xs">
                      {stage.income}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

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
            <span>Back to Analysis</span>
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
                <span>See Final Results</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
