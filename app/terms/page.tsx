
'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, ArrowLeft, AlertTriangle, Scale } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Calculator className="h-6 w-6 text-primary" />
              <span className="text-2xl font-bold text-gradient">CommissionEdge</span>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container-custom py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
              <Scale className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">
              Last updated: August 27, 2025
            </p>
          </div>

          {/* Important Notice */}
          <div className="mb-8">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-amber-700 dark:text-amber-300">Important Notice</p>
                  <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                    By using CommissionEdge, you acknowledge that Beacon Solar Solutions is not a direct employer 
                    and operates as a platform connecting professionals with opportunities in the solar industry.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Platform Purpose */}
            <Card>
              <CardHeader>
                <CardTitle>1. Platform Purpose and Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  <strong>CommissionEdge</strong> is an informational platform and career connection service operated 
                  by Beacon Solar Solutions. The platform provides commission calculators, career guidance, and 
                  facilitates connections between solar industry professionals and hiring companies.
                </p>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Key Service Limitations:</p>
                  <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                    <li>• Beacon Solar Solutions does not directly employ users of this platform</li>
                    <li>• All employment opportunities are with third-party companies in the solar industry</li>
                    <li>• We facilitate connections but do not guarantee employment outcomes</li>
                    <li>• Calculator results are estimates and not guaranteed earnings</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Calculator Accuracy */}
            <Card>
              <CardHeader>
                <CardTitle>2. Calculator Accuracy and Disclaimers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Commission calculations provided by CommissionEdge are estimates based on industry data, 
                  baseline pricing, and standardized commission structures. These calculations should not be 
                  considered guaranteed earnings or binding offers.
                </p>

                <div className="space-y-3">
                  <h4 className="font-semibold">Calculation Limitations:</h4>
                  <ul className="text-sm text-muted-foreground space-y-2 ml-4">
                    <li>• Actual compensation may vary based on company policies</li>
                    <li>• Market conditions may affect real-world earnings</li>
                    <li>• Individual performance impacts actual results</li>
                    <li>• State availability and baseline pricing may change</li>
                    <li>• Recruiting income and equity projections are estimates only</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Third-Party Relationships */}
            <Card>
              <CardHeader>
                <CardTitle>3. Third-Party Employment Relationships</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Employment relationships, if any, will be directly between users and hiring companies in our 
                  partner network. Beacon Solar Solutions is not responsible for employment terms, conditions, 
                  disputes, or outcomes.
                </p>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Partner Company Relationships:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• We maintain referral relationships with solar companies</li>
                    <li>• Partner companies set their own hiring criteria and compensation</li>
                    <li>• Employment terms are negotiated directly between candidate and company</li>
                    <li>• We do not control hiring decisions or employment outcomes</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Data Usage */}
            <Card>
              <CardHeader>
                <CardTitle>4. Data Collection and Usage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Information collected through CommissionEdge may be shared with partner solar companies 
                  for the purpose of career opportunities. By using the platform, you consent to this data sharing.
                </p>

                <div className="space-y-3">
                  <h4 className="font-semibold">Data Sharing Practices:</h4>
                  <ul className="text-sm text-muted-foreground space-y-2 ml-4">
                    <li>• Contact information shared with relevant hiring companies</li>
                    <li>• Professional background shared for opportunity matching</li>
                    <li>• Calculator results may be shared to demonstrate potential</li>
                    <li>• Users may request data removal at any time</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* User Responsibilities */}
            <Card>
              <CardHeader>
                <CardTitle>5. User Responsibilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Users are responsible for providing accurate information and understanding the nature 
                  of the platform as a connection service rather than a direct employer.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">User Obligations:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Provide accurate information</li>
                      <li>• Understand platform limitations</li>
                      <li>• Comply with partner company requirements</li>
                      <li>• Respect intellectual property</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Prohibited Uses:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Misrepresentation of experience</li>
                      <li>• Circumventing platform processes</li>
                      <li>• Unauthorized commercial use</li>
                      <li>• Harmful or illegal activities</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card>
              <CardHeader>
                <CardTitle>6. Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Beacon Solar Solutions provides the CommissionEdge platform "as is" and disclaims all warranties. 
                  We are not liable for employment outcomes, calculator accuracy, or actions of partner companies.
                </p>

                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="font-semibold text-red-700 dark:text-red-300 mb-2">No Employment Guarantees:</p>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    This platform does not guarantee employment, specific compensation levels, or career outcomes. 
                    All professional relationships are between users and third-party companies.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>7. Questions and Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  For questions about these terms or the CommissionEdge platform, please contact:
                </p>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p><strong>Contact Us</strong></p>
                  <p>Email: beaconsolarsolution@gmail.com</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    For employment-related questions, please contact the relevant hiring company directly.
                    We typically respond within 24 hours during business days.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
