

'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Calculator, 
  Home,
  CheckCircle2
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { motion } from 'framer-motion';

interface TeamLeaderLayoutProps {
  children: React.ReactNode;
  title: string;
  totalSteps: number;
}

const TEAM_LEADER_STEP_NAMES = [
  'Leadership Profile',
  'Current Role Analysis', 
  'Opportunity Comparison',
  'Override Income',
  'Recruiting Income',
  '2029 Equity Buyout',
  'Complete Summary'
];

export default function TeamLeaderLayout({ 
  children, 
  title, 
  totalSteps 
}: TeamLeaderLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Extract current step from pathname
  const getCurrentStep = (): number => {
    const match = pathname.match(/step-(\d+)/);
    return match ? parseInt(match[1]) : 1;
  };

  const currentStep = getCurrentStep();
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  const handleBack = () => {
    if (currentStep > 1) {
      router.push(`/calculator/team-leader/step-${currentStep - 1}`);
    } else {
      router.push('/');
    }
  };

  const handleHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleHome}
                className="flex items-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center space-x-2">
                <Calculator className="h-5 w-5 text-primary" />
                <span className="font-semibold text-sm sm:text-base">{title}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="hidden sm:flex">
                Step {currentStep} of {totalSteps}
              </Badge>
              <ThemeToggle />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                {TEAM_LEADER_STEP_NAMES[currentStep - 1]}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 mt-3 text-sm text-muted-foreground">
            <span>Home</span>
            <span>/</span>
            <span>Team Leadership</span>
            <span>/</span>
            <span className="text-foreground font-medium">{TEAM_LEADER_STEP_NAMES[currentStep - 1]}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-custom py-8">
        <div className="max-w-5xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{currentStep > 1 ? 'Previous Step' : 'Back to Home'}</span>
            </Button>
          </div>

          {/* Step Navigation Dots */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalSteps }, (_, index) => {
                const stepNumber = index + 1;
                const isCompleted = stepNumber < currentStep;
                const isCurrent = stepNumber === currentStep;
                
                return (
                  <motion.div
                    key={stepNumber}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                      isCompleted
                        ? 'bg-success text-success-foreground'
                        : isCurrent
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      stepNumber
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Page Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Card className="backdrop-blur-sm bg-card/50">
              <CardContent className="p-0">
                {children}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

