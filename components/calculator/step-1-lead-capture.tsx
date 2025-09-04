
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import StateValidationModal from '@/components/ui/state-validation-modal';
import { 
  User, 
  Phone, 
  Mail, 
  Building, 
  Award, 
  Target,
  TrendingUp,
  Users,
  MapPin,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { 
  EXPERIENCE_OPTIONS, 
  CAREER_INSTALLS_OPTIONS, 
  MOTIVATOR_OPTIONS, 
  US_STATES 
} from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';

interface LeadCaptureData {
  name: string;
  email: string;
  phone: string;
  company: string;
  experience: string;
  careerInstalls: string;
  motivator: string;
  selfGenLeads: number;
  companyLeads: number;
  state: string;
}

interface LeadCaptureFormProps {
  calculatorType?: 'sales-rep' | 'team-leader';
}

export default function LeadCaptureForm({ calculatorType = 'sales-rep' }: LeadCaptureFormProps = {}) {
  const [formData, setFormData] = useState<LeadCaptureData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    experience: '',
    careerInstalls: '',
    motivator: '',
    selfGenLeads: 2,
    companyLeads: 8,
    state: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  const [isCheckingState, setIsCheckingState] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Load data from localStorage on component mount
  useEffect(() => {
    // Check if this is a pre-fill from quick calculator
    const shouldPrefill = searchParams.get('prefill') === 'true';
    
    if (shouldPrefill) {
      const quickCalcData = sessionStorage.getItem('quickCalcData');
      if (quickCalcData) {
        try {
          const parsed = JSON.parse(quickCalcData);
          // Pre-populate with quick calculator data and store in localStorage
          const prefilledData = {
            ...formData,
            state: parsed.state || formData.state,
          };
          setFormData(prefilledData);
          
          // Also store the quick calc data for the next step
          const calculatorData = {
            leadCapture: prefilledData,
            currentCompany: {
              systemSize: parsed.systemSize || '',
              state: parsed.state || '',
              dealType: parsed.dealType || '',
              pricingStructure: 'ppw',
              priceAmount: parsed.priceAmount || '',
              commissionEarned: parsed.commissionEarned || '',
              roofingAdder: parsed.roofingAdder || '0',
              mpuAdder: '0',
              batteryAdder: '0',
              otherAdder: '0'
            }
          };
          localStorage.setItem('calculatorData', JSON.stringify(calculatorData));
          
          // Clear the session storage data
          sessionStorage.removeItem('quickCalcData');
        } catch (error) {
          console.error('Error loading quick calc data:', error);
        }
      }
    } else {
      // Normal loading from localStorage
      const savedData = localStorage.getItem('calculatorData');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          if (parsedData?.leadCapture) {
            setFormData(parsedData.leadCapture);
          }
        } catch (error) {
          console.error('Error loading saved data:', error);
        }
      }
    }
  }, [searchParams]);

  // Save data to localStorage whenever formData changes
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('calculatorData') || '{}');
    savedData.leadCapture = formData;
    localStorage.setItem('calculatorData', JSON.stringify(savedData));
  }, [formData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.experience) {
      newErrors.experience = 'Please select your experience level';
    }

    if (!formData.careerInstalls) {
      newErrors.careerInstalls = 'Please select your career installs';
    }

    if (!formData.motivator) {
      newErrors.motivator = 'Please select your primary motivator';
    }

    if (!formData.state) {
      newErrors.state = 'Please select your preferred work state';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Here we would normally save to database, but for now just proceed
      toast({
        title: "Information Saved",
        description: "Your details have been captured successfully!",
      });

      // Navigate to step 2
      router.push(`/calculator/${calculatorType}/step-2`);
    } catch (error) {
      console.error('Error saving lead data:', error);
      toast({
        title: "Error",
        description: "There was an issue saving your information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // State validation function
  const checkStateAvailability = async (selectedState: string) => {
    if (!selectedState) return;
    
    setIsCheckingState(true);
    
    try {
      const response = await fetch(`/api/baseline?state=${encodeURIComponent(selectedState)}&checkAvailability=true`);
      
      if (response.ok) {
        const data = await response.json();
        
        if (!data.isServiced) {
          setShowStateModal(true);
          return;
        }
      }
    } catch (error) {
      console.error('State validation error:', error);
      // Continue on error - don't block user flow
    } finally {
      setIsCheckingState(false);
    }
  };

  const updateField = (field: keyof LeadCaptureData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Special handling for state selection - check availability
    if (field === 'state' && typeof value === 'string') {
      checkStateAvailability(value);
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleStateModalStartOver = () => {
    setFormData(prev => ({ ...prev, state: '' }));
    setShowStateModal(false);
  };



  return (
    <div className="p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center"
          >
            <User className="h-8 w-8 text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-bold mb-2">
            {calculatorType === 'team-leader' ? 'Tell Us About Your Leadership Background' : 'Tell Us About Yourself'}
          </h1>
          <p className="text-muted-foreground text-lg mb-4">
            {calculatorType === 'team-leader' 
              ? 'Help us provide accurate leadership opportunity calculations tailored to your experience and team-building goals'
              : 'Help us provide accurate commission calculations tailored to your experience and goals'
            }
          </p>
          <div className="max-w-2xl mx-auto p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
              <strong>Important:</strong> By submitting this form, you understand that Beacon Solar Solutions 
              operates this calculator platform but is not the direct employer. We connect qualified candidates 
              with solar industry opportunities through our partner network.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>Personal Information</span>
                </CardTitle>
                <CardDescription>
                  Basic contact details for personalized results
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        className={`pl-10 ${errors.name ? 'border-destructive' : ''}`}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        className={`pl-10 ${errors.phone ? 'border-destructive' : ''}`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Current Company</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="company"
                        type="text"
                        placeholder="Your current solar company"
                        value={formData.company}
                        onChange={(e) => updateField('company', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Professional Background */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span>Professional Background</span>
                </CardTitle>
                <CardDescription>
                  Your experience level helps us calculate accurate commission rates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Years in Solar Industry *</Label>
                    <Select 
                      value={formData.experience} 
                      onValueChange={(value) => updateField('experience', value)}
                    >
                      <SelectTrigger className={errors.experience ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPERIENCE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.experience && (
                      <p className="text-sm text-destructive">{errors.experience}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Career Installs *</Label>
                    <Select 
                      value={formData.careerInstalls} 
                      onValueChange={(value) => updateField('careerInstalls', value)}
                    >
                      <SelectTrigger className={errors.careerInstalls ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Total career installations" />
                      </SelectTrigger>
                      <SelectContent>
                        {CAREER_INSTALLS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.careerInstalls && (
                      <p className="text-sm text-destructive">{errors.careerInstalls}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Motivators & Goals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span>Career Goals</span>
                </CardTitle>
                <CardDescription>
                  Understanding your motivations helps us highlight relevant opportunities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Primary Motivator *</Label>
                  <Select 
                    value={formData.motivator} 
                    onValueChange={(value) => updateField('motivator', value)}
                  >
                    <SelectTrigger className={errors.motivator ? 'border-destructive' : ''}>
                      <SelectValue placeholder="What motivates you most?" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOTIVATOR_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.motivator && (
                    <p className="text-sm text-destructive">{errors.motivator}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>



          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>Preferred Work Location</span>
                </CardTitle>
                <CardDescription>
                  State-specific baseline pricing affects commission calculations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Preferred Work State *</Label>
                  <Select 
                    value={formData.state} 
                    onValueChange={(value) => updateField('state', value)}
                    disabled={isCheckingState}
                  >
                    <SelectTrigger className={errors.state ? 'border-destructive' : ''}>
                      <SelectValue placeholder={isCheckingState ? 'Checking availability...' : 'Select your preferred work state'} />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px] overflow-y-auto">
                      {US_STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.state && (
                    <p className="text-sm text-destructive">{errors.state}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-end pt-6"
          >
            <Button
              type="submit"
              size="lg"
              className="btn-gradient text-white min-w-[200px]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Explore Partner Opportunities</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </motion.div>
        </form>
      </motion.div>

      {/* State Validation Modal */}
      <StateValidationModal
        isOpen={showStateModal}
        onClose={() => setShowStateModal(false)}
        state={formData.state}
        onStartOver={handleStateModalStartOver}
      />
    </div>
  );
}
