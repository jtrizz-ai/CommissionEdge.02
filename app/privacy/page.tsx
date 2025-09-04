
'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, ArrowLeft, Shield, Eye, Lock, Users } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
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
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">
              Last updated: August 27, 2025
            </p>
          </div>

          <div className="space-y-8">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-6 w-6 text-primary" />
                  <span>Privacy Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Beacon Solar Solutions operates CommissionEdge to connect solar industry professionals 
                  with career opportunities. This Privacy Policy explains how we collect, use, and protect 
                  your personal information.
                </p>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Key Privacy Principles:</p>
                  <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                    <li>• We collect only necessary information for career connections</li>
                    <li>• Data is shared with partner companies for opportunity matching</li>
                    <li>• You can request data removal at any time</li>
                    <li>• We use industry-standard security measures</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Information We Collect */}
            <Card>
              <CardHeader>
                <CardTitle>Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  We collect information you provide directly through our calculator forms and any 
                  additional interactions with our platform.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Personal Information:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Full name</li>
                      <li>• Email address</li>
                      <li>• Phone number</li>
                      <li>• Current company (optional)</li>
                      <li>• Preferred work state/location</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Professional Information:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Years of experience in solar</li>
                      <li>• Career installation count</li>
                      <li>• Primary career motivators</li>
                      <li>• Lead generation preferences</li>
                      <li>• Calculator inputs and results</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-6 w-6 text-primary" />
                  <span>How We Use Your Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Your information is used primarily to connect you with relevant career opportunities 
                  in our partner network of solar companies.
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Primary Uses:</h4>
                    <ul className="text-sm text-muted-foreground space-y-2 ml-4">
                      <li>• Calculate personalized commission projections</li>
                      <li>• Match you with appropriate opportunities</li>
                      <li>• Share your profile with relevant hiring companies</li>
                      <li>• Send results and follow-up communications</li>
                      <li>• Improve our platform and services</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="font-semibold text-green-700 dark:text-green-300 mb-2">Data Sharing for Opportunities:</p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      By using CommissionEdge, you consent to having your information shared with 
                      solar companies in our partner network for the purpose of career opportunities. 
                      This sharing enables us to connect you with relevant positions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Information Sharing */}
            <Card>
              <CardHeader>
                <CardTitle>Information Sharing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  We share your information with partner companies in our solar industry network 
                  to facilitate career connections and opportunities.
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Partner Company Sharing:</h4>
                    <ul className="text-sm text-muted-foreground space-y-2 ml-4">
                      <li>• Contact information for follow-up communications</li>
                      <li>• Professional background and experience details</li>
                      <li>• Calculator results to demonstrate earning potential</li>
                      <li>• Location preferences for territory matching</li>
                      <li>• Career goals and motivations for role fitting</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">We Do NOT Share:</h4>
                    <ul className="text-sm text-muted-foreground space-y-2 ml-4">
                      <li>• Information with non-partner third parties</li>
                      <li>• Data for marketing unrelated to solar careers</li>
                      <li>• Personal information for commercial sales</li>
                      <li>• Sensitive financial or personal details</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="h-6 w-6 text-primary" />
                  <span>Data Security</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your 
                  personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Technical Safeguards:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• SSL encryption for data transmission</li>
                      <li>• Secure data storage practices</li>
                      <li>• Regular security assessments</li>
                      <li>• Access controls and authentication</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Organizational Measures:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Limited access to personal data</li>
                      <li>• Employee privacy training</li>
                      <li>• Partner company vetting</li>
                      <li>• Regular policy reviews</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card>
              <CardHeader>
                <CardTitle>Your Privacy Rights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  You have several rights regarding your personal information and how it's used 
                  on our platform.
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Your Rights Include:</h4>
                    <ul className="text-sm text-muted-foreground space-y-2 ml-4">
                      <li>• <strong>Access:</strong> Request a copy of your personal data</li>
                      <li>• <strong>Correction:</strong> Update or correct inaccurate information</li>
                      <li>• <strong>Deletion:</strong> Request removal of your personal data</li>
                      <li>• <strong>Opt-out:</strong> Stop receiving communications</li>
                      <li>• <strong>Data Portability:</strong> Receive your data in a portable format</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">How to Exercise Your Rights:</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Contact us at <strong>beaconsolarsolution@gmail.com</strong>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      We will respond to your request within 30 days. Note that data removal may affect 
                      our ability to connect you with future opportunities.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cookies and Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Cookies and Analytics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  We use cookies and similar technologies to improve your experience on our platform 
                  and understand how it's being used.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Cookie Types:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• <strong>Essential:</strong> Required for platform functionality</li>
                      <li>• <strong>Analytics:</strong> Help us understand usage patterns</li>
                      <li>• <strong>Preferences:</strong> Remember your settings</li>
                      <li>• <strong>Marketing:</strong> Track referrals and campaigns</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Managing Cookies:</h4>
                    <p className="text-sm text-muted-foreground">
                      You can control cookies through your browser settings. Note that disabling 
                      certain cookies may affect platform functionality.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Us */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Us About Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you have questions about this Privacy Policy or how we handle your personal information, 
                  please contact us:
                </p>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p><strong>Contact Us</strong></p>
                  <p>Email: beaconsolarsolution@gmail.com</p>
                  <p>Subject Line: "Privacy Policy Inquiry"</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    We typically respond to privacy inquiries within 24 hours during business days.
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
