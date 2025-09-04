

import { NextRequest, NextResponse } from 'next/server';

/**
 * Field Marketing Route Blocker
 * 
 * Blocks access to field marketing features during launch period
 * Returns a "coming soon" message for field marketing requests
 */

export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      message: 'Field Marketing Features Coming Soon',
      status: 'disabled_for_launch',
      description: 'Field marketing calculators and tools launching Q1 2025',
      availableFeatures: [
        'Sales Rep Commission Calculator',
        'Team Leadership Opportunity Calculator', 
        'Quick Commission Comparison'
      ],
      contactEmail: 'beaconsolarsolution@gmail.com'
    },
    { status: 404 }
  );
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      error: 'Feature not available yet',
      message: 'Field marketing tools launching soon',
      status: 'disabled_for_launch'
    },
    { status: 404 }
  );
}

