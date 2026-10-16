import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  MessageSquare, 
  Bot, 
  User, 
  Loader2,
  BookOpen
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  suggestedAction?: {
    label: string;
    url?: string;
  };
}

interface CustomerCareAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  workshopName?: string;
}

const QUICK_PROMPTS = [
  'Rem depan berdecit dan kurang pakem saat hujan',
  'Rekomendasi oli & viskositas matic 125cc harian',
  'Motor brebet saat tarikan gas awal dari RPM rendah',
  'Cara input stok suku cadang & foto kompres otomatis',
  'Panduan cetak struk kasir via printer bluetooth'
];

export const CustomerCareAIModal: React.FC<CustomerCareAIModalProps> = ({
  isOpen,
  onClose,
  workshopName = 'Bengkel Qu'
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Halo! Saya Customer Care AI Assistant untuk ${workshopName}. Siap membantu diagnosa teknis kendaraan konsumen, saran suku cadang, hingga panduan operasional Master Engine UsahaQu.`,
      time: 'Baru Saja',
      suggestedAction: {
        label: 'Buka Panduan Web UsahaQu',
        url: 'https://usahaqu.github.io/panduan'
      }
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleShareGuideLink = async () => {
    const shareUrl = 'https://usahaqu.github.io/panduan';
    const shareData = {
      title: 'Panduan Operasional UsahaQu Master Engine',
      text: `Pelajari tutorial penggunaan UsahaQu / BengkelQu v1.95 untuk operasional toko dan bengkel Anda: ${shareUrl}`,
      url: shareUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {}
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    } catch {}
  };

  const getSmartLocalResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('rem') || q.includes('decit') || q.includes('cakram')) {
      return `[DIAGNOSA REM]:\n1. Periksa ketebalan kampas rem (disarankan ganti bila sisa <1.5mm).\n2. Bersihkan piringan cakram dari debu asbes atau minyak menggunakan brake cleaner.\n3. Periksa pin kaliper dan berikan grease silikon khusus rem agar kaliper tidak macet.\nSuku Cadang Rekomendasi: Kampas rem genuine / aftermarket standar (Bendix/Daytona) dan minyak rem DOT 4.`;
    }

    if (q.includes('oli') || q.includes('viskositas') || q.includes('pelumas')) {
      return `[REKOMENDASI OLI]:\n• Matic 110-125cc (Beat, Vario, Mio): Gunakan SAE 10W-30 JASO MB (kapasitas 0.65L - 0.8L).\n• Matic 150-160cc (NMax, PCX, Aerox): Gunakan SAE 10W-40 JASO MB sintetis (0.9L - 1.0L).\n• Jangan lupa ganti Oli Gardan / Gear Oil setiap 2x ganti oli mesin.`;
    }

    if (q.includes('brebet') || q.includes('ngempos') || q.includes('busi') || q.includes('cvt')) {
      return `[DIAGNOSA MOTOR BREBET]:\n1. Cek kondisi elektroda busi (ganti jika celah sudah lebih dari 0.9mm atau berkerak hitam pekat).\n2. Cek filter udara, ganti jika sudah tersumbat debu (filter kertas tidak boleh dicuci bensin).\n3. Lakukan pembersihan Throttle Body / Karburator dan cek filter bensin (fuel pump strainer).\n4. Pada motor matic, bersihkan debu mangkok kopling CVT dan periksa roller.`;
    }

    if (q.includes('stok') || q.includes('foto') || q.includes('kompres') || q.includes('kamera')) {
      return `[FITUR INPUT STOK & AUTO COMPRESS]:\nBuka Menu Inventaris ➔ Penerimaan Barang. Ambil foto menggunakan tombol kamera. Master Engine UsahaQu otomatis mengompres foto ke resolusi 300px JPEG kualitas 0.7 lewat HTML5 Canvas. Ukuran berkas terpangkas hingga 90% sehingga database lokal IndexedDB tetap enteng dan bebas lag.`;
    }

    if (q.includes('struk') || q.includes('printer') || q.includes('bluetooth') || q.includes('nota')) {
      return `[PANDUAN CETAK STRUK]:\n1. Hidupkan printer thermal bluetooth 58mm / 80mm.\n2. Tautkan Bluetooth pada pengaturan Android HP Anda.\n3. Di kasir setelah proses pembayaran, klik 'Cetak Struk Thermal' atau bagikan bukti pembayaran dalam bentuk tautan digital WhatsApp.`;
    }

    return `Terima kasih atas pertanyaannya mengenai "${query}".\nUntuk operasional bengkel terstandar, pastikan selalu mencatat antrian di modul Antrian Servis, catat part yang terpakai agar stok gudang otomatis terpotong saat kasir memproses nota. Anda juga dapat membaca tutorial lengkap di panduan web kami.`;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    let replyContent = '';

    // Check Gemini API key availability
    const apiKey = typeof process !== 'undefined' && process.env ? process.env.GEMINI_API_KEY : '';

    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Anda adalah AI Customer Care dan Teknisi Senior untuk aplikasi UsahaQu / BengkelQu Core v1.95 di ${workshopName}. 
Jawablah dengan ringkas, ramah, padat teknis, dan berikan langkah taktis perbaikan motor/mobil atau panduan operasional kasir.
Pertanyaan pengguna: ${text}`
                }
              ]
            }
          ]
        });

        replyContent = response.text || getSmartLocalResponse(text);
      } catch {
        replyContent = getSmartLocalResponse(text);
      }
    } else {
      // Local immediate smart mechanic expert engine
      await new Promise((r) => setTimeout(r, 450));
      replyContent = getSmartLocalResponse(text);
    }

    const assistantMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'assistant',
      text: replyContent,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      suggestedAction: {
        label: 'Buka Panduan Web UsahaQu',
        url: 'https://usahaqu.github.io/panduan'
      }
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg h-[92vh] max-h-[640px] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header - Row Underline Style */}
        <div className="bg-[#008952] text-white px-4 py-3 flex items-center justify-between border-b border-emerald-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm tracking-tight">Customer Care AI</h3>
                <span className="text-[10px] bg-white/20 text-white font-extrabold px-1.5 py-0.5 rounded">v1.95</span>
              </div>
              <p className="text-[11px] text-emerald-100">Bantuan Pintar Operasional & Diagnosa Bengkel</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleShareGuideLink}
              title="Share Link Panduan Web"
              className="px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copiedShare ? <Check className="w-3.5 h-3.5 text-white" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedShare ? 'Tersalin!' : 'Share Panduan'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Guide Strip (Underline Divider) */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <BookOpen className="w-3.5 h-3.5 text-[#008952]" />
            <span>Dokumentasi Resmi:</span>
            <a
              href="https://usahaqu.github.io/panduan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#008952] font-bold hover:underline flex items-center gap-0.5"
            >
              usahaqu.github.io/panduan
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <button
            type="button"
            onClick={handleShareGuideLink}
            className="text-[11px] text-slate-500 hover:text-slate-800 font-semibold cursor-pointer flex items-center gap-1"
          >
            <Copy className="w-3 h-3" />
            <span>Copy Link</span>
          </button>
        </div>

        {/* Chat History List (Clean Underline Row-based Layout) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
          {messages.map((msg) => {
            const isAI = msg.sender === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isAI ? 'justify-start' : 'justify-end'}`}
              >
                {isAI && (
                  <div className="w-7 h-7 rounded-full bg-[#008952] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs shadow-2xs ${
                  isAI
                    ? 'bg-white text-slate-800 border-b border-slate-200'
                    : 'bg-[#008952] text-white'
                }`}>
                  <div className="flex items-center justify-between gap-3 mb-1 text-[10px] opacity-70">
                    <span className="font-bold">{isAI ? 'Asisten Bengkel' : 'Anda'}</span>
                    <span>{msg.time}</span>
                  </div>

                  <p className="whitespace-pre-line leading-relaxed font-normal">
                    {msg.text}
                  </p>

                  {msg.suggestedAction && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <a
                        href={msg.suggestedAction.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-[#008952] hover:underline flex items-center gap-1"
                      >
                        <span>{msg.suggestedAction.label}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                {!isAI && (
                  <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-2.5 rounded-xl border-b border-slate-200 max-w-[220px]">
              <Loader2 className="w-4 h-4 animate-spin text-[#008952]" />
              <span className="font-medium">Menganalisa solusi...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Suggestion Chips (Horizontal Underline Row) */}
        <div className="px-3 py-2 bg-white border-t border-b border-slate-200 overflow-x-auto scrollbar-none flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 shrink-0 uppercase tracking-wider flex items-center gap-1">
            <MessageSquare className="w-3 h-3 text-[#008952]" />
            Prompt:
          </span>
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="shrink-0 text-[11px] font-medium bg-slate-100 hover:bg-emerald-50 hover:text-[#008952] text-slate-700 px-2.5 py-1 rounded-lg transition-colors border border-slate-200 cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar (Minimalist Row with Underline style) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tanyakan keluhan motor, oli, stok atau operasional..."
            className="flex-1 bg-transparent border-0 border-b border-slate-300 focus:border-[#008952] focus:ring-0 rounded-none py-2 px-1 text-xs text-slate-800 placeholder-slate-400 font-medium transition-colors focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="bg-[#008952] hover:bg-emerald-700 disabled:opacity-40 active:scale-95 text-white p-2.5 rounded-xl transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
