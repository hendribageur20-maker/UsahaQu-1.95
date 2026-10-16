import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  ArrowLeft, 
  QrCode, 
  Download, 
  Printer, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Globe, 
  ShoppingBag, 
  Phone, 
  Eye, 
  Sparkles,
  Info
} from 'lucide-react';
import { WorkshopProfile, Sparepart } from '../../types';

interface MarketingQRKatalogViewProps {
  onBack: () => void;
  profile: WorkshopProfile;
  spareparts: Sparepart[];
}

export const MarketingQRKatalogView: React.FC<MarketingQRKatalogViewProps> = ({
  onBack,
  profile,
  spareparts
}) => {
  const defaultSlug = (profile.workshopName || 'bengkel-qu')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const [shopSlug, setShopSlug] = useState(defaultSlug || 'toko-berkah');
  const [catalogUrl, setCatalogUrl] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [tableNumber, setTableNumber] = useState('01');
  const [showWebPreview, setShowWebPreview] = useState(false);

  useEffect(() => {
    const fullUrl = `https://usahaqu.github.io/${shopSlug || 'katalog'}`;
    setCatalogUrl(fullUrl);

    // Generate high resolution QR code via qrcode library
    QRCode.toDataURL(
      fullUrl,
      {
        width: 400,
        margin: 2,
        color: {
          dark: '#008952',
          light: '#FFFFFF'
        }
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, [shopSlug]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(catalogUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleShareLink = async () => {
    const shareData = {
      title: `Katalog Online Resmi - ${profile.workshopName}`,
      text: `Lihat daftar suku cadang, oli dan estimasi biaya servis di ${profile.workshopName}: ${catalogUrl}`,
      url: catalogUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {}
    }

    handleCopyLink();
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QR-Katalog-${shopSlug}.png`;
    a.click();
  };

  const handlePrintFlyer = () => {
    window.print();
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      {/* Header - Row Underline Style */}
      <div className="bg-[#008952] text-white px-5 pt-4 pb-5 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              aria-label="Kembali"
              className="w-10 h-10 rounded-full bg-white/15 active:bg-white/30 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight">Marketing QR Katalog</h1>
                <span className="text-[10px] bg-white/20 text-white font-extrabold px-1.5 py-0.5 rounded">
                  v1.95
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-medium">
                Generator QR Code Mandiri usahaqu.github.io/[nama-toko]
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowWebPreview(!showWebPreview)}
            className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>{showWebPreview ? 'Tutup Preview' : 'Live Preview'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 max-w-4xl mx-auto w-full space-y-4 overflow-y-auto">
        
        {/* URL Configuration (List View Minimalis dengan Underline Divider) */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#008952]" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Pengaturan Tautan Tampilan Mandiri
              </h2>
            </div>
            <span className="text-[11px] font-bold text-[#008952] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              Auto Sync
            </span>
          </div>

          {/* Row-based inputs with underline styling */}
          <div className="divide-y divide-slate-100 pt-1">
            <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-semibold text-slate-600 sm:w-1/3">
                Slug / Alamat Toko:
              </label>
              <div className="flex-1 flex items-center gap-1 border-b border-slate-300 focus-within:border-[#008952] py-1 transition-colors">
                <span className="text-xs text-slate-400 font-mono select-none">usahaqu.github.io/</span>
                <input
                  type="text"
                  value={shopSlug}
                  onChange={(e) => setShopSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="nama-toko"
                  className="flex-1 bg-transparent text-xs font-bold text-[#008952] focus:outline-none"
                />
              </div>
            </div>

            <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-semibold text-slate-600 sm:w-1/3">
                Nomor Meja / Stand Display (Opsional):
              </label>
              <div className="flex-1 border-b border-slate-300 focus-within:border-[#008952] py-1 transition-colors">
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="Contoh: Meja 01 / Display Depan"
                  className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="py-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 truncate">
                <span className="text-xs font-mono text-slate-700 truncate font-semibold">
                  {catalogUrl}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleShareLink}
                  className="px-2.5 py-1 bg-[#008952] hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share WA</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Card & Printable Tent Card Flyer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card Preview */}
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-100 flex flex-col items-center text-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Scan QR Code untuk Buka Katalog Mandiri
            </span>

            {/* Flyer Frame for print / table stand */}
            <div className="w-full max-w-[280px] bg-white rounded-2xl p-4 border-2 border-emerald-500 shadow-md flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#008952] font-black text-sm flex items-center justify-center mb-1">
                BQ
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                {profile.workshopName}
              </h3>
              <p className="text-[10px] text-slate-500 mb-2">
                {tableNumber ? `Stand / Meja #${tableNumber}` : 'Katalog Mandiri'}
              </p>

              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR Code Katalog"
                  className="w-48 h-48 rounded-xl object-contain border border-slate-100 shadow-2xs"
                />
              ) : (
                <div className="w-48 h-48 bg-slate-100 rounded-xl flex items-center justify-center text-xs text-slate-400">
                  Membuat QR...
                </div>
              )}

              <div className="mt-3 text-center">
                <span className="text-[11px] font-bold text-[#008952] block">
                  Scan via Kamera HP
                </span>
                <span className="text-[9px] font-mono text-slate-500 block truncate max-w-[240px]">
                  {catalogUrl}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 mt-4 w-full">
              <button
                type="button"
                onClick={handleDownloadQR}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#008952]" />
                <span>Unduh Gambar (.PNG)</span>
              </button>
              <button
                type="button"
                onClick={handlePrintFlyer}
                className="flex-1 bg-[#008952] hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Stand Meja</span>
              </button>
            </div>
          </div>

          {/* Information & Integration Checklist */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-200">
                <Sparkles className="w-4 h-4 text-[#008952]" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Keunggulan Katalog QR Mandiri
                </h3>
              </div>

              {/* Minimalist row list with underline divider */}
              <div className="divide-y divide-slate-100 text-xs text-slate-600 mt-1">
                <div className="py-2.5 flex items-start gap-2">
                  <span className="text-[#008952] font-black shrink-0">01.</span>
                  <div>
                    <strong className="text-slate-800 font-semibold block">Akses Tanpa Perlu Install Aplikasi</strong>
                    <span className="text-[11px] text-slate-500">
                      Konsumen cukup scan barcode dengan kamera bawaan smartphone mereka untuk melihat ketersediaan stok & harga suku cadang secara real-time.
                    </span>
                  </div>
                </div>

                <div className="py-2.5 flex items-start gap-2">
                  <span className="text-[#008952] font-black shrink-0">02.</span>
                  <div>
                    <strong className="text-slate-800 font-semibold block">Otomatis Terhubung ke WhatsApp Kasir</strong>
                    <span className="text-[11px] text-slate-500">
                      Tersedia tombol satu-klik "Pesan / Konsultasi WA" yang langsung membuka chat nomor kasir bengkel: {profile.phone || '08xxxxxxxx'}.
                    </span>
                  </div>
                </div>

                <div className="py-2.5 flex items-start gap-2">
                  <span className="text-[#008952] font-black shrink-0">03.</span>
                  <div>
                    <strong className="text-slate-800 font-semibold block">Format Ringan & Ramah Kuota</strong>
                    <span className="text-[11px] text-slate-500">
                      Halaman web berbasis GitHub Pages super cepat dan gambar telah terkompresi otomatis sehingga hemat kuota data pelanggan.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
              <span className="font-bold text-[#008952]">
                Jumlah Part Siap Tayang: {spareparts.length} Item
              </span>
              <button
                type="button"
                onClick={() => setShowWebPreview(true)}
                className="text-[#008952] font-black hover:underline flex items-center gap-1"
              >
                <span>Lihat Tampilan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview Modal / Section */}
        {showWebPreview && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#008952]" />
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Simulasi Tampilan Katalog Konsumen (usahaqu.github.io/{shopSlug})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowWebPreview(false)}
                className="text-xs text-slate-400 hover:text-slate-700 font-bold"
              >
                Tutup
              </button>
            </div>

            {/* Compact Underline List View of Spareparts */}
            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-2">
              {spareparts.slice(0, 15).map((part) => (
                <div key={part.id} className="py-2.5 px-2 hover:bg-slate-50 flex items-center justify-between gap-3 transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {part.photoBase64 ? (
                      <img
                        src={part.photoBase64}
                        alt={part.name}
                        className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#008952] flex items-center justify-center shrink-0 font-bold text-[10px]">
                        PART
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-slate-400">{part.code}</span>
                        <span className="text-[9px] bg-slate-100 text-slate-600 px-1 rounded">{part.brand}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 truncate">{part.name}</h4>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-[#008952] block">
                      Rp {part.sellPrice.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Stok: {part.stock} {part.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                Hubungi bengkel langsung via WhatsApp:
              </span>
              <a
                href={`https://wa.me/${(profile.phone || '6281234567890').replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(profile.workshopName)},%20saya%20ingin%20tanya%20suku%20cadang%20dan%20servis`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#008952] text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 hover:bg-emerald-700 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Chat WhatsApp Bengkel</span>
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
