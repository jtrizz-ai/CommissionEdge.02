

import { NextRequest, NextResponse } from 'next/server';
import { getBaselinePrice } from '@/lib/calculations';

interface BaselineRequest {
  state: string;
  dealType?: 'ownership' | 'lease';
  checkAvailability?: boolean;
}

interface BaselineResponse {
  state: string;
  ownershipBaseline: number;
  ppaLeaseBaseline: number;
  isServiced: boolean;
  message: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    const checkAvailability = searchParams.get('checkAvailability') === 'true';
    
    if (!state) {
      return NextResponse.json(
        { error: 'State parameter is required' },
        { status: 400 }
      );
    }

    // Get baseline prices for both deal types
    const ownershipBaseline = getBaselinePrice(state, 'ownership');
    const ppaLeaseBaseline = getBaselinePrice(state, 'lease');
    
    // Check if state is serviced (has baseline pricing > 0)
    const isServiced = ownershipBaseline > 0 || ppaLeaseBaseline > 0;
    
    const response: BaselineResponse = {
      state,
      ownershipBaseline: Math.round(ownershipBaseline * 100) / 100, // Round to 2 decimals
      ppaLeaseBaseline: Math.round(ppaLeaseBaseline * 100) / 100,
      isServiced,
      message: isServiced 
        ? 'Partner companies available in this state'
        : 'No current partners in this state'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Baseline API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

