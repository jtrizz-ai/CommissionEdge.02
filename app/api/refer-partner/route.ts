

import { NextRequest, NextResponse } from 'next/server';

interface PartnerReferralRequest {
  state: string;
  referrerName: string;
  referrerEmail: string;
  partnerInfo?: string;
  partnerCompany?: string;
  partnerContact?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: PartnerReferralRequest = await request.json();
    
    // Validate required fields
    if (!body.state || !body.referrerName || !body.referrerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: state, referrerName, referrerEmail' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.referrerEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // For now, simulate email sending (would integrate with actual email service)
    console.log('Partner Referral Submitted:', {
      state: body.state,
      referrer: `${body.referrerName} <${body.referrerEmail}>`,
      partnerInfo: body.partnerInfo || 'No additional info provided',
      timestamp: new Date().toISOString()
    });

    // In production, this would:
    // 1. Send email to beaconsolarsolution@gmail.com
    // 2. Save referral to database for tracking
    // 3. Send confirmation email to referrer
    // 4. Add to CRM system for follow-up

    // Simulate successful email send
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      message: `Partner referral for ${body.state} submitted successfully`,
      referralId: `REF-${Date.now()}`, // Generate unique ID
      nextSteps: 'Our team will review and reach out to potential partners within 5 business days'
    });
    
  } catch (error) {
    console.error('Partner referral error:', error);
    return NextResponse.json(
      { error: 'Failed to submit referral. Please try again.' },
      { status: 500 }
    );
  }
}

