
'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Users, Target, Award, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
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
            <h1 className="text-4xl font-bold mb-4">About CommissionEdge</h1>
            <p className="text-xl text-muted-foreground">
              Connecting Solar Professionals with Opportunities
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Platform Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-6 w-6 text-primary" />
                  <span>Our Platform</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  CommissionEdge is a professional platform created by Beacon Solar Solutions to help solar 
                  industry professionals accurately calculate their earning potential and compare opportunities 
                  across different companies and career paths.
                </p>
                
                <p className="text-muted-foreground leading-relaxed">
                  We partner with established solar companies and installers across the United States to connect 
                  qualified sales professionals, field marketers, and leaders with career opportunities that match 
                  their goals and experience level.
                </p>

                <div className="p-4 bg-primary/10 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-primary">Important: We Are Not The Employer</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Beacon Solar Solutions does not directly employ sales staff but maintains relationships 
                        with hiring companies throughout the solar industry. Our role is to provide transparent 
                        information and facilitate connections between professionals and employers.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Our Mission */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-6 w-6 text-primary" />
                  <span>Our Mission</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  To empower solar professionals with accurate, transparent information about their earning 
                  potential and career opportunities in the rapidly growing solar industry.
                </p>

                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Calculator className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold mb-2">Transparency</h4>
                    <p className="text-sm text-muted-foreground">
                      Clear, accurate commission calculations with real baseline data
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold mb-2">Connection</h4>
                    <p className="text-sm text-muted-foreground">
                      Bridging qualified professionals with hiring companies
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold mb-2">Growth</h4>
                    <p className="text-sm text-muted-foreground">
                      Supporting career advancement in the solar industry
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What We Offer */}
            <Card>
              <CardHeader>
                <CardTitle>What We Provide</CardTitle>
                <CardDescription>
                  Comprehensive tools and services for solar industry professionals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">For Professionals:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        <span>Commission comparison calculators</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        <span>Recruiting income and team growth analysis</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        <span>Career path guidance and projections</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        <span>Connection to vetted hiring companies</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">For Companies:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        <span>Access to qualified, pre-screened candidates</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        <span>Transparent compensation benchmarking</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        <span>Reduced hiring time and costs</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        <span>Industry expertise and market insights</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
                <CardDescription>
                  Questions about our platform or services?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="p-6 bg-primary/5 rounded-lg border border-primary/20 mb-4">
                    <h4 className="font-semibold mb-3">Contact Us</h4>
                    <div className="space-y-2">
                      <p><strong>Email:</strong> beaconsolarsolution@gmail.com</p>
                      <p className="text-muted-foreground text-sm">
                        Questions about opportunities, calculator results, or partnership details? 
                        Email us directly and we'll respond within 24 hours.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Legal Notice */}
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-2">
                    Legal Disclaimer
                  </h4>
                  <p className="text-sm text-amber-600 dark:text-amber-400 leading-relaxed">
                    Beacon Solar Solutions operates the CommissionEdge platform and facilitates connections 
                    between solar professionals and hiring companies. We are not a direct employer and do not 
                    guarantee employment outcomes. All employment relationships are between candidates and 
                    the hiring companies in our partner network.
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
