

import { NextRequest, NextResponse } from 'next/server';
import { getBaselinePrice } from '@/lib/calculations';

interface QuickCalcRequest {
  state: string;
  systemSize: number;
  ppw: number;
  dealType: 'ownership' | 'lease';
  currentCommission: number;
  adders?: number;
}

interface QuickCalcResponse {
  partnerCommission: number;
  currentCommission: number;
  difference: number;
  annualDifference: number;
  showPartner: boolean;
  baseline: number;
  stateAvailable: boolean;
}

// State partner availability (major solar states)
const STATE_PARTNER_AVAILABILITY: Record<string, boolean> = {
  'California': true,
  'Texas': true,
  'Florida': true,
  'Arizona': true,
  'Nevada': true,
  'Colorado': true,
  'Utah': true,
  'North Carolina': true,
  'New Jersey': true,
  'Massachusetts': true,
  'New York': true,
  'Connecticut': true,
  'Maryland': true,
  'South Carolina': true,
  'Georgia': true,
  'Virginia': true,
  'Illinois': true,
  'Pennsylvania': true,
  'Ohio': true,
  'Michigan': true,
  'Oregon': true,
  'Washington': true,
  // All other states default to false (expanding soon)
};

function quickCalculation(
  state: string,
  systemSize: number,
  ppw: number,
  dealType: 'ownership' | 'lease',
  currentCommission: number,
  adders: number = 0
): QuickCalcResponse {
  const baseline = getBaselinePrice(state, dealType);
  
  // If baseline is 0 (unavailable state), return no partner opportunity
  if (baseline === 0) {
    return {
      partnerCommission: 0,
      currentCommission,
      difference: 0,
      annualDifference: 0,
      showPartner: false,
      baseline: 0,
      stateAvailable: false
    };
  }

  // Quick calculation logic
  const systemWatts = systemSize * 1000;
  const totalProfit = Math.max(0, (ppw - baseline) * systemWatts);
  const adjustedProfit = Math.max(0, totalProfit - adders);
  const companyProfit = adjustedProfit * 0.8; // Company keeps 80%
  const availablePool = Math.max(0, companyProfit - 150); // Subtract company fee
  
  // Assume 60% commission rate for experienced reps (optimistic for quick calc)
  const partnerCommission = availablePool * 0.6;
  
  const difference = partnerCommission - currentCommission;
  const annualDifference = difference * 36; // 3 deals per month
  
  // Only show partner opportunity if it's meaningfully better (at least $100/deal or 10% improvement)
  const meaningfulImprovement = difference >= 100 || (difference / currentCommission) >= 0.1;
  const showPartner = meaningfulImprovement && partnerCommission > currentCommission;
  
  const stateAvailable = STATE_PARTNER_AVAILABILITY[state] || false;

  return {
    partnerCommission: Math.round(partnerCommission),
    currentCommission: Math.round(currentCommission),
    difference: Math.round(difference),
    annualDifference: Math.round(annualDifference),
    showPartner: showPartner && stateAvailable,
    baseline,
    stateAvailable
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: QuickCalcRequest = await request.json();
    
    // Validate required fields
    if (!body.state || !body.systemSize || !body.ppw || !body.dealType || !body.currentCommission) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate numeric inputs
    if (body.systemSize <= 0 || body.ppw <= 0 || body.currentCommission < 0) {
      return NextResponse.json(
        { error: 'Invalid numeric values' },
        { status: 400 }
      );
    }

    // Validate deal type
    if (!['ownership', 'lease'].includes(body.dealType)) {
      return NextResponse.json(
        { error: 'Invalid deal type' },
        { status: 400 }
      );
    }

    const results = quickCalculation(
      body.state,
      body.systemSize,
      body.ppw,
      body.dealType,
      body.currentCommission,
      body.adders || 0
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error('Quick calculation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

