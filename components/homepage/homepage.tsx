
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  TrendingUp, 
  Users, 
  Award,
  ArrowRight,
  Sun,
  Zap,
  Target,
  CheckCircle
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import QuickCalculator from './quick-calculator';
import { FEATURES, isFeatureEnabled } from '@/lib/feature-flags';
import Link from 'next/link';

type UserRole = 'sales' | 'field' | null;
type SalesOption = 'commission' | 'builder' | null;
type FieldOption = 'roi' | 'commission' | null;

export default function HomePage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [selectedSalesOption, setSelectedSalesOption] = useState<SalesOption>(null);
  const [selectedFieldOption, setSelectedFieldOption] = useState<FieldOption>(null);
  const router = useRouter();

  const handleRoleSelection = (role: UserRole) => {
    // ===== LAUNCH RESTRICTION: Prevent field marketing selection when disabled =====
    if (role === 'field' && !isFeatureEnabled('FIELD_MARKETING')) {
      console.log('Field marketing features disabled for launch');
      return;
    }
    
    setSelectedRole(role);
    setSelectedSalesOption(null);
    setSelectedFieldOption(null);
  };

  const handleCalculatorStart = (flow: string) => {
    // Navigate to the appropriate calculator flow
    switch (flow) {
      case 'commission':
        router.push('/calculator/sales-rep');
        break;
      case 'builder':
        router.push('/calculator/team-leader');
        break;
      case 'field-roi':
        router.push('/calculator/field-marketing');
        break;
      case 'field-commission':
        router.push('/calculator/field-marketing');
        break;
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <span className="text-2xl font-bold text-gradient">CommissionEdge</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container-custom py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <Badge variant="secondary" className="mb-6 text-sm font-medium">
            <Zap className="h-4 w-4 mr-1" />
            Professional Solar Commission Platform
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Know Your Value.{' '}
            <span className="text-gradient">Shine Brighter.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Compare solar commission opportunities instantly and discover your true earning potential
          </p>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-8 mb-12 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span>Accurate Calculations</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span>Instant Results</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Quick Calculator */}
      <QuickCalculator />

      {/* Role Selection */}
      <section className="container-custom py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Target className="h-4 w-4 mr-1" />
              Comprehensive Analysis
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Need a Deeper Analysis?</h2>
            <p className="text-muted-foreground text-lg">
              Access our full calculator suites for comprehensive commission analysis, recruiting income projections, and career planning
            </p>
          </div>

          <div className={`grid gap-6 mb-12 ${isFeatureEnabled('FIELD_MARKETING') ? 'md:grid-cols-2' : 'max-w-md mx-auto'}`}>
            {/* Solar Sales Card */}
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 h-full ${
                  selectedRole === 'sales' 
                    ? 'ring-2 ring-primary shadow-lg shadow-primary/20' 
                    : 'hover:shadow-lg hover:shadow-primary/5'
                }`}
                onClick={() => handleRoleSelection('sales')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Solar Sales Professional</CardTitle>
                  <CardDescription className="text-base">
                    Commission calculators and recruiting income opportunities for sales representatives
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calculator className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">Commission comparison calculator</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">Team building & recruiting analysis</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Award className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">Future income planning & projections</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* ===== FIELD MARKETING - DISABLED FOR LAUNCH ===== */}
            {isFeatureEnabled('FIELD_MARKETING') && (
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 h-full ${
                    selectedRole === 'field' 
                      ? 'ring-2 ring-success shadow-lg shadow-success/20' 
                      : 'hover:shadow-lg hover:shadow-success/5'
                  }`}
                  onClick={() => handleRoleSelection('field')}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center">
                      <Target className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl">Field Marketing & Canvassing</CardTitle>
                    <CardDescription className="text-base">
                      ROI calculators and commission analysis for field marketing professionals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Calculator className="h-5 w-5 text-success flex-shrink-0" />
                        <span className="text-sm">Field marketing ROI calculator</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="h-5 w-5 text-success flex-shrink-0" />
                        <span className="text-sm">Commission comparison (50% rates)</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-success flex-shrink-0" />
                        <span className="text-sm">Recruiting income opportunities</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            {/* ===== END FIELD MARKETING SECTION =====  */}
            
            {/* Coming Soon Notice - Only show when field marketing is disabled */}
            {!isFeatureEnabled('FIELD_MARKETING') && (
              <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Target className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <h4 className="font-semibold text-amber-800 dark:text-amber-200">Field Marketing Tools Coming Soon</h4>
                </div>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  ROI calculators and commission analysis for field marketing professionals launching Q1 2025
                </p>
              </div>
            )}
          </div>

          {/* Sub-Options */}
          {selectedRole && (selectedRole === 'sales' || (selectedRole === 'field' && isFeatureEnabled('FIELD_MARKETING'))) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Select Your Calculator</h3>
                <p className="text-muted-foreground">
                  {selectedRole === 'sales' 
                    ? 'Choose the type of analysis you want to perform'
                    : 'Select your field marketing calculation needs'
                  }
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {selectedRole === 'sales' ? (
                  <>
                    <motion.div
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className="cursor-pointer transition-all duration-300 hover:shadow-lg card-hover"
                        onClick={() => handleCalculatorStart('commission')}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-xl">Sales Rep Commission Comparison</CardTitle>
                              <CardDescription>
                                Compare your current vs potential earnings as a sales representative
                              </CardDescription>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div>• Personal commission calculator</div>
                            <div>• Recruiting income preview</div>
                            <div>• Detailed earnings analysis</div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className="cursor-pointer transition-all duration-300 hover:shadow-lg card-hover"
                        onClick={() => handleCalculatorStart('builder')}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-xl">Team Leadership Opportunity Calculator</CardTitle>
                              <CardDescription>
                                Complete district manager and leadership compensation analysis
                              </CardDescription>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div>• Override income projections</div>
                            <div>• Multi-generation recruiting income</div>
                            <div>• Long-term wealth building strategies</div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className="cursor-pointer transition-all duration-300 hover:shadow-lg card-hover"
                        onClick={() => handleCalculatorStart('field-roi')}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-xl">Field Marketing ROI</CardTitle>
                              <CardDescription>
                                Calculate your marketing return on investment
                              </CardDescription>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div>• ROI analysis & projections</div>
                            <div>• Cost per lead calculations</div>
                            <div>• Territory optimization</div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className="cursor-pointer transition-all duration-300 hover:shadow-lg card-hover"
                        onClick={() => handleCalculatorStart('field-commission')}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-xl">Field Marketing Commission</CardTitle>
                              <CardDescription>
                                Commission comparison at 50% rates
                              </CardDescription>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div>• Commission calculator (50% rates)</div>
                            <div>• Recruiting income opportunities</div>
                            <div>• Career advancement paths</div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container-custom py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Why Choose CommissionEdge?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Professional tools designed by solar industry experts to help you make informed career decisions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Calculator,
              title: 'Accurate Calculations',
              description: 'Industry-verified formulas with real baseline pricing data from all 50 states + DC + PR'
            },
            {
              icon: TrendingUp,
              title: 'Future-Focused',
              description: 'Recruiting income projections, long-term financial planning, and wealth building scenarios included'
            },
            {
              icon: Sun,
              title: 'Solar Specialized',
              description: 'Built specifically for solar professionals by industry veterans who understand the market'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
            >
              <Card className="text-center h-full card-hover">
                <CardHeader>
                  <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      {!selectedRole && (
        <section className="container-custom py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to Discover Your True Value?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Select your role above to get started with our professional commission calculator suite
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="btn-gradient text-white"
                onClick={() => handleRoleSelection('sales')}
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                Solar Sales Calculator
              </Button>
              {/* ===== FIELD MARKETING - DISABLED FOR LAUNCH ===== */}
              {isFeatureEnabled('FIELD_MARKETING') && (
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => handleRoleSelection('field')}
                >
                  <Target className="h-5 w-5 mr-2" />
                  Field Marketing Calculator
                </Button>
              )}
              {/* ===== END FIELD MARKETING SECTION ===== */}
            </div>
          </motion.div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="container-custom py-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Calculator className="h-5 w-5 text-primary" />
              <span className="font-bold text-gradient">CommissionEdge</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Platform by Beacon Solar Solutions
            </p>
            <p className="text-xs text-muted-foreground italic">
              "Connecting Solar Professionals with Opportunities"
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="p-4 bg-muted/30 rounded-lg border border-border/30 mb-4">
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                <strong>Important Disclaimer:</strong> CommissionEdge is a platform owned by Beacon Solar Solutions. 
                Beacon Solar Solutions is not the hiring company. Calculator results represent potential opportunities 
                with various solar companies and installers. Actual employment opportunities are with third-party solar companies.
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                © 2025 Beacon Solar Solutions. Professional solar commission calculations.
              </p>
              <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                <span>•</span>
                <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                <span>•</span>
                <Link href="/about" className="hover:text-primary transition-colors">About</Link>
                <span>•</span>
                <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
