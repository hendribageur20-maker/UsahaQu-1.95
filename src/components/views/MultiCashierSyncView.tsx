import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Wifi, 
  Monitor, 
  Smartphone, 
  Server, 
  Radio, 
  RefreshCw, 
  CheckCircle2, 
  Tv, 
  Copy, 
  Check, 
  Terminal,
  Maximize2
} from 'lucide-react';
import { WorkshopProfile, MultiCashierDevice } from '../../types';

interface MultiCashierSyncViewProps {
  onBack: () => void;
  profile: WorkshopProfile;
  isDesktopLayout: boolean;
  onToggleDesktopLayout: () => void;
}

const INITIAL_DEVICES: MultiCashierDevice[] = [
  {
    id: 'dev-master',
    deviceName: 'Kasir Utama (POS Server)',
    ipAddress: '192.168.1.100',
    port: 8080,
    isMaster: true,
    lastSync: 'Baru saja',
    status: 'connected',
    role: 'Server Utama'
  },
  {
    id: 'dev-client-1',
    deviceName: 'Tablet Kasir Depan / POS 2',
    ipAddress: '192.168.1.104',
    port: 8080,
    isMaster: false,
    lastSync: '2 menit lalu',
    status: 'connected',
    role: 'Terminal Kasir 2'
  },
  {
    id: 'dev-client-2',
    deviceName: 'HP Android Mekanik Pit 1',
    ipAddress: '192.168.1.112',
    port: 8080,
    isMaster: false,
    lastSync: '5 menit lalu',
    status: 'connected',
    role: 'Input Jasa & Part'
  }
];

export const MultiCashierSyncView: React.FC<MultiCashierSyncViewProps> = ({
  onBack,
  profile,
  isDesktopLayout,
  onToggleDesktopLayout
}) => {
  const [devices, setDevices] = useState<MultiCashierDevice[]>(() => {
    const saved = localStorage.getItem('uq_multi_cashier_devices');
    return saved ? JSON.parse(saved) : INITIAL_DEVICES;
  });

  const [localIp, setLocalIp] = useState('192.168.1.100');
  const [port, setPort] = useState(8080);
  const [deviceRole, setDeviceRole] = useState<'master' | 'client'>('master');
  const [pairingToken, setPairingToken] = useState('UQ-LAN-8899');
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [customerDisplayOpen, setCustomerDisplayOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('uq_multi_cashier_devices', JSON.stringify(devices));
  }, [devices]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyPairingToken = async () => {
    try {
      await navigator.clipboard.writeText(`http://${localIp}:${port}?token=${pairingToken}`);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    } catch {}
  };

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const updated = devices.map((d) => ({ ...d, lastSync: 'Baru saja', status: 'connected' as const }));
      setDevices(updated);
      showToast('✓ Sinkronisasi Wi-Fi LAN antar perangkat berhasil (0.04s latency)');
    }, 800);
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
                <h1 className="text-xl font-bold tracking-tight">Multi Kasir & Desktop Ready</h1>
                <span className="text-[10px] bg-white/20 text-white font-extrabold px-1.5 py-0.5 rounded">
                  v1.95
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-medium">
                Koneksi LAN / Wi-Fi Lokal & Tata Letak Adaptif Desktop
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTriggerSync}
            disabled={isSyncing}
            className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Sinkron...' : 'Sinkron LAN'}</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="mx-4 mt-3 p-3 bg-emerald-100 border border-emerald-300 text-[#008952] text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 p-4 max-w-4xl mx-auto w-full space-y-4 overflow-y-auto">

        {/* 1. Pengaturan Jaringan Lokal Wi-Fi (List View Minimalis dengan Underline Divider) */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-[#008952]" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Konfigurasi Jaringan Lokal (Wi-Fi LAN)
              </h2>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Offline-First (Tanpa Kuota)</span>
            </span>
          </div>

          {/* Model Baris Rapat / Row-based with Underline */}
          <div className="divide-y divide-slate-100 pt-1">
            {/* Peran Perangkat */}
            <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-semibold text-slate-600 sm:w-1/3">
                Peran Perangkat Ini:
              </label>
              <div className="flex-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDeviceRole('master')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                    deviceRole === 'master'
                      ? 'bg-[#008952] text-white border-[#008952]'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <Server className="w-3.5 h-3.5" />
                  <span>Master Server (Pusat DB)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceRole('client')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                    deviceRole === 'client'
                      ? 'bg-[#008952] text-white border-[#008952]'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Client POS Terminal</span>
                </button>
              </div>
            </div>

            {/* IP Address & Port */}
            <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-semibold text-slate-600 sm:w-1/3">
                Alamat IP Lokal & Port:
              </label>
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={localIp}
                  onChange={(e) => setLocalIp(e.target.value)}
                  className="w-36 bg-transparent border-0 border-b border-slate-300 focus:border-[#008952] focus:ring-0 py-1 px-0 text-xs font-mono font-bold text-slate-800 focus:outline-none"
                />
                <span className="text-xs text-slate-400 font-mono">:</span>
                <input
                  type="number"
                  value={port}
                  onChange={(e) => setPort(Number(e.target.value))}
                  className="w-20 bg-transparent border-0 border-b border-slate-300 focus:border-[#008952] focus:ring-0 py-1 px-0 text-xs font-mono font-bold text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            {/* Token Pairing */}
            <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-semibold text-slate-600 sm:w-1/3">
                Token Pairing Wi-Fi:
              </label>
              <div className="flex-1 flex items-center gap-2">
                <span className="text-xs font-mono font-black text-[#008952] bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                  {pairingToken}
                </span>
                <button
                  type="button"
                  onClick={handleCopyPairingToken}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedToken ? 'Tersalin' : 'Salin URL Pairing'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Daftar Perangkat Terhubung (List View Minimalis dengan Underline Divider) */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#008952]" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Terminal Kasir Terhubung ({devices.length} Perangkat)
              </h3>
            </div>
            <span className="text-[10px] font-bold text-slate-500">Wi-Fi Subnet 192.168.1.x</span>
          </div>

          {/* Model Baris Rapat / Row-based with Underline */}
          <div className="divide-y divide-slate-100">
            {devices.map((dev) => (
              <div
                key={dev.id}
                className="py-3 px-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    dev.isMaster ? 'bg-emerald-100 text-[#008952]' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {dev.isMaster ? <Server className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{dev.deviceName}</h4>
                      {dev.isMaster && (
                        <span className="text-[9px] font-extrabold bg-[#008952] text-white px-1.5 py-0.2 rounded">
                          HOST
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                      <span>{dev.ipAddress}:{dev.port}</span>
                      <span>•</span>
                      <span>{dev.role}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="text-[11px] text-slate-500">
                    Sinkron: <strong className="text-slate-700">{dev.lastSync}</strong>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                    <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                    <span>Aktif</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Pengaturan Tata Letak Desktop & Layar Ganda Kasir */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-[#008952]" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Mode Tampilan Desktop & Layar Pelanggan (Dual Display)
              </h3>
            </div>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
              Desktop POS
            </span>
          </div>

          <div className="divide-y divide-slate-100 pt-1">
            {/* Toggle Full Desktop Layout */}
            <div className="py-3 flex items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-slate-800">
                  Mode Layar Penuh Desktop (Electron / Browser Lebar)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Mengembangkan layout menjadi 2-3 kolom tanpa frame ponsel, cocok untuk layar monitor kasir.
                </p>
              </div>
              <button
                type="button"
                onClick={onToggleDesktopLayout}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isDesktopLayout
                    ? 'bg-[#008952] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>{isDesktopLayout ? 'Aktif (Desktop)' : 'Aktifkan'}</span>
              </button>
            </div>

            {/* Dual Screen Customer Display */}
            <div className="py-3 flex items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-slate-800">
                  Layar Tambahan Pelanggan (Customer Display Window)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Buka jendela preview kedua menghadap konsumen untuk rincian belanja dan total nota saat kasir scan barang.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCustomerDisplayOpen(!customerDisplayOpen)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Tv className="w-3.5 h-3.5 text-[#008952]" />
                <span>{customerDisplayOpen ? 'Tutup Layar' : 'Buka Layar Pelanggan'}</span>
              </button>
            </div>
          </div>

          {/* Customer Display Mock */}
          {customerDisplayOpen && (
            <div className="mt-3 p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 animate-in fade-in space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
                  CUSTOMER FACING DISPLAY • {profile.workshopName}
                </span>
                <span className="text-[10px] text-slate-400">Siap Melayani</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">TOTAL PEMBAYARAN</span>
                  <span className="text-2xl font-black text-emerald-400">Rp 175.000</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">METODE PEMBAYARAN</span>
                  <span className="text-xs font-bold text-white bg-slate-800 px-2.5 py-1 rounded-md">QRIS / TUNAI</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
