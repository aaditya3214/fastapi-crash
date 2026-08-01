import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import MarketDashboard from './MarketDashboard';

const API_BASE_URL = 'http://localhost:8080';

const getAIResponse = (query) => {
  return {
    contentType: 'static_mock',
    query: query
  };
};

const renderStaticMockUI = (query) => {
  const q = (query || '').toLowerCase();
  
  if (q.includes("infosys hits 5-year low") || (q.includes("infosys") && q.includes("5-year"))) {
    return (
      <div className="space-y-4 text-gray-800">
        <p className="leading-relaxed">
          Infosys (INFY) is currently trading at a <strong className="text-slate-900">5-year relative valuation low</strong>. The recent correction was triggered by Accenture's downward revision of its full-year guidance, highlighting temporary headwinds in discretionary tech spending.
        </p>
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-xs text-gray-400 block uppercase font-bold">Price</span>
            <span className="text-base font-extrabold text-red-600">₹1,340 <span className="text-xs font-normal">(-4.2%)</span></span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-xs text-gray-400 block uppercase font-bold">P/E Ratio</span>
            <span className="text-base font-extrabold text-gray-800">20.5 <span className="text-[10px] text-gray-400 font-normal">(Avg: 26)</span></span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-xs text-gray-400 block uppercase font-bold">Div. Yield</span>
            <span className="text-base font-extrabold text-green-600">2.85%</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-xs text-gray-400 block uppercase font-bold">52W Range</span>
            <span className="text-xs font-extrabold text-gray-800">₹1,310 - ₹1,720</span>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto my-4 rounded-xl border border-slate-200">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-150 text-gray-700 uppercase font-black">
              <tr>
                <th className="px-4 py-3">Parameter</th>
                <th className="px-4 py-3">Infosys (INFY)</th>
                <th className="px-4 py-3">TCS</th>
                <th className="px-4 py-3">Wipro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="px-4 py-3 font-bold">Valuation</td>
                <td className="px-4 py-3 text-green-600 font-bold">Highly Attractive</td>
                <td className="px-4 py-3 text-yellow-600 font-bold">Fairly Valued</td>
                <td className="px-4 py-3 text-red-600 font-bold">Under Pressure</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold">Expected Growth</td>
                <td className="px-4 py-3">Moderate (5-7%)</td>
                <td className="px-4 py-3">Steady (7-9%)</td>
                <td className="px-4 py-3">Slow (2-4%)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold">Dividend Yield</td>
                <td className="px-4 py-3">2.85%</td>
                <td className="px-4 py-3">2.10%</td>
                <td className="px-4 py-3">1.80%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-emerald-50/70 border-l-4 border-emerald-500 p-4 rounded-r-xl">
          <h4 className="font-black text-emerald-800 text-xs uppercase">Recommendation</h4>
          <p className="text-xs text-emerald-700 mt-1 font-semibold leading-relaxed">
            <strong>BUY ON DIPS</strong>. This is a classic cyclical bottoming-out phase. Accumulate in the range of ₹1,300 - ₹1,340 for a long-term target of <strong>₹1,550</strong> (12-18 months horizon). Maintain a strict stop-loss at ₹1,280.
          </p>
        </div>
        <p className="text-[10px] text-gray-400 italic mt-6 select-none">
          *Disclaimer: Stock market investments are subject to market risks. Please consult a SEBI registered investment advisor before investing.
        </p>
      </div>
    );
  }
  
  if (q.includes("bharat forge") || q.includes("navy deal")) {
    return (
      <div className="space-y-4 text-gray-800">
        <p className="leading-relaxed">
          Bharat Forge's defense order win worth <strong className="text-slate-900">₹425 Crores</strong> from the Indian Navy marks a major milestone. This deal strengthens their defense pipeline, supporting the "Make in India" initiative and accelerating domestic sourcing.
        </p>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-xs text-gray-400 block uppercase font-bold">Price</span>
            <span className="text-base font-extrabold text-green-600">₹1,120 <span className="text-xs font-normal">(+5.8%)</span></span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-xs text-gray-400 block uppercase font-bold">Order Book</span>
            <span className="text-base font-extrabold text-slate-900">₹4,800 Cr</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-xs text-gray-400 block uppercase font-bold">P/E Ratio</span>
            <span className="text-base font-extrabold text-gray-800">38.2</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-xs text-gray-400 block uppercase font-bold">12M Target</span>
            <span className="text-base font-extrabold text-green-600">₹1,280</span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-black text-gray-800 text-xs uppercase">Key Strategic Catalysts:</h4>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-600 font-semibold leading-relaxed">
            <li><strong>Defense revenue share:</strong> Expected to jump from current 12% to over 25% of total revenues by FY27.</li>
            <li><strong>Margin expansion:</strong> High-margin defense contracts are expected to lift operating margins by 150-200 basis points.</li>
            <li><strong>Export growth:</strong> Robust demand for aerospace and industrial castings in Western Europe.</li>
          </ul>
        </div>

        <div className="bg-blue-50/70 border-l-4 border-blue-500 p-4 rounded-r-xl">
          <h4 className="font-black text-blue-800 text-xs uppercase">Investment Action</h4>
          <p className="text-xs text-blue-700 mt-1 font-semibold leading-relaxed">
            <strong>ACCUMULATE / BUY</strong> on slight pullbacks. The defence order pipeline provides excellent revenue visibility. Accumulate around ₹1,080 - ₹1,100 with a near-term target of <strong>₹1,190</strong> and 12-month target of <strong>₹1,280</strong>.
          </p>
        </div>
        <p className="text-[10px] text-gray-400 italic mt-6 select-none">
          *Disclaimer: Stock market investments are subject to market risks. Please consult a SEBI registered investment advisor before investing.
        </p>
      </div>
    );
  }

  if ((q.includes("tcs") && q.includes("infosys") && q.includes("fall")) || q.includes("third day straight")) {
    return (
      <div className="space-y-4 text-gray-800">
        <p className="leading-relaxed">
          The continuous 3-day drop in <strong>TCS</strong> and <strong>Infosys</strong> reflects a broader sector rotation and risk-off sentiment in global IT services. Nifty IT has dropped ~6.5% over this period, driven by slowing discretionary tech budgets.
        </p>

        {/* Technical Support Levels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h5 className="font-bold text-gray-900 border-b pb-2 mb-2 flex items-center justify-between">
              <span>Tata Consultancy Services (TCS)</span>
              <span className="text-xs px-2 py-0.5 bg-red-50 text-red-600 rounded font-bold">₹3,745</span>
            </h5>
            <div className="space-y-1.5 text-xs text-gray-600 font-semibold leading-relaxed">
              <p><strong>Support Level:</strong> ₹3,700 (Very strong psychological level)</p>
              <p><strong>Resistance Level:</strong> ₹3,920</p>
              <p><strong>Action:</strong> Buy at support. Set target for bounce at ₹3,900.</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h5 className="font-bold text-gray-900 border-b pb-2 mb-2 flex items-center justify-between">
              <span>Infosys (INFY)</span>
              <span className="text-xs px-2 py-0.5 bg-red-50 text-red-600 rounded font-bold">₹1,340</span>
            </h5>
            <div className="space-y-1.5 text-xs text-gray-600 font-semibold leading-relaxed">
              <p><strong>Support Level:</strong> ₹1,310 - ₹1,320</p>
              <p><strong>Resistance Level:</strong> ₹1,480</p>
              <p><strong>Action:</strong> Highly attractive risk-reward. Aggressive accumulation recommended.</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50/70 border-l-4 border-amber-500 p-4 rounded-r-xl">
          <h4 className="font-black text-amber-800 text-xs uppercase">Trading Strategy</h4>
          <p className="text-xs text-amber-700 mt-1 font-semibold leading-relaxed">
            <strong>SIP MODE / GRADUAL ACCUMULATION</strong>. Rather than going all-in, deploy capital in 20-30% tranches on every 2-3% dip. IT demand is cyclical, but secular cloud/AI transformation will drive recovery in late 2026.
          </p>
        </div>
        <p className="text-[10px] text-gray-400 italic mt-6 select-none">
          *Disclaimer: Stock market investments are subject to market risks. Please consult a SEBI registered investment advisor before investing.
        </p>
      </div>
    );
  }

  if (q.includes("tcs down 32%") || (q.includes("tcs") && q.includes("32%")) || (q.includes("tcs") && q.includes("buy more or hold"))) {
    return (
      <div className="space-y-4 text-gray-800">
        <p className="leading-relaxed">
          TCS's <strong className="text-slate-900">32% correction in 2026</strong> marks one of its steepest drawdowns since the pandemic. The drop has been fueled by delay in BFSI (Banking, Financial Services, and Insurance) vertical recovery in North America.
        </p>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-xs text-gray-400 block uppercase font-bold">Peak Price</span>
            <span className="text-xs font-extrabold text-gray-500">₹5,150</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-xs text-gray-400 block uppercase font-bold">Current Price</span>
            <span className="text-base font-extrabold text-red-600">₹3,502 <span className="text-xs font-normal">(-32%)</span></span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-xs text-gray-400 block uppercase font-bold">P/E Ratio</span>
            <span className="text-base font-extrabold text-gray-800">21.8 <span className="text-[10px] text-gray-400 font-normal">(Avg: 27)</span></span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-xs text-gray-400 block uppercase font-bold">Dividend Yield</span>
            <span className="text-base font-extrabold text-green-600">3.2%</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <h4 className="font-black text-gray-800 text-xs uppercase mb-2">Buy More or Hold?</h4>
          <div className="space-y-3 text-xs text-gray-600 font-semibold leading-relaxed">
            <p>
              <strong>1. If you are a Long-Term Investor (2+ Years Horizon):</strong>
              <span className="block text-green-700 font-bold mt-1">✓ BUY MORE (STRONG ACCUMULATION)</span>
              TCS has an exceptional ROE of 45%+, is virtually debt-free, and has a payout ratio near 100%. Under ₹3,600, it is a low-risk, high-quality compounding asset.
            </p>
            <p>
              <strong>2. If you are a Short-Term Trader (Under 3 Months):</strong>
              <span className="block text-amber-700 font-bold mt-1">✓ HOLD</span>
              Expect sideways consolidation between ₹3,400 and ₹3,650. The momentum is weak, and a trend reversal will require positive growth indicators from the US.
            </p>
          </div>
        </div>

        <p className="text-[10px] text-gray-400 italic mt-6 select-none">
          *Disclaimer: Stock market investments are subject to market risks. Please consult a SEBI registered investment advisor before investing.
        </p>
      </div>
    );
  }

  if (q.includes("mutual fund") || q.includes("tax saving") || q.includes("tax") || q.includes("elss")) {
    return (
      <div className="space-y-4 text-gray-800">
        <p className="leading-relaxed">
          For tax saving under <strong>Section 80C</strong>, ELSS (Equity Linked Savings Scheme) mutual funds offer the shortest lock-in period (3 years) and the potential for equity-linked wealth creation. Here are the <strong>top ELSS Mutual Funds recommended for 2026</strong>:
        </p>

        {/* ELSS Funds Grid */}
        <div className="space-y-3 my-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
            <div>
              <h5 className="font-bold text-gray-900 text-sm">Quant ELSS Tax Saver Fund</h5>
              <p className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">Very High Risk | Dynamic Allocation</p>
            </div>
            <div className="flex gap-6 text-xs font-semibold">
              <div>
                <span className="text-[10px] text-gray-400 block uppercase font-bold">3Y Returns</span>
                <span className="font-extrabold text-green-600">28.4% p.a.</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block uppercase font-bold">Expense Ratio</span>
                <span className="font-extrabold text-gray-700">0.77%</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
            <div>
              <h5 className="font-bold text-gray-900 text-sm">SBI Long Term Equity Fund</h5>
              <p className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">High Risk | Large & Mid-Cap Balanced</p>
            </div>
            <div className="flex gap-6 text-xs font-semibold">
              <div>
                <span className="text-[10px] text-gray-400 block uppercase font-bold">3Y Returns</span>
                <span className="font-extrabold text-green-600">24.8% p.a.</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block uppercase font-bold">Expense Ratio</span>
                <span className="font-extrabold text-gray-700">0.98%</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
            <div>
              <h5 className="font-bold text-gray-900 text-sm">Mirae Asset ELSS Tax Saver Fund</h5>
              <p className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">High Risk | Large-cap Oriented, Consistent</p>
            </div>
            <div className="flex gap-6 text-xs font-semibold">
              <div>
                <span className="text-[10px] text-gray-400 block uppercase font-bold">3Y Returns</span>
                <span className="font-extrabold text-green-600">21.2% p.a.</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block uppercase font-bold">Expense Ratio</span>
                <span className="font-extrabold text-gray-700">0.65%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border-l-4 border-slate-700 p-4 rounded-r-xl text-xs font-semibold leading-relaxed">
          <h4 className="font-black text-slate-800 uppercase text-[10px] tracking-wider mb-1">ELSS Tax Saving Summary</h4>
          <ul className="list-disc pl-5 space-y-1 text-slate-700">
            <li><strong>Max Benefit:</strong> Tax deduction up to ₹1,500,000 under Section 80C.</li>
            <li><strong>Lock-in:</strong> 3 years (shortest lock-in period among Section 80C alternatives).</li>
            <li><strong>Tax on gains:</strong> LTCG (Long Term Capital Gains) taxed at 10% on gains exceeding ₹1 Lakh in a financial year.</li>
          </ul>
        </div>
        <p className="text-[10px] text-gray-400 italic mt-6 select-none">
          *Disclaimer: Mutual fund investments are subject to market risks. Read all scheme related documents carefully.
        </p>
      </div>
    );
  }

  // General stock search response
  return (
    <div className="space-y-4 text-gray-800">
      <p className="leading-relaxed">
        Here is the latest intelligence report for your query on <strong>"{query}"</strong>:
      </p>

      {/* Structured mock report */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 space-y-3">
        <h4 className="font-bold text-gray-900 flex items-center gap-2 text-sm select-none">
          <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Stock & Market Analytics
        </h4>
        
        <div className="space-y-2 text-xs md:text-sm text-gray-600 font-semibold leading-relaxed">
          <p>
            <strong>Market Sentiment:</strong> Neutral-to-Bullish. Heavy domestic institutional inflows (DII) are supporting the Indian benchmark indices, offsetting minor foreign outflows.
          </p>
          <p>
            <strong>Technical Perspective:</strong> The major benchmark indices (Nifty 50 and Sensex) are consolidating at crucial support levels after a small technical consolidation.
          </p>
          <p>
            <strong>Actionable Outlook:</strong> Focus on sectors with direct tailwinds, high dividend yields, or direct beneficiaries from government defense and infrastructure initiatives. Accumulating top-tier companies on market corrections remains the preferred strategy.
          </p>
        </div>
      </div>

      <div className="bg-slate-100/50 p-4 rounded-xl border border-slate-200/50">
        <h5 className="font-bold text-[10px] uppercase text-gray-400 mb-2 tracking-wider">Recommended Stocks to Watch:</h5>
        <div className="flex flex-wrap gap-2">
          <span className="px-2.5 py-1 bg-white border border-slate-250 rounded-lg text-[11px] font-bold text-gray-700">TCS (IT Bluechip)</span>
          <span className="px-2.5 py-1 bg-white border border-slate-250 rounded-lg text-[11px] font-bold text-gray-700">Bharat Forge (Defense Catalyst)</span>
          <span className="px-2.5 py-1 bg-white border border-slate-250 rounded-lg text-[11px] font-bold text-gray-700">Reliance (Conglomerate Value)</span>
          <span className="px-2.5 py-1 bg-white border border-slate-250 rounded-lg text-[11px] font-bold text-gray-700">Infosys (Valuation Support)</span>
        </div>
      </div>

      <p className="text-[10px] text-gray-400 italic mt-6 select-none">
        *Disclaimer: Markets are subject to fluctuations. Please perform self-directed research or speak with a financial advisor.
      </p>
    </div>
  );
};

/* ==========================================
   GET STOCK ADVISOR DYNAMIC AI RESPONSE
   ========================================== */
const getDynamicAIResponse = async (query) => {
  const q = query.toLowerCase();
  
  // 1. Check for specific static mock templates first
  if (q.includes("infosys hits 5-year low") || (q.includes("infosys") && q.includes("5-year"))) {
    return getAIResponse(query);
  }
  if (q.includes("bharat forge") || q.includes("navy deal")) {
    return getAIResponse(query);
  }
  if ((q.includes("tcs") && q.includes("infosys") && q.includes("fall")) || q.includes("third day straight")) {
    return getAIResponse(query);
  }
  if (q.includes("tcs down 32%") || (q.includes("tcs") && q.includes("32%")) || (q.includes("tcs") && q.includes("buy more or hold"))) {
    return getAIResponse(query);
  }
  if (q.includes("mutual fund") || q.includes("tax saving") || q.includes("tax") || q.includes("elss")) {
    return getAIResponse(query);
  }

  // 2. Detect if any stock is mentioned
  const stockMap = {
    'reliance': 'RELIANCE',
    'tcs': 'TCS',
    'tata consultancy': 'TCS',
    'infosys': 'INFY',
    'infy': 'INFY',
    'wipro': 'WIPRO',
    'hdfc': 'HDFCBANK',
    'sbi': 'SBIN',
    'state bank': 'SBIN',
    'icici': 'ICICIBANK',
    'axis': 'AXISBANK',
    'bajaj': 'BAJFINANCE',
    'lt': 'LT',
    'larsen': 'LT',
    'itc': 'ITC',
    'maruti': 'MARUTI',
    'tata motors': 'TATAMOTORS',
    'tata steel': 'TATASTEEL',
    'kotak': 'KOTAKBANK',
    'airtel': 'BHARTIARTL',
    'bharti': 'BHARTIARTL',
    'hcl': 'HCLTECH',
    'ntpc': 'NTPC',
    'titan': 'TITAN',
    'asian paints': 'ASIANPAINT',
    'coal india': 'COALINDIA',
    'sun pharma': 'SUNPHARMA',
    'ongc': 'ONGC',
    'trent': 'TRENT',
    'apollo': 'APOLLOHOSP',
    'adani': 'ADANIENT'
  };

  let matchedSymbol = null;
  for (const [key, value] of Object.entries(stockMap)) {
    if (q.includes(key)) {
      matchedSymbol = value;
      break;
    }
  }

  // Also check if any word is a 3+ letter uppercase word
  if (!matchedSymbol) {
    const words = query.split(/\s+/);
    for (const word of words) {
      const cleanWord = word.replace(/[^a-zA-Z]/g, '');
      if (cleanWord.length >= 3 && cleanWord === cleanWord.toUpperCase()) {
        matchedSymbol = cleanWord;
        break;
      }
    }
  }

  if (matchedSymbol) {
    try {
      const summaryRes = await axios.get(`${API_BASE_URL}/api/stock-summary/${matchedSymbol}`);
      const summaryData = summaryRes.data;
      
      return {
        contentType: 'stock_summary',
        symbol: matchedSymbol,
        companyName: summaryData?.company_name || matchedSymbol,
        summaryData: summaryData?.data || summaryData,
        apiEndpoint: `GET /api/stock-summary/${matchedSymbol}`
      };
    } catch (err) {
      console.error("Failed to fetch stock summary data for chat:", err);
      return {
        contentType: 'stock_summary',
        symbol: matchedSymbol,
        companyName: matchedSymbol === "RELIANCE" ? "Reliance Industries" : matchedSymbol,
        summaryData: null,
        apiEndpoint: `GET /api/stock-summary/${matchedSymbol}`
      };
    }
  }

  // Fallback to static generic response
  return getAIResponse(query);
};

/* ==========================================
   STOCK AI SUMMARY REPORT VIEW COMPONENT
   ========================================== */
const StockAiSummaryReportView = ({ symbol, companyName, summaryData, apiEndpoint }) => {
  const report = summaryData?.report || summaryData?.data || summaryData || {};
  const metrics = report.financialSnapshot?.metrics || [];
  const exec = report.executiveSummaryAndVerdict || {};
  const drivers = report.keyOperationalDrivers || {};
  const mgmt = report.managementCommentaryAndConcallHighlights || {};
  const governance = report.shareholdingAndCorporateGovernanceCheck || {};
  const val = report.valuationAndRiskMatrix || {};

  const compName = companyName || report.companyName || symbol || "Reliance Industries";

  return (
    <div className="space-y-4 my-2 font-sans">
      {/* Main Report Container */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 md:p-6 shadow-sm space-y-6 text-slate-800 text-left">
        
        {/* Header Title */}
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-black rounded uppercase tracking-wider">
              {report.quarterFy || 'Q1 FY27'} Earnings Analysis
            </span>
            <span className="text-xs text-slate-400 font-bold">Presentation Document · PDF · 77 pages</span>
          </div>
          <h2 className="text-base md:text-lg font-black text-slate-900 mt-1">
            Indian Stock Market: Quarterly Earnings Analysis Report
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Company Name: <strong className="text-slate-800 font-bold">{compName}</strong> | Ticker (NSE/BSE): <strong className="text-slate-800 font-bold">{report.tickerNseBse || symbol || 'RELIANCE'}</strong> | Sector: <strong className="text-slate-800 font-bold">{report.sector || 'Conglomerate (Energy/Retail/Telecom)'}</strong>
          </p>
        </div>

        {/* Section 1: Executive Summary & Verdict */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-indigo-600 text-white flex items-center justify-center text-xs font-black">1</span>
            <h3 className="text-sm font-black text-slate-900">Executive Summary & Verdict</h3>
          </div>
          <p className="text-[11px] text-slate-400 font-semibold italic">Always state your bottom line first. This makes the report actionable.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Recommendation</span>
              <span className="inline-block px-2.5 py-0.5 bg-emerald-600 text-white text-xs font-black rounded mt-1 shadow-sm">
                {exec.recommendation || report.recommendation || 'Accumulate'}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Current Market Price (CMP)</span>
              <span className="text-xs font-black text-slate-900 mt-1 block">{exec.currentMarketPriceCmp || report.currentMarketPriceCmp || '₹2450.0'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Target Price</span>
              <span className="text-xs font-black text-emerald-700 mt-1 block">{exec.targetPrice || report.targetPrice || '₹2695.0'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Investment Horizon</span>
              <span className="text-xs font-bold text-slate-700 mt-1 block">{exec.investmentHorizon || report.investmentHorizon || '12-18 Months'}</span>
            </div>
          </div>

          <div className="p-3 bg-indigo-50/80 border border-indigo-100 rounded-xl">
            <span className="text-[11px] font-black text-indigo-950 block mb-0.5">The 30-Second Thesis:</span>
            <p className="text-xs text-slate-700 italic font-medium leading-relaxed">
              "{exec.thirtySecondThesis || report.thirtySecondThesis || 'The company reported strong Q1 FY27 earnings with YoY profit growth of 11.32% driven by resilient sales volume. With stable promoter holdings, zero promoter pledging, and a strong target price of ₹2695.0, the stock is a clean Accumulate recommendation.'}"
            </p>
          </div>
        </div>

        {/* Section 2: Financial Snapshot */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-indigo-600 text-white flex items-center justify-center text-xs font-black">2</span>
            <h3 className="text-sm font-black text-slate-900">Financial Snapshot (₹ in Crores)</h3>
          </div>
          <p className="text-[11px] text-slate-500 italic">
            In the Indian market, evaluating YoY (Year-over-Year) is generally preferred over QoQ due to festive/seasonal cycles (e.g., Diwali in Q3), but both are crucial.
          </p>

          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-white uppercase text-[10px] font-extrabold tracking-wider">
                <tr>
                  <th className="px-4 py-2.5">Metric</th>
                  <th className="px-4 py-2.5">Q1 FY27 (Actual)</th>
                  <th className="px-4 py-2.5">Est. (Consensus)</th>
                  <th className="px-4 py-2.5">YoY Growth</th>
                  <th className="px-4 py-2.5">QoQ Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-semibold text-slate-700">
                {(metrics.length > 0 ? metrics : [
                  { metric: "Net Sales / Revenue", qOneFyTwentySevenActual: "₹155139.32 Cr", estConsensus: "₹155015.21 Cr", yoyGrowth: "+11.32%", qoqGrowth: "+2.61%" },
                  { metric: "EBITDA", qOneFyTwentySevenActual: "₹21226.18 Cr", estConsensus: "₹20721.00 Cr", yoyGrowth: "+9.64%", qoqGrowth: "+2.25%" },
                  { metric: "EBITDA Margin", qOneFyTwentySevenActual: "13.68%", estConsensus: "13.37%", yoyGrowth: "-21 bps", qoqGrowth: "-5 bps" },
                  { metric: "PAT (Profit After Tax)", qOneFyTwentySevenActual: "₹10290.78 Cr", estConsensus: "₹10621.11 Cr", yoyGrowth: "+11.32%", qoqGrowth: "+2.61%" },
                  { metric: "EPS (₹)", qOneFyTwentySevenActual: "₹7.60", estConsensus: "₹7.50", yoyGrowth: "+11.27%", qoqGrowth: "+2.56%" }
                ]).map((m, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/70 hover:bg-slate-100'}>
                    <td className="px-4 py-2.5 font-extrabold text-slate-900">{m.metric}</td>
                    <td className="px-4 py-2.5 font-black text-slate-800">{m.qOneFyTwentySevenActual || m.actual}</td>
                    <td className="px-4 py-2.5 text-slate-500">{m.estConsensus || m.consensus}</td>
                    <td className={`px-4 py-2.5 font-extrabold ${String(m.yoyGrowth || m.yoy).startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {m.yoyGrowth || m.yoy}
                    </td>
                    <td className={`px-4 py-2.5 font-semibold ${String(m.qoqGrowth || m.qoq).startsWith('+') ? 'text-emerald-600' : 'text-slate-600'}`}>
                      {m.qoqGrowth || m.qoq}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Key Operational Drivers */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-indigo-600 text-white flex items-center justify-center text-xs font-black">3</span>
            <h3 className="text-sm font-black text-slate-900">Key Operational Drivers</h3>
          </div>
          <p className="text-[11px] text-slate-400 font-semibold italic">What actually drove the numbers? Separate the core business performance from one-offs.</p>
          <ul className="space-y-2 text-xs text-slate-700 font-medium pl-1">
            <li className="flex items-start gap-2">
              <span className="font-extrabold text-slate-900 flex-shrink-0">• Volume vs. Realization:</span>
              <span>{drivers.volumeVsRealization || 'Online Growth Measured by Quality, Not Volume Alone'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-extrabold text-slate-900 flex-shrink-0">• Input Costs / RM Trends:</span>
              <span>{drivers.inputCostsRmTrends || 'EBITDA margin impact due to planned operational adjustments offset by efficiency'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-extrabold text-slate-900 flex-shrink-0">• Exceptional Items:</span>
              <span>{drivers.exceptionalItems || 'Performance underpinned by exceptional agility in responding to changing market dynamics'}</span>
            </li>
          </ul>
        </div>

        {/* Section 4: Management Commentary */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-indigo-600 text-white flex items-center justify-center text-xs font-black">4</span>
            <h3 className="text-sm font-black text-slate-900">Management Commentary & Concall Highlights</h3>
          </div>
          <p className="text-[11px] text-slate-400 font-semibold italic">Earnings concalls are goldmines in the Indian context.</p>
          <ul className="space-y-2 text-xs text-slate-700 font-medium pl-1">
            <li className="flex items-start gap-2">
              <span className="font-extrabold text-slate-900 flex-shrink-0">• FY Guidance:</span>
              <span>{mgmt.fyGuidance || 'Consolidated Financial Results: Q1 FY27'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-extrabold text-slate-900 flex-shrink-0">• Capex Plans:</span>
              <span>{mgmt.capexPlans || 'Strong double-digit EBITDA growth led by subscriber momentum and margin expansion (+150 bps)'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-extrabold text-slate-900 flex-shrink-0">• Macro/Sector Specifics:</span>
              <span>{mgmt.macroSectorSpecifics || 'Aim to start installation post-monsoon, with transmission capacity ready in time for the export of electricity this year.'}</span>
            </li>
          </ul>
        </div>

        {/* Section 5: Shareholding Check */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-indigo-600 text-white flex items-center justify-center text-xs font-black">5</span>
            <h3 className="text-sm font-black text-slate-900">Shareholding & Corporate Governance Check</h3>
          </div>
          <p className="text-[11px] text-slate-400 font-semibold italic">In India, tracking who is buying, selling, or pledging is highly indicative of underlying health.</p>
          <ul className="space-y-2 text-xs text-slate-700 font-medium pl-1">
            <li className="flex items-start gap-2">
              <span className="font-extrabold text-slate-900 flex-shrink-0">• Promoter Holding:</span>
              <span>{governance.promoterHolding || '65.4% (Change from last quarter: 0.0%)'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-extrabold text-slate-900 flex-shrink-0">• Promoter Pledging:</span>
              <span>{governance.promoterPledging || '0.0% of promoter shares pledged. (Warning: High or increasing pledging is a major red flag in Indian stocks).'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-extrabold text-slate-900 flex-shrink-0">• FII / DII Activity:</span>
              <span>{governance.fiiDiiActivity || 'FII holds 22.1%, DII holds 15.2%. Both institutional segments maintained or consolidated their positions this quarter.'}</span>
            </li>
          </ul>
        </div>

        {/* Section 6: Valuation & Risk Matrix */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-indigo-600 text-white flex items-center justify-center text-xs font-black">6</span>
            <h3 className="text-sm font-black text-slate-900">Valuation & Risk Matrix</h3>
          </div>
          <p className="text-[11px] text-slate-400 font-semibold italic">A great company can be a bad stock if the price is too high.</p>
          <ul className="space-y-2 text-xs text-slate-700 font-medium pl-1">
            <li className="flex items-start gap-2">
              <span className="font-extrabold text-slate-900 flex-shrink-0">• Current Valuation:</span>
              <span>{val.currentValuation || 'Trading at 80.6x TTM P/E and 52.4x EV/EBITDA.'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-extrabold text-slate-900 flex-shrink-0">• Historical Average:</span>
              <span>{val.historicalAverage || '5-Year Median P/E is 81.8x.'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-extrabold text-slate-900 flex-shrink-0">• Key Risks:</span>
              <span className="text-rose-700 font-bold">{val.keyRisks || 'Heightened risk premium with SoH disruption'}</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};

/* ==========================================
   EXTRACTED JSON INTELLIGENCE VIEW COMPONENT
   ========================================== */
const ExtractedJsonView = ({ symbol, companyName, jsonData, apiEndpoint }) => {
  return (
    <StockAiSummaryReportView 
      symbol={symbol} 
      companyName={companyName} 
      summaryData={jsonData} 
      apiEndpoint={apiEndpoint} 
    />
  );
};

class DashboardErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Dashboard error caught by boundary:", error, errorInfo);
    try {
      if (this.props.profile?.username) {
        localStorage.removeItem(`finance_threads_${this.props.profile.username}`);
      }
    } catch (e) {}
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-6 text-center">
          <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl max-w-md shadow-2xl">
            <svg className="w-12 h-12 text-amber-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-bold mb-2">Session Recovered</h3>
            <p className="text-xs text-slate-300 mb-6">A temporary cache conflict occurred. We've reset your chat session safely.</p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-lg"
            >
              Reload Dashboard
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ==========================================
   DASHBOARD VIEW (LOGGED IN SCREEN)
   ========================================== */
function DashboardView({ profile, onLogout, onNavigateReset, onNavigate }) {
  const [threads, setThreads] = useState(() => {
    try {
      const saved = localStorage.getItem(`finance_threads_${profile?.username || 'guest'}`);
      if (!saved) return [{ id: 'thread-1', title: 'First Chat', messages: [] }];
      const parsed = JSON.parse(saved);
      const cleaned = (Array.isArray(parsed) ? parsed : []).map(t => ({
        ...t,
        messages: (t.messages || []).map(m => {
          if (m && typeof m.content === 'object' && m.content !== null && !m.content.contentType && !React.isValidElement(m.content)) {
            return { ...m, content: "Extracted JSON Intelligence report fetched." };
          }
          return m;
        })
      }));
      return cleaned.length > 0 ? cleaned : [{ id: 'thread-1', title: 'First Chat', messages: [] }];
    } catch (e) {
      return [{ id: 'thread-1', title: 'First Chat', messages: [] }];
    }
  });

  const [activeThreadId, setActiveThreadId] = useState('thread-1');
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeMenuChatId, setActiveMenuChatId] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [renameChatId, setRenameChatId] = useState(null);
  const [renameChatTitle, setRenameChatTitle] = useState('');
  const [deleteChatId, setDeleteChatId] = useState(null);

  const renderMessageContent = (m) => {
    if (!m) return null;
    const content = m.content;

    if (m.contentType === 'stock_summary' || (content && content.contentType === 'stock_summary')) {
      const payload = m.contentType === 'stock_summary' ? m : content;
      return (
        <StockAiSummaryReportView 
          symbol={payload.symbol || 'RELIANCE'} 
          companyName={payload.companyName || 'Reliance Industries'} 
          summaryData={payload.summaryData} 
          apiEndpoint={payload.apiEndpoint || `GET /api/stock-summary/${payload.symbol || 'RELIANCE'}`} 
        />
      );
    }

    if (m.contentType === 'extracted_json' || (content && content.contentType === 'extracted_json')) {
      const payload = m.contentType === 'extracted_json' ? m : content;
      return (
        <ExtractedJsonView 
          symbol={payload.symbol || 'RELIANCE'} 
          companyName={payload.companyName || 'Reliance Industries'} 
          jsonData={payload.jsonData || payload.summaryData} 
          apiEndpoint={payload.apiEndpoint || `GET /api/stock-summary/${payload.symbol || 'RELIANCE'}`} 
        />
      );
    }

    if (m.contentType === 'static_mock' || (content && content.contentType === 'static_mock')) {
      const q = content?.query || m.query || '';
      return renderStaticMockUI(q);
    }

    if (React.isValidElement(content)) {
      return content;
    }

    if (typeof content === 'string') {
      return content;
    }

    if (typeof content === 'object' && content !== null) {
      if (Object.keys(content).length === 0) {
        return "Intelligence report fetched successfully.";
      }
      return (
        <pre className="text-xs font-mono bg-slate-900 text-emerald-400 p-3 rounded-xl overflow-x-auto whitespace-pre-wrap select-all">
          {JSON.stringify(content, null, 2)}
        </pre>
      );
    }

    return String(content || '');
  };
  
  const chatEndRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveMenuChatId(null);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const STOCK_SUGGESTIONS = [
    { symbol: 'RELIANCE', name: 'Reliance Industries Limited', sector: 'Conglomerate (Energy/Retail/Telecom)' },
    { symbol: 'ADANIENT', name: 'Adani Enterprises Limited', sector: 'Conglomerate / Infrastructure' },
    { symbol: 'ADANIPORTS', name: 'Adani Ports and Special Economic Zone', sector: 'Infrastructure / Shipping' },
    { symbol: 'ADANIPOWER', name: 'Adani Power Limited', sector: 'Utilities & Power' },
    { symbol: 'ADANIGREEN', name: 'Adani Green Energy Limited', sector: 'Renewable Energy' },
    { symbol: 'ADANITRANS', name: 'Adani Energy Solutions Limited', sector: 'Power Transmission' },
    { symbol: 'ATGL', name: 'Adani Total Gas Limited', sector: 'City Gas Distribution' },
    { symbol: 'AWL', name: 'Adani Wilmar Limited', sector: 'FMCG / Edible Oils' },
    { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'IT Services' },
    { symbol: 'INFY', name: 'Infosys Limited', sector: 'IT Services' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Limited', sector: 'Banking & Financials' },
    { symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking & Financials' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Limited', sector: 'Banking & Financials' },
    { symbol: 'WIPRO', name: 'Wipro Limited', sector: 'IT Services' },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel Limited', sector: 'Telecom' },
    { symbol: 'TATAMOTORS', name: 'Tata Motors Limited', sector: 'Automotive' },
    { symbol: 'TATASTEEL', name: 'Tata Steel Limited', sector: 'Metals & Mining' },
    { symbol: 'LT', name: 'Larsen & Toubro Limited', sector: 'Engineering & Construction' },
    { symbol: 'ITC', name: 'ITC Limited', sector: 'FMCG & Diversified' },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Limited', sector: 'FMCG' }
  ];

  const filteredSuggestions = inputValue.trim() 
    ? STOCK_SUGGESTIONS.filter(s => 
        s.symbol.toLowerCase().includes(inputValue.trim().toLowerCase()) || 
        s.name.toLowerCase().includes(inputValue.trim().toLowerCase()) ||
        s.sector.toLowerCase().includes(inputValue.trim().toLowerCase())
      )
    : STOCK_SUGGESTIONS.slice(0, 6);

  const handleKeyDown = (e) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev < filteredSuggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : filteredSuggestions.length - 1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0 && highlightedIndex < filteredSuggestions.length) {
      e.preventDefault();
      const selected = filteredSuggestions[highlightedIndex];
      setInputValue(selected.name);
      setShowSuggestions(false);
      setHighlightedIndex(-1);

      // Trigger message submit directly with selected suggestion text
      setTimeout(() => {
        const fakeEvent = { preventDefault: () => {} };
        handleSendMessageWithQuery(selected.name, fakeEvent);
      }, 50);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  };

  const handleSendMessageWithQuery = (queryText, e) => {
    if (e && e.preventDefault) e.preventDefault();
    const textToSend = typeof queryText === 'string' ? queryText : inputValue.trim();
    if (!textToSend && !selectedFile) return;

    const userMessageText = textToSend || (selectedFile ? `Uploaded file: ${selectedFile.name}` : '');
    // eslint-disable-next-line react-hooks/purity
    const userMsg = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: userMessageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fileAttached: selectedFile ? { name: selectedFile.name, size: (selectedFile.size / 1024).toFixed(1) + ' KB' } : null
    };

    let targetId = activeThreadId;

    setThreads(prev => {
      let current = [...prev];
      if (current.length === 0) {
        const fresh = { id: `thread-${Date.now()}`, title: 'First Chat', messages: [] };
        current = [fresh];
      }
      const exists = current.some(t => t.id === targetId);
      if (!exists) {
        targetId = current[0].id;
        setActiveThreadId(targetId);
      }

      return current.map(t => {
        if (t.id === targetId) {
          const newTitle = (t.title === 'New Chat' || t.title === 'First Chat' || !t.messages || t.messages.length === 0) 
            ? (userMessageText.substring(0, 24) + (userMessageText.length > 24 ? '...' : '')) 
            : t.title;
          return {
            ...t,
            title: newTitle,
            messages: [...(t.messages || []), userMsg]
          };
        }
        return t;
      });
    });

    setInputValue('');
    setSelectedFile(null);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    setIsGenerating(true);

    getDynamicAIResponse(userMessageText).then(responseMarkup => {
      const assistantMsg = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: responseMarkup,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setThreads(prev => {
        let current = [...prev];
        if (current.length === 0) {
          const fresh = { id: `thread-${Date.now()}`, title: 'First Chat', messages: [] };
          current = [fresh];
        }
        const exists = current.some(t => t.id === targetId);
        const finalId = exists ? targetId : current[0].id;

        return current.map(t => {
          if (t.id === finalId) {
            return {
              ...t,
              messages: [...(t.messages || []), assistantMsg]
            };
          }
          return t;
        });
      });
      setIsGenerating(false);
    }).catch(err => {
      console.error(err);
      setIsGenerating(false);
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const renderChatInput = () => {
    return (
      <div className="relative w-full">
        {/* Autocomplete Stock Suggestions Dropdown (Positioned ABOVE input for full visibility) */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute left-0 right-0 bottom-full mb-2 bg-white border border-slate-200/90 rounded-2xl shadow-2xl py-2 z-50 animate-fade-in font-sans max-h-64 overflow-y-auto">
            <div className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-400 tracking-wider flex justify-between items-center border-b border-slate-100 mb-1">
              <span>Matching Stock Suggestions ({filteredSuggestions.length})</span>
              <span className="text-[9px] text-slate-400 font-medium lowercase">Use ↑ ↓ arrows to navigate</span>
            </div>
            {filteredSuggestions.map((s, idx) => {
              const isHighlighted = idx === highlightedIndex;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setInputValue(s.name);
                    setShowSuggestions(false);
                    setHighlightedIndex(-1);
                    handleSendMessageWithQuery(s.name);
                  }}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`px-4 py-2.5 flex items-center justify-between cursor-pointer border-b border-slate-50 last:border-0 transition-all ${
                    isHighlighted ? 'bg-indigo-50/90 text-indigo-900 font-bold' : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold flex items-center gap-2">
                      <span>{s.name}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${isHighlighted ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>{s.symbol}</span>
                    </div>
                    <div className={`text-[10px] font-semibold mt-0.5 ${isHighlighted ? 'text-indigo-600' : 'text-slate-400'}`}>{s.sector}</div>
                  </div>
                  <span className={`text-xs font-bold ${isHighlighted ? 'text-indigo-600' : 'text-slate-400'}`}>Select ↵</span>
                </div>
              );
            })}
          </div>
        )}

        <form onSubmit={(e) => { setShowSuggestions(false); handleSendMessageWithQuery(inputValue, e); }} className="relative bg-[#F8F9FA] border border-slate-200/90 rounded-2xl focus-within:border-slate-400 transition-all p-1 shadow-sm flex items-center w-full">
          {/* File Attachment Upload Button */}
          <button
            type="button"
            onClick={handleFileUploadClick}
            className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-xl transition-all cursor-pointer flex-shrink-0"
            title="Upload attachment"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          
          <input
            type="text"
            placeholder="Ask anything..."
            value={inputValue}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
              setHighlightedIndex(-1);
            }}
            className="flex-grow px-2 py-3 bg-transparent text-sm text-slate-800 placeholder-slate-455 outline-none font-semibold"
          />

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputValue.trim() && !selectedFile}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/60 rounded-xl transition-all cursor-pointer disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed flex-shrink-0 ml-1"
            title="Send message"
          >
            <svg className="w-4 h-4 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9-7-9-7v14z" />
            </svg>
          </button>
        </form>
      </div>
    );
  };

  // Load threads when profile shifts
  useEffect(() => {
    if (profile?.username) {
      try {
        const saved = localStorage.getItem(`finance_threads_${profile.username}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          const cleaned = (Array.isArray(parsed) ? parsed : []).map(t => ({
            ...t,
            messages: (t.messages || []).map(m => {
              if (m && typeof m.content === 'object' && m.content !== null && !m.content.contentType && !React.isValidElement(m.content)) {
                return { ...m, content: "Extracted JSON Intelligence report fetched." };
              }
              return m;
            })
          }));
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setThreads(cleaned.length > 0 ? cleaned : [{ id: 'thread-1', title: 'First Chat', messages: [] }]);
          if (cleaned.length > 0) {
            setActiveThreadId(cleaned[0].id);
          }
        } else {
          const defaultThreads = [{ id: 'thread-1', title: 'First Chat', messages: [] }];
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setThreads(defaultThreads);
          setActiveThreadId('thread-1');
        }
      } catch {
        // ignore
      }
    }
  }, [profile]);

  // Persist threads to localStorage on changes
  useEffect(() => {
    if (profile?.username && threads.length > 0) {
      localStorage.setItem(`finance_threads_${profile.username}`, JSON.stringify(threads));
    }
  }, [threads, profile]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [threads, isGenerating]);

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0] || { id: '1', title: 'New Chat', messages: [] };
  const hasMessages = activeThread && activeThread.messages && activeThread.messages.length > 0;

  const handleStartNewThread = () => {
    const newId = `thread-${Date.now()}`;
    const newThread = {
      id: newId,
      title: 'New Chat',
      messages: []
    };
    setThreads(prev => [newThread, ...prev]);
    setActiveThreadId(newId);
    setInputValue('');
    setSelectedFile(null);
  };

  const handleDeleteThread = (id, e) => {
    if (e) e.stopPropagation();
    const updated = threads.filter(t => t.id !== id);
    if (updated.length === 0) {
      const fallback = { id: `thread-${Date.now()}`, title: 'New Chat', messages: [] };
      setThreads([fallback]);
      setActiveThreadId(fallback.id);
    } else {
      setThreads(updated);
      if (activeThreadId === id) {
        setActiveThreadId(updated[0].id);
      }
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-gray-800">
      
      {/* Sidebar Drawer Panel */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-72 bg-[#F8F9FA] border-r border-gray-200/90 transform transition-transform duration-300 flex flex-col justify-between md:relative ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:hidden'}`}>
        
        {/* Sidebar Header: Title and Close button */}
        <div className="p-4 border-b border-gray-200/60 flex items-center justify-between">
          <div onClick={() => onNavigate('/')} className="flex items-center gap-2 select-none cursor-pointer">
            <svg className="w-5 h-5 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 16l4-4 4 4 6-6" />
            </svg>
            <span className="text-base font-bold tracking-tight text-slate-800">Stock Analysis AI</span>
          </div>
          
          {/* Close Sidebar Button */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 hover:bg-slate-200/55 rounded-lg text-slate-500 cursor-pointer"
            title="Close sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Start Chat Button */}
        <div className="px-4 pt-4">
          <button
            onClick={handleStartNewThread}
            className="w-full py-3.5 px-4 bg-white border border-gray-200/80 hover:border-slate-300/80 text-gray-700 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all hover:bg-slate-50 cursor-pointer active:scale-98 text-sm"
          >
            <svg className="w-4.5 h-4.5 text-slate-855" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </button>
        </div>

        {/* Navigation Section */}
        <div className="px-4 pt-3 space-y-1.5 select-none">
          <button
            onClick={() => onNavigate('/dashboard')}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white border border-gray-200/80 hover:border-slate-300/80 text-slate-600 hover:text-slate-900 transition-all text-xs cursor-pointer hover:bg-slate-50"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF Analyser
          </button>
        </div>

        {/* Thread History list */}
        <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
          <div className="px-3 mb-2 flex items-center gap-1.5 select-none">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <span className="text-xs font-bold text-slate-500 font-sans">Recents</span>
          </div>
          {threads.map(t => {
            const isActive = t.id === activeThreadId;
            return (
              <div
                key={t.id}
                onClick={() => {
                  setActiveThreadId(t.id);
                  // On mobile, auto-close sidebar on thread selection
                  if (window.innerWidth < 768) {
                    setIsSidebarOpen(false);
                  }
                }}
                className={`group relative flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-all select-none text-xs font-bold font-sans ${isActive ? 'bg-slate-200/60 text-slate-800' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
              >
                <div className="flex items-center gap-2.5 truncate w-[calc(100%-24px)]">
                  <svg className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-slate-700' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <span className="truncate pr-2">{t.title}</span>
                </div>
                
                {/* 3 dots vertical menu */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuChatId(activeMenuChatId === t.id ? null : t.id);
                    }}
                    className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-700 transition-all cursor-pointer group-hover:opacity-100 md:opacity-0 focus:opacity-100 flex items-center justify-center"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                  </button>

                  {activeMenuChatId === t.id && (
                    <div className="absolute right-0 mt-1 w-24 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50 text-xs text-left animate-fade-in">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuChatId(null);
                          setRenameChatId(t.id);
                          setRenameChatTitle(t.title);
                        }}
                        className="w-full px-3 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold block cursor-pointer"
                      >
                        Rename
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuChatId(null);
                          setDeleteChatId(t.id);
                        }}
                        className="w-full px-3 py-2 hover:bg-slate-50 text-red-600 hover:text-red-700 font-semibold block cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer: Profile Widget */}
        <div className="p-4 border-t border-gray-200/60 bg-[#F1F3F5]/40 select-none">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8.5 h-8.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200/60 flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm">
                {profile?.username?.substring(0, 2).toUpperCase() || 'US'}
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-gray-800 truncate">{profile?.full_name || 'User'}</span>
                <span className="block text-[10px] text-gray-400 font-semibold truncate">@{profile?.username}</span>
              </div>
            </div>
            
            <button
              onClick={() => setShowLogoutModal(true)}
              title="Log Out"
              className="p-1.5 hover:bg-slate-200/60 hover:text-slate-800 rounded-lg text-slate-400 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-grow flex flex-col h-screen overflow-hidden bg-white relative">
        
        {/* Open Sidebar Button for Desktop (floating if sidebar is closed & no messages) */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            title="Open sidebar"
            className="hidden md:flex absolute top-4 left-4 p-2 bg-white border border-gray-200 rounded-xl hover:bg-slate-50 text-slate-600 shadow-sm cursor-pointer z-20 items-center justify-center transition-all animate-fade-in"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
        )}

        {/* Header Bar for Mobile / Desktop when Sidebar is hidden */}
        <header className="flex md:hidden items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-1 text-slate-600 cursor-pointer"
            title="Open Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center gap-1.5 select-none">
            <svg className="w-4.5 h-4.5 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 16l4-4 4 4 6-6" />
            </svg>
            <span className="text-sm font-bold text-slate-800">Stock Analysis AI</span>
          </div>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-1 text-slate-600 cursor-pointer"
            title="Settings"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </header>

        {/* Workspace Chat Area */}
        <div className="flex-1 flex flex-col justify-between overflow-hidden relative">
          
          {/* Top-Right Settings trigger for Desktop */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="hidden md:flex absolute top-4 right-4 p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 transition-all cursor-pointer z-10 items-center justify-center shadow-sm active:scale-98"
            title="Account Settings"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {hasMessages ? (
            /* Chat message stream view */
            <div className="flex-1 overflow-y-auto px-4 md:px-12 py-8 space-y-6 bg-white">
              <div className="max-w-3xl mx-auto space-y-6">
                {activeThread.messages.map((m) => {
                  const isUser = m.role === 'user';
                  return (
                    <div
                      key={m.id}
                      className={`flex gap-3 md:gap-4 max-w-3xl mx-auto ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    >
                      {!isUser && (
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 border border-slate-200">
                          <svg className="w-4 h-4 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 16l4-4 4 4 6-6" />
                          </svg>
                        </div>
                      )}

                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser ? 'bg-slate-100 text-slate-800' : 'bg-white border border-slate-100 text-gray-800 shadow-sm'}`}>
                        {m.fileAttached && (
                          <div className="mb-2 p-2 bg-slate-200/50 rounded-lg flex items-center gap-2 text-xs text-slate-700 select-none">
                            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 11-2.828-2.828l6.414-6.414a4 4 0 015.656 5.656l-6.415 6.415a6 6 0 11-8.486-8.486L10.5 10" />
                            </svg>
                            <span className="font-semibold truncate">{m.fileAttached.name}</span>
                            <span className="text-[10px] text-gray-400 font-bold">({m.fileAttached.size})</span>
                          </div>
                        )}
                        <div className="font-medium font-sans">{renderMessageContent(m)}</div>
                        <span className="block text-[9px] text-slate-400 mt-1.5 text-right font-bold select-none">{m.timestamp}</span>
                      </div>

                      {isUser && (
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-800 border border-slate-200/60 flex items-center justify-center flex-shrink-0 text-[11px] font-black shadow-sm">
                          {profile?.username?.substring(0, 2).toUpperCase() || 'US'}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* AI Assistant stream bubble indicator */}
                {isGenerating && (
                  <div className="flex gap-3 md:gap-4 max-w-3xl mx-auto justify-start animate-fade-in">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 border border-slate-200">
                      <svg className="w-4 h-4 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 16l4-4 4 4 6-6" />
                      </svg>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-2xl px-4 py-3 flex items-center gap-1 shadow-sm">
                      <span className="w-2.5 h-2.5 bg-slate-800 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2.5 h-2.5 bg-slate-800 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2.5 h-2.5 bg-slate-800 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>
          ) : (
            /* Welcome / Empty chat state screen */
            <div className="flex-grow flex flex-col justify-center items-center px-4 md:px-12 py-10 overflow-y-auto bg-white">
              <div className="w-full max-w-2xl text-center -mt-8 animate-fade-in flex flex-col items-center">
                <h2 className="text-lg md:text-xl font-medium tracking-tight text-slate-400/90 leading-tight mb-6 select-none">
                  Ask question related to Money, Stocks & Markets
                </h2>
                
                <div className="w-full max-w-xl relative">
                  {renderChatInput()}

                  {/* Uploaded File Pill Indicator (for centered view) */}
                  {selectedFile && (
                    <div className="absolute -top-10 left-2 p-1.5 px-3 bg-slate-100 border border-slate-200 rounded-xl flex items-center gap-2 text-xs text-slate-700 shadow-sm select-none animate-fade-in">
                      <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 11-2.828-2.828l6.414-6.414a4 4 0 015.656 5.656l-6.415 6.415a6 6 0 11-8.486-8.486L10.5 10" />
                      </svg>
                      <span className="max-w-[150px] truncate font-semibold">{selectedFile.name}</span>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="p-0.5 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
                        title="Remove file"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Chat text input and settings modals wrapper (only rendered at the bottom when hasMessages is true) */}
          {hasMessages && (
            <div className="p-4 md:p-8 bg-gradient-to-t from-white via-white to-transparent">
              <div className="max-w-3xl mx-auto relative">
                {renderChatInput()}

                {/* Uploaded File Pill Indicator (for bottom view) */}
                {selectedFile && (
                  <div className="absolute -top-10 left-2 p-1.5 px-3 bg-slate-100 border border-slate-200 rounded-xl flex items-center gap-2 text-xs text-slate-700 shadow-sm select-none animate-fade-in">
                    <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 11-2.828-2.828l6.414-6.414a4 4 0 015.656 5.656l-6.415 6.415a6 6 0 11-8.486-8.486L10.5 10" />
                    </svg>
                    <span className="max-w-[150px] truncate font-semibold">{selectedFile.name}</span>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="p-0.5 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
                      title="Remove file"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Profile Settings Modal Overlay */}
        {isSettingsOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 space-y-6 relative animate-scale-up">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-black text-slate-800">Account Profile</h3>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  title="Close Settings"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Profile Details List */}
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-800 border border-slate-200/60 flex items-center justify-center font-bold text-lg shadow-sm">
                    {profile?.username?.substring(0, 2).toUpperCase() || 'US'}
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-400 uppercase">Username</span>
                    <span className="text-sm font-extrabold text-slate-800">@{profile?.username || 'user'}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="block text-xs font-bold text-gray-400 uppercase">Full Name</span>
                  <div className="block w-full px-4 py-3 bg-slate-50 border border-slate-150 rounded-xl text-slate-800 font-semibold text-sm">
                    {profile?.full_name || 'N/A'}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setIsSettingsOpen(false);
                      onNavigateReset();
                    }}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-bold rounded-xl transition-all cursor-pointer text-sm"
                  >
                    Change Password
                  </button>
                  <button
                    onClick={() => {
                      setIsSettingsOpen(false);
                      setShowLogoutModal(true);
                    }}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200/85 text-slate-800 font-bold rounded-xl transition-all cursor-pointer text-sm"
                  >
                    Log Out
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Custom Tailwind CSS Logout Confirmation Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-sm w-full p-6 space-y-6 relative animate-scale-up">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-bold text-slate-800">Confirm Logout</h3>
                <p className="text-sm text-slate-500 font-semibold leading-relaxed">
                  Are you sure you want to log out of your account?
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-bold rounded-xl transition-all cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowLogoutModal(false);
                    onLogout();
                  }}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200/85 text-slate-800 font-bold rounded-xl transition-all cursor-pointer text-sm"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Custom Tailwind CSS Rename Chat Modal */}
        {renameChatId && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-sm w-full p-6 space-y-6 relative animate-scale-up">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-bold text-slate-800">Rename Chat</h3>
                <p className="text-sm text-slate-500 font-semibold leading-relaxed">
                  Enter a new title for this chat analysis:
                </p>
              </div>
              <div>
                <input
                  type="text"
                  value={renameChatTitle}
                  onChange={(e) => setRenameChatTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-slate-800 text-sm bg-white font-semibold text-slate-700"
                  placeholder="Chat title"
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setRenameChatId(null);
                    setRenameChatTitle('');
                  }}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-bold rounded-xl transition-all cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (renameChatTitle.trim()) {
                      setThreads(prev => prev.map(item => item.id === renameChatId ? { ...item, title: renameChatTitle.trim() } : item));
                    }
                    setRenameChatId(null);
                    setRenameChatTitle('');
                  }}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200/85 text-slate-800 font-bold rounded-xl transition-all cursor-pointer text-sm"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Custom Tailwind CSS Delete Chat Modal */}
        {deleteChatId && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-sm w-full p-6 space-y-6 relative animate-scale-up">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-bold text-slate-800">Delete Chat</h3>
                <p className="text-sm text-slate-500 font-semibold leading-relaxed">
                  Are you sure you want to delete this chat analysis? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteChatId(null)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-bold rounded-xl transition-all cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={(e) => {
                    handleDeleteThread(deleteChatId, e);
                    setDeleteChatId(null);
                  }}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200/85 text-slate-800 font-bold rounded-xl transition-all cursor-pointer text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* ==========================================
   PASSWORD INPUT WITH EYE ICON
   ========================================== */
function PasswordInput({ placeholder, value, onChange, disabled, required, className = "border-[#d9d9e3]" }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-3.5 rounded-xl border text-base outline-none focus:border-slate-800 transition-all bg-white font-normal pr-12 ${className}`}
        required={required}
      />
      <button
        type="button"
        tabIndex="-1"
        onClick={() => setShow(!show)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-655 focus:outline-none cursor-pointer"
      >
        {show ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )}
      </button>
    </div>
  );
}

/* ==========================================
   LOGIN VIEW
   ========================================== */
function LoginView({ onLogin, onNavigateRegister, onNavigateReset, loading }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    onLogin(username, password);
  };

  return (
    <div className="w-full text-center animate-fade-in">
      <h1 className="text-[28px] font-bold tracking-tight text-slate-800 mb-6 font-sans">
        Log in or sign up
      </h1>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="space-y-3 text-left">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3.5 rounded-xl border border-[#d9d9e3] text-base placeholder-[#8e8ea0] outline-none focus:border-slate-800 transition-all bg-white font-normal text-slate-700"
            required
          />
          <PasswordInput
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 text-base disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed border border-slate-200/60"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-slate-800 border-t-transparent rounded-full animate-spin"></span>
          ) : 'Log In'}
        </button>
      </form>

      <div className="mt-8 space-y-3 text-sm select-none font-semibold text-slate-655">
        <p>
          Don't have an account?{' '}
          <button
            onClick={onNavigateRegister}
            className="text-slate-800 hover:underline font-bold cursor-pointer"
          >
            Sign Up
          </button>
        </p>
        <p>
          Forgot password?{' '}
          <button
            onClick={onNavigateReset}
            className="text-slate-800 hover:underline font-bold cursor-pointer"
          >
            Reset Password
          </button>
        </p>
      </div>
    </div>
  );
}

/* ==========================================
   REGISTER VIEW
   ========================================== */
function RegisterView({ onRegister, onNavigateLogin, loading }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim() || !fullName.trim()) return;
    onRegister({
      username: username.trim(),
      password: password.trim(),
      full_name: fullName.trim()
    });
  };

  return (
    <div className="w-full text-center animate-fade-in">
      <h1 className="text-[28px] font-bold tracking-tight text-slate-800 mb-6 font-sans">
        Create an account
      </h1>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="space-y-3 text-left">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3.5 rounded-xl border border-[#d9d9e3] text-base placeholder-[#8e8ea0] outline-none focus:border-slate-800 transition-all bg-white font-normal text-slate-700"
            required
          />
          <PasswordInput
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3.5 rounded-xl border border-[#d9d9e3] text-base placeholder-[#8e8ea0] outline-none focus:border-slate-800 transition-all bg-white font-normal text-slate-700"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 text-base disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed border border-slate-200/60"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-slate-800 border-t-transparent rounded-full animate-spin"></span>
          ) : 'Sign Up'}
        </button>
      </form>

      <div className="mt-8 text-sm select-none font-semibold text-slate-655">
        <p>
          Already have an account?{' '}
          <button
            onClick={onNavigateLogin}
            className="text-slate-800 hover:underline font-bold cursor-pointer"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
}

/* ==========================================
   RESET PASSWORD VIEW
   ========================================== */
function ResetPasswordView({ onReset, onNavigateLogin, currentUser, loading }) {
  const [username, setUsername] = useState(currentUser || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !oldPassword.trim() || !newPassword.trim()) return;
    onReset(username.trim(), oldPassword.trim(), newPassword.trim());
  };

  return (
    <div className="w-full text-center animate-fade-in">
      <h1 className="text-[28px] font-bold tracking-tight text-slate-800 mb-6 font-sans">
        Reset password
      </h1>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="space-y-3 text-left">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3.5 rounded-xl border border-[#d9d9e3] text-base placeholder-[#8e8ea0] outline-none focus:border-slate-800 transition-all bg-white font-normal text-slate-700"
            required
          />
          <PasswordInput
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            disabled={loading}
            required
          />
          <PasswordInput
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 text-base disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed border border-slate-200/60"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-slate-800 border-t-transparent rounded-full animate-spin"></span>
          ) : 'Reset Password'}
        </button>
      </form>

      <div className="mt-8 text-sm select-none font-semibold text-slate-655">
        <button
          onClick={onNavigateLogin}
          className="text-slate-700 hover:text-slate-900 underline cursor-pointer"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

/* ==========================================
   MAIN APP ROUTER-FREE COMPONENT
   ========================================== */
export default function App() {
  const [view, setView] = useState('profile');

  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('finance_user');
      if (saved) return JSON.parse(saved);
      const defaultUser = { username: 'sam' };
      localStorage.setItem('finance_user', JSON.stringify(defaultUser));
      return defaultUser;
    } catch {
      return { username: 'sam' };
    }
  });

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('finance_profile');
      if (saved) return JSON.parse(saved);
      const defaultProf = { username: 'sam', full_name: 'Sam Weiner', bio: 'Senior Market Analyst' };
      localStorage.setItem('finance_profile', JSON.stringify(defaultProf));
      return defaultProf;
    } catch {
      return { username: 'sam', full_name: 'Sam Weiner', bio: 'Senior Market Analyst' };
    }
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Custom Toast notification handler
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch Profile details
  const fetchProfile = async (username) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/profile/${username}`);
      if (res.data && res.data.data) {
        setProfile(res.data.data);
        localStorage.setItem('finance_profile', JSON.stringify(res.data.data));
      }
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed to fetch profile details', 'error');
    }
  };

  // Login handler
  const handleLogin = async (username, password) => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/login`, { username, password });
      const userData = { username };
      setUser(userData);
      localStorage.setItem('finance_user', JSON.stringify(userData));
      showToast('Successfully logged in!', 'success');
      await fetchProfile(username);
      setView('profile');
    } catch (err) {
      showToast(err.response?.data?.message || err.response?.data?.detail || 'Login failed. Please check credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const handleRegister = async (formData) => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/register`, formData);
      showToast('Registration successful! Please log in.', 'success');
      setView('login');
    } catch (err) {
      showToast(err.response?.data?.message || err.response?.data?.detail || 'Registration failed. Username may exist.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Reset Password handler
  const handleResetPassword = async (username, oldPassword, newPassword) => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/reset-password`, {
        username,
        old_password: oldPassword,
        new_password: newPassword
      });
      showToast('Password updated successfully. Please login again.', 'success');
      setUser(null);
      setProfile(null);
      localStorage.removeItem('finance_user');
      localStorage.removeItem('finance_profile');
      setView('login');
    } catch (err) {
      showToast(err.response?.data?.message || err.response?.data?.detail || 'Failed to reset password. Incorrect details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/logout`);
    } catch {
      // ignore
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem('finance_user');
    localStorage.removeItem('finance_profile');
    setView('login');
    showToast('Logged out successfully.', 'success');
  };

  useEffect(() => {
    if (user?.username) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchProfile(user.username);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dynamically update document title based on current view state
  useEffect(() => {
    if (view === 'profile') {
      document.title = 'Stock Analysis AI';
    } else {
      document.title = 'Log in or Sign up';
    }
  }, [view]);

  // Auth Guard redirects - Default to main workspace
  useEffect(() => {
    if (view !== 'profile' && !view) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setView('profile');
    }
  }, [view]);

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#0d0d0d] flex flex-col font-sans relative">
      {/* Floating Alert Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-fade-in">
          <div className={`px-5 py-3.5 rounded-2xl border text-sm font-medium shadow-lg backdrop-blur-md transition-all flex items-center gap-3 ${
            toast.type === 'success'
              ? 'bg-[#f4fbf7] border-[#d1f2e1] text-[#0f522f]'
              : 'bg-[#fdf3f3] border-[#fcd3d3] text-[#711c1c]'
          }`}>
            <span className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-[#10b981]' : 'bg-[#ef4444]'}`} />
            {toast.message}
          </div>
        </div>
      )}

      {currentPath === '/dashboard' ? (
        <MarketDashboard
          onNavigate={navigateTo}
          profile={profile}
          onLogout={handleLogout}
          onNavigateReset={() => { setView('reset-password'); navigateTo('/'); }}
        />
      ) : view === 'login' ? (
        <main className="flex-grow flex items-center justify-center px-4 py-20 relative z-10 bg-slate-50 min-h-screen">
          <div className="w-full max-w-[440px] flex flex-col items-center bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative z-10">
            <LoginView
              onLogin={handleLogin}
              onNavigateRegister={() => setView('register')}
              onNavigateReset={() => setView('reset-password')}
              loading={loading}
            />
          </div>
        </main>
      ) : view === 'register' ? (
        <main className="flex-grow flex items-center justify-center px-4 py-20 relative z-10 bg-slate-50 min-h-screen">
          <div className="w-full max-w-[440px] flex flex-col items-center bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative z-10">
            <RegisterView
              onRegister={handleRegister}
              onNavigateLogin={() => setView('login')}
              loading={loading}
            />
          </div>
        </main>
      ) : view === 'reset-password' ? (
        <main className="flex-grow flex items-center justify-center px-4 py-20 relative z-10 bg-slate-50 min-h-screen">
          <div className="w-full max-w-[440px] flex flex-col items-center bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative z-10">
            <ResetPasswordView
              onReset={handleResetPassword}
              onNavigateLogin={() => setView('login')}
              currentUser={user?.username || ''}
              loading={loading}
            />
          </div>
        </main>
      ) : (
        <DashboardErrorBoundary profile={profile}>
          <DashboardView
            profile={profile || { username: 'sam', full_name: 'Sam Weiner' }}
            onLogout={handleLogout}
            onNavigateReset={() => setView('reset-password')}
            onNavigate={navigateTo}
          />
        </DashboardErrorBoundary>
      )}
    </div>
  );
}