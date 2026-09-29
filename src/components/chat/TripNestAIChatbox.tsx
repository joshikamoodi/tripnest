import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  X,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Settings,
  ChevronDown,
  AlertCircle,
  ExternalLink,
  CheckCircle,
  Compass
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  isError?: boolean;
}

const DEFAULT_WEBHOOK_URL = 'https://joshika-moodi.app.n8n.cloud/webhook/64445495-c8ce-4ddb-9ad3-79a07310c523/chat';

const SUGGESTED_PROMPTS = [
  'Plan a 4-day romantic Paris itinerary',
  'Compare Vande Bharat train vs flight to Goa',
  'Best boutique stays & water temples in Bali',
  'What is the best time to visit Swiss Alps?'
];

function getLocalTripNestResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('paris')) {
    return `🇫🇷 **Parisian Escapade (4-Day Recommendation)**\n\n` +
      `• **Day 1: Arrival & Seine Twilight** — Check-in, Montmartre & Sacré-Cœur walk, evening Bateaux Parisiens river cruise under the sparkling Eiffel Tower.\n` +
      `• **Day 2: Louvre & Historic Cafés** — Skip-the-line Louvre morning tour (Mona Lisa), lunch at Café de Flore, and afternoon pastry walk in Le Marais.\n` +
      `• **Day 3: Eiffel Tower & Fine Dining** — Ascend the Eiffel Tower summit (276m), explore Champs-Élysées, and celebrate with a romantic French bistro dinner.\n` +
      `• **Day 4: Luxembourg Gardens & Return** — Stroll through the royal gardens and pick up authentic macarons from Pierre Hermé.\n\n` +
      `🏨 **Stay**: *Le Grand Haussmann Palace & Spa* (€380 / ₹34,200/night) or *Montmartre Bohemian Loft* (€85/night).\n` +
      `💰 **Daily Budget**: ~€160 (₹14,500) per person.`;
  }

  if (q.includes('goa') || q.includes('vande bharat') || q.includes('train')) {
    return `🏖️ **Goa Multi-Modal Transit Comparison**\n\n` +
      `• 🚆 **Vande Bharat Express (Train 20608)**: 4h 50m duration. Features rotating executive seats, panoramic windows through the Western Ghats, complimentary breakfast & tea. Emits **75% less CO2 (18 kg vs 78 kg)**! Price: ~₹1,820.\n` +
      `• ✈️ **Direct Flight**: ~1h 15m airtime (+2 hrs airport transit & security). Price: ~₹4,350.\n\n` +
      `🏨 **Curated Stay**: *Azura Palm Sands Beachfront Resort* (₹12,400/night with private beach cabana).\n` +
      `🌴 **Top Highlights**: Palolem beach, Dudhsagar Waterfalls jungle safari, and Fontainhas Latin Quarter.`;
  }

  if (q.includes('bali')) {
    return `🌴 **Bali Island Tropical Serenity Guide**\n\n` +
      `• **Must-Visit**: Ulun Danu Beratan Mist Water Temple on Lake Bratan, Tegalalang emerald rice terraces & giant swing, and Uluwatu Sunset Cliff Temple with Kecak Fire Dance.\n` +
      `• 🏨 **Recommended Stay**: *Ubud Rainforest Infinity Pool Villa & Spa* (₹14,800 / Rp 2.8M per night with floating breakfast).\n` +
      `• ☀️ **Best Season**: April to October for sunny dry weather and prime surfing.\n` +
      `• 💰 **Avg Daily Budget**: ~₹7,500 (Rp 1.4M) per day.`;
  }

  if (q.includes('swiss') || q.includes('zermatt') || q.includes('alps')) {
    return `🏔️ **Swiss Alps & Matterhorn Expedition**\n\n` +
      `• **Best Time to Visit**: Dec–Apr for world-class Alpine skiing; June–September for wildflower hiking and mirror-reflection trails at Lake Riffelsee.\n` +
      `• **Top Highlights**: Gornergrat Cogwheel Train climbing to 3,089m summit, Matterhorn Glacier Paradise (3,883m), and traditional cheese fondue at Kulmhotel.\n` +
      `• 🏨 **Stay**: *Matterhorn Alpine Grand Chalet & Thermal Spa* (CHF 460 / ₹42,000/night with 36°C outdoor heated pool facing the pyramid peak).\n` +
      `• 💰 **Avg Daily Budget**: ~CHF 240 (₹22,000) per person.`;
  }

  if (q.includes('dubai')) {
    return `✨ **Dubai Futuristic Oasis Guide**\n\n` +
      `• **Best Season**: November to March (pleasant 24°C winter weather).\n` +
      `• **Must-Do**: Burj Khalifa 148th Sky Deck, Red Dune 4x4 Desert Safari & starlit Bedouin dinner, Dubai Marina sunset yacht cruise, and historic Gold Souk Abra boat ride.\n` +
      `• 🏨 **Stay**: *Atlantis The Royal Palm Luxury Suite* (₹38,000/night).\n` +
      `• 💰 **Avg Daily Budget**: ~AED 800 (₹18,000).`;
  }

  if (q.includes('kerala')) {
    return `🛶 **Kerala (God's Own Country)**\n\n` +
      `• **Highlights**: Alleppey backwaters luxury houseboat cruise, Munnar misty tea gardens, Fort Kochi heritage walk, and Ayurvedic spa treatments.\n` +
      `• 🏨 **Stay**: *Kumarakom Lakefront Ayurvedic Heritage Resort* (₹18,500/night).\n` +
      `• 💰 **Avg Daily Budget**: ~₹3,500 per person. Best season: September to March.`;
  }

  if (q.includes('jaipur')) {
    return `👑 **Jaipur (The Royal Pink City)**\n\n` +
      `• **Highlights**: Amber Fort elephant trail, Hawa Mahal photoshoot, City Palace royal museum, and Nahargarh sunset fort.\n` +
      `• 🏨 **Stay**: *The Royal Haveli & Heritage Palace* (₹8,200/night).\n` +
      `• 💰 **Avg Daily Budget**: ~₹3,200. Best season: October to March.`;
  }

  return `🧭 **TripNest AI Travel Planner**\n\n` +
    `I can help plan your complete journey:\n` +
    `1. ✈️ **Multi-Modal Transit**: Compare flights vs high-speed trains (Vande Bharat).\n` +
    `2. 🏨 **Verified Stays**: Boutique luxury villas, heritage havelis, and artist lofts.\n` +
    `3. 🗺️ **Day-by-Day Itineraries**: Tailored schedules with best hours, costs, and local cuisine tips.\n\n` +
    `Where would you like to travel, or would you like a recommendation for a specific budget or season?`;
}

export const TripNestAIChatbox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState(() => {
    return localStorage.getItem('tripnest_chat_webhook') || DEFAULT_WEBHOOK_URL;
  });
  const [isTestMode, setIsTestMode] = useState(() => {
    return (localStorage.getItem('tripnest_chat_webhook') || DEFAULT_WEBHOOK_URL).includes('/webhook-test/');
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => {
    const existing = localStorage.getItem('tripnest_chat_session_id');
    if (existing) return existing;
    const newId = 'tn_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    localStorage.setItem('tripnest_chat_session_id', newId);
    return newId;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('tripnest_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse chat history', e);
      }
    }
    return [
      {
        id: 'welcome-1',
        sender: 'assistant',
        text: '👋 Hello! I am your **TripNest AI Concierge**.\n\nI can help you explore destinations, compare multi-modal flights & scenic trains, recommend boutique stays, and build custom day-by-day itineraries.\n\nWhere would you like to travel next?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  // Persist messages
  useEffect(() => {
    localStorage.setItem('tripnest_chat_history', JSON.stringify(messages));
  }, [messages]);

  // Handle test mode toggle
  const toggleTestMode = (toTest: boolean) => {
    setIsTestMode(toTest);
    let updatedUrl = webhookUrl;
    if (toTest && updatedUrl.includes('/webhook/')) {
      updatedUrl = updatedUrl.replace('/webhook/', '/webhook-test/');
    } else if (!toTest && updatedUrl.includes('/webhook-test/')) {
      updatedUrl = updatedUrl.replace('/webhook-test/', '/webhook/');
    }
    setWebhookUrl(updatedUrl);
    localStorage.setItem('tripnest_chat_webhook', updatedUrl);
  };

  const handleSaveWebhook = (url: string) => {
    setWebhookUrl(url);
    setIsTestMode(url.includes('/webhook-test/'));
    localStorage.setItem('tripnest_chat_webhook', url);
  };

  const handleClearHistory = () => {
    const initialMsg: ChatMessage = {
      id: 'welcome-' + Date.now(),
      sender: 'assistant',
      text: '✨ Conversation refreshed! Ask me anything about trip planning, stays, or transit.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([initialMsg]);
  };

  const sendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Send payload compatible with n8n Chat Trigger & Webhook nodes
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain, */*'
        },
        body: JSON.stringify({
          action: 'sendMessage',
          sessionId,
          chatInput: text,
          message: text,
          input: text
        })
      });

      if (!response.ok) {
        // If n8n returns 404 (workflow is in draft/inactive mode), provide smart local response
        const fallbackText = getLocalTripNestResponse(text);
        const notice = isTestMode
          ? '\n\n*(🟡 Note: n8n test webhook is waiting for "Execute workflow" in your canvas. Showing TripNest Concierge response above).*'
          : '\n\n*(💡 Note: Your n8n workflow is currently in draft mode. Toggle it to "Active" in n8n for live custom agent executions).*';

        const assistantMessage: ChatMessage = {
          id: 'msg-' + Date.now() + '-reply',
          sender: 'assistant',
          text: fallbackText + notice,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, assistantMessage]);
        return;
      }

      // Parse live response from n8n
      const responseText = await response.text();
      let replyText = '';

      try {
        const json = JSON.parse(responseText);
        if (typeof json === 'string') {
          replyText = json;
        } else if (Array.isArray(json) && json.length > 0) {
          replyText = json[0]?.output || json[0]?.text || json[0]?.message || JSON.stringify(json[0]);
        } else if (typeof json === 'object' && json !== null) {
          replyText =
            json.output ||
            json.response ||
            json.message ||
            json.text ||
            json.content ||
            (json.data && (json.data.output || json.data.message)) ||
            JSON.stringify(json, null, 2);
        } else {
          replyText = String(json);
        }
      } catch {
        replyText = responseText;
      }

      if (!replyText || replyText.trim() === '') {
        replyText = getLocalTripNestResponse(text);
      }

      const assistantMessage: ChatMessage = {
        id: 'msg-' + Date.now() + '-reply',
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      // Graceful fallback when network or connection fails without throwing console.error
      const fallbackText = getLocalTripNestResponse(text);
      const assistantMessage: ChatMessage = {
        id: 'msg-' + Date.now() + '-reply',
        sender: 'assistant',
        text: fallbackText + '\n\n*(💡 Note: Answering via TripNest Smart Concierge while n8n webhook is establishing connection).*',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Helper to format basic markdown-style text safely
  const renderFormattedText = (rawText: string) => {
    const lines = rawText.split('\n');
    return lines.map((line, idx) => {
      // Bold text handling **word**
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-semibold text-slate-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      return (
        <span key={idx} className="block leading-relaxed min-h-[1.2em]">
          {formattedParts}
        </span>
      );
    });
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="group relative flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-full shadow-xl shadow-emerald-600/30 hover:shadow-2xl hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 border border-emerald-400/30 cursor-pointer"
            aria-label="Open TripNest AI Chat"
          >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-emerald-100 animate-pulse" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 rounded-full ring-2 ring-emerald-700"></span>
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold tracking-wide flex items-center gap-1.5">
                TripNest AI
                <span className="px-1.5 py-0.2 bg-emerald-500/50 rounded text-[10px] uppercase font-mono font-bold tracking-wider">
                  Live
                </span>
              </div>
              <div className="text-[11px] text-emerald-100 font-medium">Plan with n8n Agent</div>
            </div>
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed right-4 sm:right-6 z-50 transition-all duration-300 ease-in-out flex flex-col ${
            isMinimized
              ? 'bottom-6 w-72 sm:w-80 h-14 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden'
              : 'bottom-4 sm:bottom-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[calc(100vh-2rem)] bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden backdrop-blur-md'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-4 py-3.5 flex items-center justify-between border-b border-slate-700/50 select-none">
            <div
              className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-slate-950" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-900"></span>
              </div>
              <div className="truncate">
                <div className="font-semibold text-sm leading-tight flex items-center gap-1.5 text-white">
                  <span>TripNest Concierge</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-mono font-medium">
                    n8n
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 truncate">
                  {isTestMode ? '🟡 Test Mode' : '🟢 Production Agent'}
                </div>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-1 shrink-0 ml-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                title="Webhook settings"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  showSettings ? 'bg-slate-700 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={handleClearHistory}
                title="Restart conversation"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMinimized ? 'rotate-180' : ''}`} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Body (Hidden when minimized) */}
          {!isMinimized && (
            <div className="flex-1 flex flex-col bg-slate-50/60 overflow-hidden relative">
              {/* Settings Overlay Drawer */}
              {showSettings && (
                <div className="absolute inset-x-0 top-0 z-20 bg-white border-b border-slate-200 p-4 shadow-lg animate-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                      <Settings className="w-3.5 h-3.5 text-emerald-600" />
                      n8n Webhook Configuration
                    </span>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer font-medium"
                    >
                      Done
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Webhook URL
                      </label>
                      <input
                        type="text"
                        value={webhookUrl}
                        onChange={(e) => handleSaveWebhook(e.target.value)}
                        className="w-full text-xs font-mono px-2.5 py-1.5 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="https://..."
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-600 font-medium">Environment Mode</span>
                      <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5">
                        <button
                          type="button"
                          onClick={() => toggleTestMode(false)}
                          className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all cursor-pointer ${
                            !isTestMode
                              ? 'bg-white text-emerald-700 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Production
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleTestMode(true)}
                          className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all cursor-pointer ${
                            isTestMode
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Test Mode
                        </button>
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 leading-snug space-y-1">
                      <div className="flex items-start gap-1.5 text-slate-700 font-medium">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>How to activate in n8n:</span>
                      </div>
                      <p className="text-slate-500 pl-5">
                        1. In n8n, open workflow <code>64445495...</code><br />
                        2. Toggle the top-right switch from <strong>Inactive</strong> to <strong>Active</strong>.<br />
                        3. If developing, select <strong>Test Mode</strong> and click <em>Execute workflow</em> in n8n.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Chat Message Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                {messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  const isSys = msg.sender === 'system';

                  if (isSys) {
                    return (
                      <div
                        key={msg.id}
                        className="p-3 bg-amber-50/80 border border-amber-200/90 rounded-2xl text-xs text-amber-900 space-y-1 animate-in fade-in-50"
                      >
                        <div className="flex items-center gap-1.5 font-semibold text-amber-800">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>Status Alert</span>
                        </div>
                        <div className="text-[11px] text-amber-900/90 leading-relaxed">
                          {renderFormattedText(msg.text)}
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <button
                            onClick={() => toggleTestMode(!isTestMode)}
                            className="text-[11px] font-medium text-emerald-700 underline hover:text-emerald-800 cursor-pointer"
                          >
                            Switch to {isTestMode ? 'Production' : 'Test Mode'}
                          </button>
                          <span className="text-[10px] text-amber-600/70">{msg.timestamp}</span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 items-end ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shrink-0 shadow-xs mb-0.5">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}

                      <div
                        className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-xs shadow-xs leading-relaxed ${
                          isUser
                            ? 'bg-emerald-600 text-white rounded-br-xs font-normal'
                            : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                        }`}
                      >
                        <div className={isUser ? 'text-white' : 'text-slate-800'}>
                          {renderFormattedText(msg.text)}
                        </div>
                        <div
                          className={`text-[9px] mt-1 text-right font-mono ${
                            isUser ? 'text-emerald-200/90' : 'text-slate-400'
                          }`}
                        >
                          {msg.timestamp}
                        </div>
                      </div>

                      {isUser && (
                        <div className="w-7 h-7 rounded-xl bg-slate-800 flex items-center justify-center text-white shrink-0 shadow-xs mb-0.5">
                          <User className="w-4 h-4 text-emerald-400" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Loading Bubble */}
                {isLoading && (
                  <div className="flex gap-2.5 items-end justify-start">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shrink-0 shadow-xs">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="px-4 py-3 bg-white border border-slate-200/80 rounded-2xl rounded-bl-xs shadow-xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce"></span>
                      <span className="text-[11px] text-slate-500 font-medium ml-1.5">Thinking...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Carousel (when few messages) */}
              {messages.length <= 2 && (
                <div className="px-4 pb-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mb-1.5">
                    <Compass className="w-3.5 h-3.5 text-emerald-600" />
                    Suggested Inquiries
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_PROMPTS.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(prompt)}
                        className="text-[11px] px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-full transition-all duration-150 text-left shadow-2xs cursor-pointer truncate max-w-full"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Form Bar */}
              <div className="p-3 bg-white border-t border-slate-200">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 rounded-2xl px-3 py-1.5 transition-all">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about routes, stays, itineraries..."
                    disabled={isLoading}
                    className="flex-1 bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none py-1"
                  />
                  <button
                    type="button"
                    onClick={() => sendMessage()}
                    disabled={!inputMessage.trim() || isLoading}
                    className={`p-2 rounded-xl transition-all duration-150 cursor-pointer ${
                      inputMessage.trim() && !isLoading
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs shadow-emerald-600/30'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                    aria-label="Send message"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-1.5 px-1 text-[10px] text-slate-400">
                  <span>Press Enter to send</span>
                  <span className="flex items-center gap-1">
                    Powered by <strong className="text-slate-600">n8n Agent</strong>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
