<<<<<<< HEAD
import { useState, useEffect } from 'react';
=======
import React, { useState, useEffect, useRef } from 'react';
>>>>>>> 4c49318b513d468b65dee158253324dab8b458d1
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const getDownloadProxyUrl = (originalUrl) => {
  if (!originalUrl) return "";

  // Extract and decode the filename
  let filename = "";
  try {
    filename = decodeURIComponent(originalUrl.split('?')[0].split('/').pop());
  } catch {
    filename = originalUrl.split('?')[0].split('/').pop();
  }

  if (!filename) {
    filename = "presentation.pdf";
  }

  // Sanitize: replace spaces with underscores, and keep only safe chars
  const cleanFilename = filename
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9._-]/g, '');

  return `${API_BASE_URL}/api/download-file/${encodeURIComponent(cleanFilename)}?url=${encodeURIComponent(originalUrl)}`;
};

const renderMarkdown = (md) => {
  if (!md) return null;

  const lines = md.split('\n');
  const elements = [];
  let currentList = [];
  let tableRows = [];
  let inTable = false;

  const flushList = (key) => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${key}`} className="list-disc pl-5 space-y-2 mb-4">
          {currentList}
        </ul>
      );
      currentList = [];
    }
  };

  const flushTable = (key) => {
    if (tableRows.length > 0) {
      const headers = tableRows[0];
      const body = tableRows.slice(1).filter(row => {
        const firstCell = row[0]?.trim() || '';
        return firstCell.replace(/[:-]/g, '') !== '';
      });

      elements.push(
        <div key={`table-${key}`} className="overflow-x-auto my-4 rounded-xl border border-slate-200 shadow-sm bg-white">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-100 text-slate-800 border-b border-slate-200 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="px-4 py-3 text-left border-b border-slate-250 font-bold uppercase">{h.trim()}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 font-semibold text-slate-700">
              {body.map((row, rIdx) => (
                <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50 hover:bg-slate-100'}>
                  {row.map((cell, cIdx) => {
                    return (
                      <td key={cIdx} className={`px-4 py-3 border-b border-slate-100 ${cIdx === 0 ? 'font-bold text-slate-800' : ''}`}>
                        {parseInlineStyles(cell.trim())}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  const parseInlineStyles = (text) => {
    if (!text) return '';
    const parts = text.split('**');
    return parts.map((part, idx) => {
      if (idx % 2 === 1) {
        return <strong key={idx} className="text-slate-900 font-black">{part}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={idx} className="text-indigo-650 italic font-semibold">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith('|')) {
      inTable = true;
      const cells = line.split('|').slice(1, -1);
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      flushTable(i);
    }

    if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
      const content = line.trim().substring(2);
      currentList.push(
        <li key={currentList.length} className="text-xs text-slate-700 leading-relaxed">
          {parseInlineStyles(content)}
        </li>
      );
      continue;
    } else {
      flushList(i);
    }

    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={i} className="text-lg font-black text-slate-900 border-b border-slate-200 pb-2 mb-4 mt-6">
          {line.substring(2)}
        </h1>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-sm font-extrabold text-slate-800 border-l-4 border-indigo-500 pl-3.5 py-0.5 mb-3 mt-5">
          {line.substring(3)}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-xs font-bold text-slate-800 mb-2 mt-4">
          {line.substring(4)}
        </h3>
      );
    } else if (line.startsWith('---')) {
      elements.push(<hr key={i} className="my-6 border-t border-slate-200" />);
    } else if (line.trim() === '') {
      continue;
    } else {
      elements.push(
        <p key={i} className="text-xs text-slate-600 leading-relaxed mb-3">
          {parseInlineStyles(line)}
        </p>
      );
    }
  }

  flushList(lines.length);
  flushTable(lines.length);

  return <div className="markdown-report space-y-4">{elements}</div>;
};


export default function MarketDashboard({ onNavigate, profile, onLogout, onNavigateReset }) {

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeView, setActiveView] = useState(() => {
    return localStorage.getItem('market_dashboard_active_view') || 'pdf';
  });
  const [stocks, setStocks] = useState([]);
  const [loadingStocks, setLoadingStocks] = useState(false);

  // Stock Search / Results API states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [selectedPdfSummary, setSelectedPdfSummary] = useState(null);
  const [summaryError, setSummaryError] = useState(null);
  const [uploadModalTarget, setUploadModalTarget] = useState(null); // { concall, pptUrl }
  const [dragActive, setDragActive] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [jsonSearchQuery, setJsonSearchQuery] = useState('');
  const [jsonViewMode, setJsonViewMode] = useState('grid'); // 'grid' or 'raw'
  const [isConcallsModalOpen, setIsConcallsModalOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dashboardSearchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dashboardSearchRef.current && !dashboardSearchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const POPULAR_STOCKS = [
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.' },
    { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.' },
    { symbol: 'INFY', name: 'Infosys Ltd.' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.' },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.' },
    { symbol: 'ITC', name: 'ITC Ltd.' },
    { symbol: 'SBIN', name: 'State Bank of India' },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.' },
    { symbol: 'LTIM', name: 'LTIMindtree Ltd.' },
    { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd.' },
    { symbol: 'LT', name: 'Larsen & Toubro Ltd.' },
    { symbol: 'AXISBANK', name: 'Axis Bank Ltd.' },
    { symbol: 'WIPRO', name: 'Wipro Ltd.' },
    { symbol: 'HCLTECH', name: 'HCL Technologies Ltd.' },
    { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd.' },
    { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd.' },
    { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries Ltd.' },
    { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd.' },
    { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.' },
    { symbol: 'TATASTEEL', name: 'Tata Steel Ltd.' },
    { symbol: 'NTPC', name: 'NTPC Ltd.' },
    { symbol: 'POWERGRID', name: 'Power Grid Corporation of India' },
    { symbol: 'TITAN', name: 'Titan Company Ltd.' },
    { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Ltd.' },
    { symbol: 'ADANIENT', name: 'Adani Enterprises Ltd.' },
    { symbol: 'ADANIPORTS', name: 'Adani Ports and Special Economic Zone' },
    { symbol: 'COALINDIA', name: 'Coal India Ltd.' },
    { symbol: 'NESTLEIND', name: 'Nestle India Ltd.' },
    { symbol: 'GRASIM', name: 'Grasim Industries Ltd.' },
    { symbol: 'TECHM', name: 'Tech Mahindra Ltd.' },
    { symbol: 'CIPLA', name: 'Cipla Ltd.' },
    { symbol: 'DRREDDY', name: 'Dr. Reddy\'s Laboratories Ltd.' },
    { symbol: 'EICHERMOT', name: 'Eicher Motors Ltd.' },
    { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp Ltd.' },
    { symbol: 'HDFCLIFE', name: 'HDFC Life Insurance Co. Ltd.' },
    { symbol: 'SBILIFE', name: 'SBI Life Insurance Co. Ltd.' },
    { symbol: 'DIVISLAB', name: 'Divi\'s Laboratories Ltd.' },
    { symbol: 'HINDALCO', name: 'Hindalco Industries Ltd.' },
    { symbol: 'JSWSTEEL', name: 'JSW Steel Ltd.' },
    { symbol: 'BPCL', name: 'Bharat Petroleum Corp. Ltd.' },
    { symbol: 'M&M', name: 'Mahindra & Mahindra Ltd.' },
    { symbol: 'BRITANNIA', name: 'Britannia Industries Ltd.' },
    { symbol: 'BEL', name: 'Bharat Electronics Ltd.' },
    { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv Ltd.' }
  ];

  const allStockPool = [...stocks, ...POPULAR_STOCKS].reduce((acc, current) => {
    const x = acc.find(item => item.symbol.toUpperCase() === current.symbol.toUpperCase());
    if (!x) return acc.concat([current]);
    return acc;
  }, []);

  const suggestions = searchQuery.trim().length > 0
    ? allStockPool.filter(s =>
      s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.name && s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    ).slice(0, 7)
    : [];

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        e.preventDefault();
        const selected = suggestions[selectedIndex];
        setSearchQuery(selected.symbol);
        setShowSuggestions(false);
        setSelectedIndex(-1);
        handleStockSelect(selected.symbol);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };






  const handleFileUpload = async (file) => {
    if (!file) return;
    setSummaryLoading(true);
    setSummaryError(null);
    setSelectedPdfSummary({ loading: true });
    setUploadModalTarget(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axios.post(`${API_BASE_URL}/api/summarize-uploaded-pdf`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const summaryPayload = res.data.data;
      setSelectedPdfSummary(summaryPayload);

      // Auto Save to PostgreSQL Database
      try {
        await axios.post(`${API_BASE_URL}/api/save-concall-summary`, {
          symbol: searchResult?.symbol || 'STOCK',
          concall_period: uploadModalTarget?.concall?.date || 'Q1 FY27',
          ppt_url: uploadModalTarget?.pptUrl || '',
          summary_data: summaryPayload
        });
      } catch (saveErr) {
        console.warn("Auto save to DB after upload failed:", saveErr);
      }
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'Could not extract text. The PDF may be image-based or scanned.';
      setSelectedPdfSummary({ loading: false, error: true, title: 'Summary Unavailable', sections: [], key_numbers: [], errorMessage: errMsg });
      setSummaryError(errMsg);
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleDirectSummarize = async (concall) => {
    if (!concall || !concall.ppt) return;
    setIsConcallsModalOpen(false);
    setSummaryLoading(true);
    setSummaryError(null);

    setSelectedPdfSummary({
      loading: true,
      title: `${searchResult?.company_name || concall.date} - Earnings Analysis`,
      source: 'uploaded_file',
      filename: `Presentation (${concall.date})`
    });
    setUploadModalTarget(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/api/summarize-ppt?url=${encodeURIComponent(concall.ppt)}&symbol=${encodeURIComponent(searchResult?.symbol || '')}`);
      if (response.data && response.data.data) {
        const summaryPayload = response.data.data;
        setSelectedPdfSummary(summaryPayload);

        // Auto Save to PostgreSQL Database across all 7 tables
        try {
          await axios.post(`${API_BASE_URL}/api/save-concall-summary`, {
            symbol: searchResult?.symbol || 'STOCK',
            concall_period: concall.date,
            ppt_url: concall.ppt,
            summary_data: summaryPayload
          });
          if (concall.ppt || concall.date) {
            const key = concall.ppt || concall.date;
            setSavedDbStates(prev => ({ ...prev, [key]: 'saved' }));
          }
        } catch (saveErr) {
          console.warn("Auto save to DB after summarize-ppt failed:", saveErr);
        }
      } else {
        throw new Error('Invalid response structure from backend');
      }
    } catch (err) {
      console.error('Direct PPT summarization failed:', err);
      const errMsg = err.response?.data?.detail || 'Automated URL fetch failed. You can download and upload the file manually.';
      setUploadModalTarget({ concall, pptUrl: concall.ppt, autoError: errMsg });
      setSelectedPdfSummary(null);
    } finally {
      setSummaryLoading(false);
    }
  };

  const [savedDbStates, setSavedDbStates] = useState({});

  const handleSaveToDb = async (concall) => {
    if (!concall) return;
    const key = concall.ppt || concall.date;
    setSavedDbStates(prev => ({ ...prev, [key]: 'saving' }));
    try {
      let summaryData = selectedPdfSummary;
      if (!summaryData && concall.ppt) {
        try {
          const res = await axios.get(`${API_BASE_URL}/api/summarize-ppt?url=${encodeURIComponent(concall.ppt)}&symbol=${encodeURIComponent(searchResult?.symbol || '')}`);
          summaryData = res.data?.data;
        } catch (e) {
          console.warn("Direct summarize fetch failed during save, proceeding with payload:", e);
        }
      }

      const payload = {
        symbol: searchResult?.symbol || 'STOCK',
        concall_period: concall.date,
        ppt_url: concall.ppt || '',
        summary_data: summaryData || { period: concall.date, symbol: searchResult?.symbol, companyName: searchResult?.company_name }
      };

      await axios.post(`${API_BASE_URL}/api/save-concall-summary`, payload);
      setSavedDbStates(prev => ({ ...prev, [key]: 'saved' }));
    } catch (err) {
      console.error("Save to DB failed:", err);
      setSavedDbStates(prev => ({ ...prev, [key]: 'error' }));
    }
  };


  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await handleFileUpload(file);
    }
  };

  const handleDownloadExtractedPdf = async () => {

    if (!selectedPdfSummary) return;
    try {
      const res = await axios.post(`${API_BASE_URL}/api/export-summary-pdf`, {
        title: selectedPdfSummary.title || 'Extracted_Earnings_Analysis_Report',
        markdown_report: selectedPdfSummary.markdown_report || '',
        key_value_pairs: selectedPdfSummary.key_value_pairs || {},
        filename: selectedPdfSummary.filename || 'Extracted_Report'
      }, {
        responseType: 'blob'
      });

      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const rawName = selectedPdfSummary.filename || selectedPdfSummary.title || 'Extracted_Report';
      const cleanBaseName = rawName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
      link.setAttribute('download', `${cleanBaseName}_Extracted.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF Export failed:', err);
    }
  };

  const handleDownloadExtractedJson = () => {
    if (!selectedPdfSummary) return;
    const title = selectedPdfSummary.title || 'Extracted_Data';
    const jsonData = {
      title: selectedPdfSummary.title,
      filename: selectedPdfSummary.filename,
      key_numbers: selectedPdfSummary.key_numbers,
      key_value_pairs: selectedPdfSummary.key_value_pairs,
      pymupdf_json_data: selectedPdfSummary.pymupdf_json_data,
      sections: selectedPdfSummary.sections,
      markdown_report: selectedPdfSummary.markdown_report
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsonData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}_PyMuPDF.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadCompletePackage = async () => {
    if (!selectedPdfSummary) return;
    await handleDownloadExtractedPdf();
    setTimeout(() => {
      handleDownloadExtractedJson();
    }, 400);
  };

  const handleSearch = async (e) => {


    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    setSearchError(null);

    const queryStr = searchQuery.trim();
    const isUrl = queryStr.startsWith('http://') || queryStr.startsWith('https://') || queryStr.includes('.xml');

    try {
      if (isUrl) {
        const activeSymbol = searchResult?.symbol || '';
        const response = await axios.get(`${API_BASE_URL}/api/parse-xbrl?url=${encodeURIComponent(queryStr)}&symbol=${encodeURIComponent(activeSymbol)}`);
        const data = response.data.data;

        // Convert raw Rupees from XBRL into Lakhs for standard rendering
        const toLakhs = (valStr) => {
          if (!valStr) return 0;
          const val = parseFloat(valStr);
          return isNaN(val) ? 0 : val / 100000;
        };

        const q = data.financials.quarterly || {};
        const c = data.financials.cumulative || {};

        const resCmpData = [];
        if (q.total_income || q.revenue) {
          resCmpData.push({
            re_from_dt: data.period.start,
            re_to_dt: data.period.end,
            re_total_inc: toLakhs(q.total_income || q.revenue),
            re_net_profit: toLakhs(q.net_profit),
            re_basic_eps_for_cont_dic_opr: q.basic_eps || '0',
            re_dilut_eps_for_cont_dic_opr: q.diluted_eps || '0',
            re_tax: toLakhs(q.tax),
            re_face_val: q.face_value || '10',
            re_res_type: data.nature_of_report === 'Standalone' ? 'A' : 'C',
            re_create_dt: '—'
          });
        }

        if (c.total_income || c.revenue) {
          resCmpData.push({
            re_from_dt: 'YTD Start',
            re_to_dt: data.period.end,
            re_total_inc: toLakhs(c.total_income || c.revenue),
            re_net_profit: toLakhs(c.net_profit),
            re_basic_eps_for_cont_dic_opr: c.basic_eps || '0',
            re_dilut_eps_for_cont_dic_opr: c.diluted_eps || '0',
            re_tax: toLakhs(c.tax),
            re_face_val: c.face_value || '10',
            re_res_type: data.nature_of_report === 'Standalone' ? 'A' : 'C',
            re_create_dt: '—'
          });
        }

        const filings = {
          quarterly: [
            {
              financialYear: data.quarter,
              audited: data.nature_of_report,
              relatingTo: 'XBRL Document Link',
              broadCastDate: 'Parsed URL',
              xbrl: data.document_url
            }
          ],
          half_yearly: [],
          annual: []
        };

        const mappedResult = {
          company_name: data.company_name,
          symbol: data.symbol,
          is_xbrl_parsed: true,
          xbrl_url: data.document_url,
          quote: null,
          past_results: {
            resCmpData: resCmpData
          },
          filings: filings
        };

        setSearchResult(mappedResult);
      } else {
        const response = await axios.get(`${API_BASE_URL}/nse/search/${queryStr.toUpperCase()}`);
        setSearchResult(response.data.data);
        if (response.data.data?.concalls && response.data.data.concalls.length > 0) {
          setIsConcallsModalOpen(true);
        }

      }
    } catch (err) {
      console.error(err);
      setSearchError(err.response?.data?.detail || 'Failed to fetch or parse stock results. Please check your query/URL.');
      setSearchResult(null);
    } finally {
      setSearchLoading(false);
    }
  };

  const formatNumber = (num, isCurrency = true) => {
    if (num === null || num === undefined || num === '') return '—';
    const val = parseFloat(num);
    if (isNaN(val)) return num;

    // In NSE corporate results, values are typically reported in Lakhs.
    // Convert Lakhs to Crores if large enough.
    if (isCurrency) {
      // 100 Lakhs = 1 Crore
      if (Math.abs(val) >= 100) {
        return `₹ ${(val / 100).toFixed(2)} Cr`;
      }
      return `₹ ${val.toFixed(2)} Lakhs`;
    }
    return val.toLocaleString('en-IN');
  };


  useEffect(() => {
    localStorage.setItem('market_dashboard_active_view', activeView);
    if (activeView === 'stocks') {
      fetchStocks();
    }
  }, [activeView]);



  const fetchStocks = async () => {
    setLoadingStocks(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/stocks`);
      setStocks(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch stocks:', err);
    } finally {
      setLoadingStocks(false);
    }
  };

  useEffect(() => {
    if (activeView === 'stocks') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchStocks();
    }
  }, [activeView]);

  const handleStockSelect = async (symbol) => {
    setSearchQuery(symbol);
    setSearchLoading(true);
    setSearchError(null);
    setActiveView('pdf');
    try {
      const response = await axios.get(`${API_BASE_URL}/nse/search/${symbol.toUpperCase()}`);
      setSearchResult(response.data.data);
      if (response.data.data?.concalls && response.data.data.concalls.length > 0) {
        setIsConcallsModalOpen(true);
      }
    } catch (err) {

      console.error(err);
      setSearchError(err.response?.data?.detail || 'Failed to fetch stock details.');
      setSearchResult(null);
    } finally {
      setSearchLoading(false);
    }
  };

  const navItems = [
    {
      id: 'stocks',
      label: 'Stock List',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 16l4-4 4 4 6-6" />
        </svg>
      ),
    },
    {
      id: 'pdf',
      label: 'PDF Analyser',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8F9FA] text-slate-800 font-sans">

      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64 p-4' : 'w-16 p-2'} bg-white border-r border-slate-200 flex flex-col justify-between flex-shrink-0 transition-all duration-300 ease-in-out select-none`}>
        <div className="space-y-6">
          {/* Logo & Toggle Button */}
          <div className="flex items-center justify-between px-1 py-1">
            <div onClick={() => onNavigate('/')} className="flex items-center gap-2.5 cursor-pointer overflow-hidden">
              <svg className="w-6 h-6 text-slate-800 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 16l4-4 4 4 6-6" />
              </svg>
              {isSidebarOpen && (
                <span className="text-base font-bold tracking-tight text-slate-800 whitespace-nowrap transition-opacity">
                  Stock Analysis AI
                </span>
              )}
            </div>
            {isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                title="Collapse Sidebar"
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer flex-shrink-0"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
            )}
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                title={!isSidebarOpen ? item.label : undefined}
                className={`w-full flex items-center ${isSidebarOpen ? 'justify-start gap-3 px-3' : 'justify-center px-0'} py-2.5 rounded-xl font-semibold transition-all text-sm cursor-pointer ${activeView === item.id
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
              >
                <span className={activeView === item.id ? 'text-slate-800' : 'text-slate-400'}>
                  {item.icon}
                </span>
                {isSidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        {isSidebarOpen ? (
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Market Status</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-extrabold text-slate-700">Markets Open</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-2" title="Markets Open">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#F8F9FA]">

        {/* Top Header Bar */}
        <header className="h-14 bg-white border-b border-slate-200/80 flex items-center justify-between px-6 flex-shrink-0 select-none">
          <div className="flex items-center gap-2">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                title="Expand Sidebar"
                className="opacity-40 hover:opacity-100 transition-all duration-200 cursor-pointer flex items-center gap-1.5 px-2 py-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200/50 select-none group"
              >
                <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
                <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 group-hover:text-slate-700 transition-colors">
                  Expand Sidebar
                </span>
              </button>
            )}
          </div>


          <div
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center font-bold text-xs shadow-sm">
              {profile?.username?.substring(0, 2).toUpperCase() || 'US'}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-black text-slate-800 leading-tight">{profile?.full_name || 'User'}</span>
              <span className="text-[10px] font-bold text-slate-400 leading-tight">@{profile?.username || 'user'}</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* PDF Analyser View (Stock search & results) */}
          {activeView === 'pdf' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Search Bar Header */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <h2 className="text-base font-black text-slate-800 mb-1">Corporate Results & Stock Analyser</h2>
                <p className="text-xs text-slate-400 mb-4">Search any NSE stock symbol to fetch live corporate results and financial data.</p>

                <form onSubmit={handleSearch} className="flex gap-2">
                  <div ref={dashboardSearchRef} className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Enter stock symbol (e.g. RELIANCE, TCS, HDFCBANK)..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                        setSelectedIndex(-1);
                      }}
                      onKeyDown={handleKeyDown}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium text-sm focus:outline-none focus:border-slate-400 focus:bg-white transition-all placeholder:text-slate-400"
                    />
                    <svg className="w-5 h-5 text-slate-400 absolute left-3.5 top-3 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>

                    {/* Search Auto-Complete Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 max-h-64 overflow-y-auto overflow-x-hidden custom-scrollbar-light divide-y divide-slate-100 animate-fadeIn">
                        {suggestions.map((item, idx) => (
                          <div
                            key={idx}
                            onMouseDown={() => {
                              setSearchQuery(item.symbol);
                              setShowSuggestions(false);
                              setSelectedIndex(-1);
                            }}
                            className={`px-4 py-2.5 transition-all duration-200 ease-out cursor-pointer flex items-center justify-between group transform ${idx === selectedIndex
                                ? 'bg-indigo-100/80 font-bold translate-x-1.5'
                                : 'hover:bg-indigo-50/80 hover:translate-x-1.5'
                              }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className={`w-2 h-2 rounded-full flex-shrink-0 transition-transform ${idx === selectedIndex ? 'bg-indigo-600 scale-125' : 'bg-indigo-400 group-hover:scale-125'
                                }`} />
                              <span className={`text-xs tracking-wide ${idx === selectedIndex ? 'font-black text-indigo-900' : 'font-black text-slate-800 group-hover:text-indigo-600'
                                }`}>
                                {item.symbol}
                              </span>
                              {item.name && (
                                <span className={`text-xs truncate max-w-[260px] ${idx === selectedIndex ? 'text-indigo-700 font-bold' : 'text-slate-400 font-semibold'
                                  }`}>
                                  {item.name}
                                </span>
                              )}
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all duration-200 ${idx === selectedIndex ? 'text-indigo-700 font-black' : 'text-slate-400 group-hover:text-indigo-600'
                              }`}>
                              Select ↵
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>

                  <button
                    type="submit"
                    disabled={searchLoading}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300/80 font-bold rounded-xl text-sm transition-all disabled:opacity-50 cursor-pointer shadow-sm flex items-center gap-2 active:scale-98"
                  >
                    {searchLoading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin text-slate-700" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span>Search</span>
                      </>
                    )}
                  </button>
                </form>

                {searchError && (
                  <div className="mt-3 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-semibold flex items-center gap-2">
                    <svg className="w-4 h-4 text-rose-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {searchError}
                  </div>
                )}
              </div>

              {/* Initial State / No stock searched yet */}
              {!searchResult && !searchLoading && (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-slate-200/80 rounded-2xl">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-150 flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-slate-700 mb-1">No Stock Searched</h3>
                  <p className="text-xs text-slate-400 max-w-sm">Use the search bar above to fetch corporate financial statements directly from NSE.</p>
                </div>
              )}

              {/* Loading State */}
              {searchLoading && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
                  {/* Skeleton Header */}
                  <div className="flex justify-between items-start animate-pulse">
                    <div className="space-y-2">
                      <div className="h-6 w-48 bg-slate-100 rounded-md"></div>
                      <div className="h-4 w-32 bg-slate-50 rounded-md"></div>
                    </div>
                    <div className="h-8 w-24 bg-slate-150 rounded-lg"></div>
                  </div>

                  {/* Skeleton Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-24 bg-slate-50 border border-slate-100 rounded-xl"></div>
                    ))}
                  </div>

                  {/* Skeleton Table */}
                  <div className="space-y-3 animate-pulse">
                    <div className="h-4 bg-slate-100 rounded w-full"></div>
                    <div className="h-10 bg-slate-50 rounded w-full"></div>
                    <div className="h-10 bg-slate-50 rounded w-full"></div>
                    <div className="h-10 bg-slate-50 rounded w-full"></div>
                  </div>
                </div>
              )}

              {/* Results Dashboard */}
              {searchResult && !searchLoading && (
                <div className="space-y-6">

                  {searchResult.is_xbrl_parsed && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 shadow-sm">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                        <div>
                          <h4 className="text-xs font-black text-emerald-800 uppercase tracking-wide">XBRL Document Loaded Successfully</h4>
                          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5 max-w-xl truncate">
                            Parsed live financial figures from: <span className="underline select-all">{searchResult.xbrl_url}</span>
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm">
                        Parsed Live Data
                      </span>
                    </div>
                  )}

                  {/* Company Info Header */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h1 className="text-xl font-black text-slate-800">{searchResult.company_name}</h1>
                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 border border-slate-200/40 rounded-lg text-xs font-black tracking-wide">
                          {searchResult.symbol}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSearch()}
                          disabled={searchLoading}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1"
                        >
                          🔄 Refresh
                        </button>
                        {searchResult.is_xbrl_parsed && (
                          <button
                            type="button"
                            onClick={() => {
                              const downloadUrl = `${API_BASE_URL}/api/download-xbrl-pdf?url=${encodeURIComponent(searchResult.xbrl_url)}`;
                              const link = document.createElement('a');
                              link.href = downloadUrl;
                              link.setAttribute('download', `XBRL_Report_${searchResult.symbol}.pdf`);
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-700 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                          >
                            📥 Download PDF Report
                          </button>
                        )}

                        {searchResult.concalls && searchResult.concalls.length > 0 && (
                          <button
                            onClick={() => setIsConcallsModalOpen(true)}
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300/80 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
                          >
                            📊 View Concalls & Presentations ({searchResult.concalls.length})
                          </button>
                        )}

                      </div>
                      <p className="text-xs text-slate-400 mt-1">NSE India Corporate Filings & Financial Results Dashboard</p>
                    </div>


                    {searchResult.quote ? (
                      <div className="bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2 flex items-center gap-4">
                        <div>
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Traded Price</span>
                          <span className="text-base font-black text-slate-800">
                            ₹ {searchResult.quote.priceInfo?.lastPrice?.toLocaleString('en-IN') || '—'}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Change</span>
                          <span className={`text-xs font-bold ${searchResult.quote.priceInfo?.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {searchResult.quote.priceInfo?.change >= 0 ? '+' : ''}
                            {searchResult.quote.priceInfo?.change?.toFixed(2) || '0.00'} ({searchResult.quote.priceInfo?.pChange?.toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* Render Extracted AI Summary directly on the main page underneath Company Info Header */}

                  {selectedPdfSummary && (
                    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-6 animate-fadeIn">
                      {/* Section Header */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-slate-100 gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">💡</span>
                            <h3 className="text-lg font-black text-slate-800">
                              {selectedPdfSummary.loading ? 'Analysing Presentation Document...' : (selectedPdfSummary.title || 'Presentation AI Summary')}
                            </h3>
                          </div>
                          <p className="text-xs text-slate-400 font-semibold mt-1">
                            {selectedPdfSummary.loading
                              ? 'Extracting text & running investment-grade analysis...'
                              : selectedPdfSummary.error
                                ? 'Could not extract content from this document.'
                                : `${selectedPdfSummary.filename || 'Presentation Document'} · ${selectedPdfSummary.file_type || 'PDF'} · ${selectedPdfSummary.pages_or_slides || '?'} pages`
                            }
                          </p>
                        </div>

                        {!selectedPdfSummary.loading && !selectedPdfSummary.error && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleDownloadCompletePackage}
                              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300/80 font-black rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
                            >
                              <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Download Complete PDF & JSON Data
                            </button>
                            <button
                              onClick={() => setSelectedPdfSummary(null)}
                              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs transition-all cursor-pointer"
                            >
                              Close
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Loading State */}
                      {selectedPdfSummary.loading && (
                        <div className="flex flex-col items-center justify-center py-16 gap-4">
                          <div className="flex gap-1.5">
                            <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                          </div>
                          <p className="text-xs font-bold text-slate-500">Extracting text & PyMuPDF data from the presentation PDF...</p>
                        </div>
                      )}

                      {/* Summary Content Body */}
                      {!selectedPdfSummary.loading && (
                        <div className="space-y-6">
                          {selectedPdfSummary.markdown_report ? (
                            renderMarkdown(selectedPdfSummary.markdown_report)
                          ) : (
                            <>
                              {/* Key Figures Bar */}
                              {selectedPdfSummary.key_numbers && selectedPdfSummary.key_numbers.length > 0 && (
                                <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl">
                                  <span className="block text-[10px] font-extrabold text-indigo-500 uppercase tracking-wider mb-2">Key Figures Found in Document</span>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedPdfSummary.key_numbers.map((num, i) => (
                                      <span key={i} className="px-2.5 py-1 bg-white border border-indigo-150 rounded-xl text-xs font-black text-indigo-700 shadow-sm">{num}</span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </>
                          )}

                          {/* PyMuPDF Complete Extracted JSON Grid & Raw View */}
                          {selectedPdfSummary.key_value_pairs && Object.keys(selectedPdfSummary.key_value_pairs).length > 0 && (
                            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                              <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-3 border-b border-slate-150 mb-3 gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded text-[10px] font-black uppercase tracking-wider">
                                    PyMuPDF Complete Extraction
                                  </span>
                                  <h4 className="text-xs font-black text-slate-800">Extracted JSON Intelligence</h4>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-[10px] text-slate-400 font-bold">
                                    {Object.keys(selectedPdfSummary.key_value_pairs).length} total fields extracted
                                  </span>
                                  <div className="flex items-center bg-slate-100/90 rounded-lg p-0.5 border border-slate-200">
                                    <button
                                      onClick={() => setJsonViewMode('grid')}
                                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${jsonViewMode === 'grid' ? 'bg-white text-slate-900 border border-slate-200 shadow-xs font-black' : 'text-slate-500 hover:text-slate-800'
                                        }`}
                                    >
                                      Grid View
                                    </button>
                                    <button
                                      onClick={() => setJsonViewMode('raw')}
                                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${jsonViewMode === 'raw' ? 'bg-white text-slate-900 border border-slate-200 shadow-xs font-black' : 'text-slate-500 hover:text-slate-800'
                                        }`}
                                    >
                                      Raw JSON
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Search Bar for Key-Value Pairs */}
                              <div className="mb-3">
                                <input
                                  type="text"
                                  placeholder="Search extracted JSON fields (e.g. Revenue, EBITDA, PAT, EPS)..."
                                  value={jsonSearchQuery}
                                  onChange={(e) => setJsonSearchQuery(e.target.value)}
                                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
                                />
                              </div>

                              {jsonViewMode === 'grid' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-96 overflow-y-auto pr-1 custom-scrollbar-light">
                                  {Object.entries(selectedPdfSummary.key_value_pairs)
                                    .filter(([k, v]) =>
                                      !jsonSearchQuery ||
                                      k.toLowerCase().includes(jsonSearchQuery.toLowerCase()) ||
                                      String(v).toLowerCase().includes(jsonSearchQuery.toLowerCase())
                                    )
                                    .map(([key, val], idx) => (
                                      <div key={idx} className="bg-slate-50/90 p-3 rounded-xl border border-slate-200/90 flex flex-col justify-between gap-1 hover:bg-slate-100/90 transition-colors">
                                        <span className="text-[10px] text-slate-500 font-bold uppercase truncate" title={key}>{key}</span>
                                        <span className="text-xs font-black text-slate-900 break-words">{String(val)}</span>
                                      </div>
                                    ))}
                                </div>
                              ) : (
                                <pre className="text-xs text-slate-800 font-mono bg-slate-50 p-4 rounded-xl border border-slate-200 max-h-96 overflow-auto whitespace-pre-wrap select-all custom-scrollbar-light">
                                  {JSON.stringify(
                                    jsonSearchQuery
                                      ? Object.fromEntries(
                                        Object.entries(selectedPdfSummary.key_value_pairs).filter(([k, v]) =>
                                          k.toLowerCase().includes(jsonSearchQuery.toLowerCase()) ||
                                          String(v).toLowerCase().includes(jsonSearchQuery.toLowerCase())
                                        )
                                      )
                                      : selectedPdfSummary.key_value_pairs,
                                    null,
                                    2
                                  )}
                                </pre>
                              )}
                            </div>
                          )}

                          {/* PyMuPDF Extracted Financial Tables View */}
                          {selectedPdfSummary.tables && selectedPdfSummary.tables.length > 0 && (
                            <div className="mt-6 space-y-4">
                              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                📊 PyMuPDF Extracted Financial Tables ({selectedPdfSummary.tables.length})
                              </h4>
                              {selectedPdfSummary.tables.map((tbl, tIdx) => (
                                <div key={tIdx} className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white p-4 space-y-2">
                                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                                    <span>Table #{tbl.table_id || tIdx + 1} (Page {tbl.page || 1})</span>
                                  </div>
                                  <table className="w-full text-xs text-left border-collapse">
                                    {tbl.headers && tbl.headers.length > 0 && (
                                      <thead className="bg-slate-100 text-slate-800 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                                        <tr>
                                          {tbl.headers.map((h, hIdx) => (
                                            <th key={hIdx} className="px-3.5 py-2.5 border-b border-slate-200 font-extrabold uppercase">{h}</th>
                                          ))}
                                        </tr>
                                      </thead>
                                    )}
                                    <tbody className="divide-y divide-slate-150 font-semibold text-slate-700">
                                      {tbl.rows && tbl.rows.map((row, rIdx) => (
                                        <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50 hover:bg-slate-100'}>
                                          {row.map((cell, cIdx) => (
                                            <td key={cIdx} className="px-3.5 py-2.5 border-b border-slate-100">
                                              {cell}
                                            </td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}










          {/* Stock List View */}
          {activeView === 'stocks' && (
            <div>
              {/* Page Header */}
              <div className="mb-5">
                <h1 className="text-lg font-black text-slate-800">Stock List</h1>
                <p className="text-xs text-slate-400 mt-0.5">All Nifty 50 stocks in the database</p>
              </div>

              {loadingStocks ? (
                <div className="flex items-center justify-center py-20">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2.5 h-2.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2.5 h-2.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50">
                        <th className="text-left px-5 py-3.5 text-[11px] font-black text-slate-500 uppercase tracking-wider w-12">#</th>
                        <th className="text-left px-5 py-3.5 text-[11px] font-black text-slate-500 uppercase tracking-wider">Name</th>
                        <th className="text-left px-5 py-3.5 text-[11px] font-black text-slate-500 uppercase tracking-wider">Symbol</th>
                        <th className="text-left px-5 py-3.5 text-[11px] font-black text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="text-left px-5 py-3.5 text-[11px] font-black text-slate-500 uppercase tracking-wider">Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stocks.map((stock) => (
                        <tr
                          key={stock.id}
                          onClick={() => handleStockSelect(stock.symbol)}
                          className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <td className="px-5 py-3.5 text-slate-400 font-semibold text-xs">{stock.id}</td>
                          <td className="px-5 py-3.5 font-semibold text-slate-800">{stock.name}</td>
                          <td className="px-5 py-3.5">
                            <span className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-black tracking-wide">
                              {stock.symbol}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              <span className="text-slate-600 capitalize">{stock.status}</span>
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-slate-400 text-xs font-medium">{formatDate(stock.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Footer count */}
                  <div className="px-5 py-3 border-t border-slate-100 bg-slate-50">
                    <span className="text-xs font-bold text-slate-400">{stocks.length} stocks total</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Profile Modal */}
      {isProfileOpen && (
        <div
          onClick={() => setIsProfileOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-[360px] rounded-3xl p-6 shadow-xl border border-slate-100 relative"
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4 select-none">
              <h3 className="text-base font-black text-slate-800">Profile Details</h3>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-800 border border-slate-200/60 flex items-center justify-center font-bold text-lg shadow-sm">
                  {profile?.username?.substring(0, 2).toUpperCase() || 'US'}
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Username</span>
                  <span className="text-sm font-extrabold text-slate-800">@{profile?.username || 'user'}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Full Name</span>
                <div className="block w-full px-4 py-3 bg-slate-50 border border-slate-150 rounded-xl text-slate-800 font-semibold text-sm">
                  {profile?.full_name || 'N/A'}
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
                <button
                  onClick={() => { setIsProfileOpen(false); onNavigateReset(); }}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-bold rounded-xl transition-all cursor-pointer text-sm"
                >
                  Change Password
                </button>
                <button
                  onClick={() => { setIsProfileOpen(false); onLogout(); }}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200/85 text-slate-800 font-bold rounded-xl transition-all cursor-pointer text-sm"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Concalls & Presentations Pop Up Modal */}
      {isConcallsModalOpen && searchResult?.concalls && (
        <div
          onClick={() => setIsConcallsModalOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn select-none"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-3xl rounded-3xl p-6 shadow-2xl border border-slate-100 relative max-h-[85vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4 select-none">
              <div>
                <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                  <span className="text-xl">📊</span>
                  Earnings Concalls & Presentations — {searchResult.company_name} ({searchResult.symbol})
                </h3>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                  Select any presentation to Download PPT or click AI Summary for instant 1-click analysis · {searchResult.concalls.length} periods available
                </p>
              </div>
              <button
                onClick={() => setIsConcallsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body: Concalls Table */}
            <div className="flex-1 overflow-y-auto pr-1">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-bold sticky top-0 z-10">
                    <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider font-extrabold">Concall Period</th>
                    <th className="text-center px-5 py-3 text-[10px] uppercase tracking-wider font-extrabold">Presentation (PPT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {searchResult.concalls.map((concall, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 text-xs font-bold text-slate-700">{concall.date}</td>
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {concall.ppt ? (
                            <>
                              <a
                                href={getDownloadProxyUrl(concall.ppt)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 rounded-xl text-xs font-black transition-all shadow-sm"
                              >
                                Download PPT 📥
                              </a>
                              <button
                                type="button"
                                onClick={() => handleDirectSummarize(concall)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-95"
                              >
                                💡 AI Summary
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveToDb(concall)}
                                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-95 ${savedDbStates[concall.ppt || concall.date] === 'saved'
                                    ? 'bg-emerald-600 text-white'
                                    : savedDbStates[concall.ppt || concall.date] === 'saving'
                                      ? 'bg-amber-500 text-white'
                                      : 'bg-cyan-600 hover:bg-cyan-700 text-white'
                                  }`}
                              >
                                {savedDbStates[concall.ppt || concall.date] === 'saved'
                                  ? '✓ Saved to DB'
                                  : savedDbStates[concall.ppt || concall.date] === 'saving'
                                    ? '⏳ Saving...'
                                    : '💾 Save to DB'}
                              </button>
                            </>
                          ) : (
                            <span className="text-slate-300 text-xs font-semibold">Not Available</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-slate-400 font-bold">
              <span>Source: screener.in/company/{searchResult.symbol}/</span>
              <button
                onClick={() => setIsConcallsModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer"
              >
                Close Pop Up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Upload Modal — opens when user clicks AI Summary */}

      {uploadModalTarget && !selectedPdfSummary && (
        <div
          onClick={() => { setUploadModalTarget(null); setSummaryError(null); setSummaryLoading(false); }}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-100 relative"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                  <span className="text-xl">📄</span> Upload Presentation PDF
                </h3>
                <p className="text-[11px] text-slate-400 font-semibold mt-1">
                  Download the PPT first, then upload it here for AI analysis · {uploadModalTarget.concall.date}
                </p>
              </div>
              <button
                onClick={() => { setUploadModalTarget(null); setSummaryError(null); setSummaryLoading(false); }}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Step 1 hint */}
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
              <span className="text-lg">1️⃣</span>
              <div className="flex-1">
                <p className="text-xs font-bold text-emerald-800">Auto-Analyze or Download PPT</p>
                <p className="text-[11px] text-emerald-600 mt-0.5">Click Auto-Analyze for 1-click summary or Download PPT locally</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => handleDirectSummarize(uploadModalTarget.concall)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  ⚡ Auto-Analyze
                </button>
                <a
                  href={getDownloadProxyUrl(uploadModalTarget.pptUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Download 📥
                </a>
              </div>
            </div>


            {/* Step 2: Upload */}
            <div className="mb-4 p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start gap-3">
              <span className="text-lg mt-0.5">2️⃣</span>
              <div className="flex-1">
                <p className="text-xs font-bold text-indigo-800 mb-2">Then — Upload it for AI Analysis</p>
                <label
                  htmlFor="pdf-upload-input"
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl py-6 px-4 cursor-pointer transition-all ${dragActive
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-indigo-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/50"
                    }`}
                >
                  <span className="text-3xl">☁️</span>
                  <span className="text-xs font-bold text-indigo-700">
                    {dragActive ? "Drop the file here!" : "Click to browse or drag & drop"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">Accepts PDF or PPTX files (including extensionless files)</span>
                  <input
                    id="pdf-upload-input"
                    type="file"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) await handleFileUpload(file);
                    }}
                  />
                </label>
              </div>
            </div>

            {summaryError && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs font-semibold">
                ⚠️ {summaryError}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
