import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Users, 
  Clock, 
  Calendar, 
  Shield, 
  Check, 
  CheckCircle2, 
  Camera, 
  AlertCircle, 
  UserCheck, 
  Sparkles, 
  Plus,
  Trash2,
  Lock,
  Unlock,
  Key
} from 'lucide-react';
import { 
  StaffMember, 
  StaffAttendanceRecord, 
  StaffShiftSchedule, 
  RolePermissionConfig 
} from '../../types';
import { compressImage } from '../../utils/imageCompressor';

interface StaffManagementViewProps {
  onBack: () => void;
  permissions: RolePermissionConfig[];
  onUpdatePermissions: (updated: RolePermissionConfig[]) => void;
}

const INITIAL_STAFF: StaffMember[] = [
  { id: 'stf-1', name: 'Bambang Supriyadi', role: 'owner', phone: '081234567890', pin: '8899', isActive: true, joinDate: '01 Jan 2024' },
  { id: 'stf-2', name: 'Siti Aminah', role: 'kasir', phone: '085712345678', pin: '1234', isActive: true, joinDate: '15 Feb 2024' },
  { id: 'stf-3', name: 'Agus Santoso', role: 'mekanik', phone: '087890123456', pin: '5566', isActive: true, joinDate: '01 Mar 2024' },
  { id: 'stf-4', name: 'Rian Hidayat', role: 'mekanik', phone: '089612345678', pin: '7788', isActive: true, joinDate: '10 Apr 2024' }
];

const INITIAL_SCHEDULES: StaffShiftSchedule[] = [
  { id: 'sch-1', staffId: 'stf-2', staffName: 'Siti Aminah', dayOfWeek: 'Senin - Sabtu', shift: 'Pagi', startTime: '08:00', endTime: '16:00' },
  { id: 'sch-2', staffId: 'stf-3', staffName: 'Agus Santoso', dayOfWeek: 'Senin - Sabtu', shift: 'Pagi', startTime: '08:00', endTime: '17:00' },
  { id: 'sch-3', staffId: 'stf-4', staffName: 'Rian Hidayat', dayOfWeek: 'Senin - Sabtu', shift: 'Siang', startTime: '11:00', endTime: '20:00' }
];

const INITIAL_ATTENDANCE: StaffAttendanceRecord[] = [
  {
    id: 'att-1',
    staffId: 'stf-2',
    staffName: 'Siti Aminah',
    role: 'kasir',
    date: new Date().toISOString().split('T')[0],
    timeIn: '07:55',
    timeOut: undefined,
    shift: 'Pagi',
    status: 'hadir',
    notes: 'Buka kasir & petty cash aman'
  },
  {
    id: 'att-2',
    staffId: 'stf-3',
    staffName: 'Agus Santoso',
    role: 'mekanik',
    date: new Date().toISOString().split('T')[0],
    timeIn: '08:05',
    timeOut: undefined,
    shift: 'Pagi',
    status: 'hadir',
    notes: 'Servis pit 1'
  }
];

export const StaffManagementView: React.FC<StaffManagementViewProps> = ({
  onBack,
  permissions,
  onUpdatePermissions
}) => {
  const [activeTab, setActiveTab] = useState<'absensi' | 'shift' | 'hak-akses' | 'daftar-staf'>('absensi');
  
  // Staff State
  const [staffList, setStaffList] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('uq_staff_list');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  // Attendance State
  const [attendanceRecords, setAttendanceRecords] = useState<StaffAttendanceRecord[]>(() => {
    const saved = localStorage.getItem('uq_attendance_records');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  // Schedules State
  const [shiftSchedules, setShiftSchedules] = useState<StaffShiftSchedule[]>(() => {
    const saved = localStorage.getItem('uq_shift_schedules');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULES;
  });

  // Clock In Form State
  const [selectedStaffId, setSelectedStaffId] = useState(staffList[0]?.id || '');
  const [selectedShift, setSelectedShift] = useState<'Pagi' | 'Siang' | 'Full'>('Pagi');
  const [attendanceNotes, setAttendanceNotes] = useState('');
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoSizeInfo, setPhotoSizeInfo] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  // New Staff Modal State
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'owner' | 'kasir' | 'mekanik'>('mekanik');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffPin, setNewStaffPin] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Auto Photo Compress via HTML5 Canvas
  const handlePhotoCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await compressImage(file, 300, 0.7);
      setPhotoBase64(res.base64);
      setPhotoSizeInfo(`${res.originalSizeKb} KB ➔ ${res.compressedSizeKb} KB (-${res.savedPercent}%)`);
      showToast(`Foto selfie terkompresi otomatis: ${res.compressedSizeKb} KB`);
    } catch {
      showToast('Gagal memproses foto absensi');
    }
  };

  // Clock In / Check In
  const handleClockIn = () => {
    const staff = staffList.find((s) => s.id === selectedStaffId);
    if (!staff) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const nowTimeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    // Check if already checked in today
    const existing = attendanceRecords.find(
      (a) => a.staffId === staff.id && a.date === todayStr && !a.timeOut
    );

    if (existing) {
      showToast(`${staff.name} sudah melakukan absen masuk hari ini!`);
      return;
    }

    const newRecord: StaffAttendanceRecord = {
      id: `att-${Date.now()}`,
      staffId: staff.id,
      staffName: staff.name,
      role: staff.role,
      date: todayStr,
      timeIn: nowTimeStr,
      shift: selectedShift,
      status: 'hadir',
      photoBase64: photoBase64 || undefined,
      notes: attendanceNotes || undefined
    };

    const updated = [newRecord, ...attendanceRecords];
    setAttendanceRecords(updated);
    localStorage.setItem('uq_attendance_records', JSON.stringify(updated));

    setPhotoBase64(null);
    setPhotoSizeInfo(null);
    setAttendanceNotes('');
    showToast(`✓ Absen MASUK berhasil: ${staff.name} (${nowTimeStr})`);
  };

  // Clock Out
  const handleClockOut = (recordId: string) => {
    const nowTimeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const updated = attendanceRecords.map((r) =>
      r.id === recordId ? { ...r, timeOut: nowTimeStr } : r
    );
    setAttendanceRecords(updated);
    localStorage.setItem('uq_attendance_records', JSON.stringify(updated));
    showToast(`✓ Absen PULANG tercatat: ${nowTimeStr}`);
  };

  // Add New Staff
  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim()) return;

    const newStaff: StaffMember = {
      id: `stf-${Date.now()}`,
      name: newStaffName.trim(),
      role: newStaffRole,
      phone: newStaffPhone || '08xxxxxxxx',
      pin: newStaffPin || '1234',
      isActive: true,
      joinDate: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    const updated = [...staffList, newStaff];
    setStaffList(updated);
    localStorage.setItem('uq_staff_list', JSON.stringify(updated));

    setNewStaffName('');
    setNewStaffPhone('');
    setNewStaffPin('');
    setIsAddStaffOpen(false);
    showToast(`Staf baru ditambahkan: ${newStaff.name}`);
  };

  // Toggle Role Permission
  const handleTogglePermission = (permId: string, roleKey: 'spv' | 'kasir' | 'mekanik') => {
    const updated = permissions.map((p) => {
      if (p.id === permId) {
        return { ...p, [roleKey]: !p[roleKey] };
      }
      return p;
    });
    onUpdatePermissions(updated);
    showToast('Hak akses role berhasil diperbarui!');
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
                <h1 className="text-xl font-bold tracking-tight">Manajemen Staf & Karyawan</h1>
                <span className="text-[10px] bg-white/20 text-white font-extrabold px-1.5 py-0.5 rounded">
                  v1.95
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-medium">
                Absensi Digital, Jadwal Shift & Pembatasan Hak Akses (Role Permission)
              </p>
            </div>
          </div>
        </div>

        {/* Tab Row Switcher (Minimalist Underline Style) */}
        <div className="flex items-center gap-2 mt-4 bg-emerald-800/40 p-1 rounded-xl text-xs overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('absensi')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-bold transition-all text-center cursor-pointer whitespace-nowrap ${
              activeTab === 'absensi' ? 'bg-white text-[#008952] shadow-xs' : 'text-emerald-100 hover:text-white'
            }`}
          >
            Absensi Digital
          </button>
          <button
            onClick={() => setActiveTab('shift')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-bold transition-all text-center cursor-pointer whitespace-nowrap ${
              activeTab === 'shift' ? 'bg-white text-[#008952] shadow-xs' : 'text-emerald-100 hover:text-white'
            }`}
          >
            Jadwal Shift
          </button>
          <button
            onClick={() => setActiveTab('hak-akses')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-bold transition-all text-center cursor-pointer whitespace-nowrap ${
              activeTab === 'hak-akses' ? 'bg-white text-[#008952] shadow-xs' : 'text-emerald-100 hover:text-white'
            }`}
          >
            Hak Akses Role
          </button>
          <button
            onClick={() => setActiveTab('daftar-staf')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-bold transition-all text-center cursor-pointer whitespace-nowrap ${
              activeTab === 'daftar-staf' ? 'bg-white text-[#008952] shadow-xs' : 'text-emerald-100 hover:text-white'
            }`}
          >
            Daftar Karyawan
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

        {/* ================= TAB 1: ABSENSI DIGITAL ================= */}
        {activeTab === 'absensi' && (
          <div className="space-y-4 animate-in fade-in">
            {/* Form Absensi Masuk (Model Baris Rapat / Row-based List with Underline) */}
            <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#008952]" />
                  <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Form Absen Masuk Hari Ini
                  </h2>
                </div>
                <span className="text-[11px] font-bold text-[#008952]">
                  {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>

              {/* Row List Form */}
              <div className="divide-y divide-slate-100 pt-1">
                {/* Pilih Karyawan */}
                <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-semibold text-slate-600 sm:w-1/3">
                    Nama Karyawan:
                  </label>
                  <select
                    value={selectedStaffId}
                    onChange={(e) => setSelectedStaffId(e.target.value)}
                    className="flex-1 bg-transparent border-0 border-b border-slate-300 focus:border-[#008952] focus:ring-0 py-1.5 px-0 text-xs font-bold text-slate-800 focus:outline-none"
                  >
                    {staffList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.role.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pilih Shift */}
                <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-semibold text-slate-600 sm:w-1/3">
                    Pilihan Shift Kerja:
                  </label>
                  <div className="flex-1 flex items-center gap-2">
                    {(['Pagi', 'Siang', 'Full'] as const).map((shift) => (
                      <button
                        key={shift}
                        type="button"
                        onClick={() => setSelectedShift(shift)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                          selectedShift === shift
                            ? 'bg-[#008952] text-white border-[#008952]'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {shift} ({shift === 'Pagi' ? '08:00 - 16:00' : shift === 'Siang' ? '12:00 - 20:00' : '08:00 - 20:00'})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Catatan / Kendala */}
                <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-semibold text-slate-600 sm:w-1/3">
                    Catatan Kehadiran (Opsional):
                  </label>
                  <input
                    type="text"
                    value={attendanceNotes}
                    onChange={(e) => setAttendanceNotes(e.target.value)}
                    placeholder="Contoh: Datang tepat waktu, siap jaga kasir"
                    className="flex-1 bg-transparent border-0 border-b border-slate-300 focus:border-[#008952] focus:ring-0 py-1.5 px-0 text-xs text-slate-800 focus:outline-none"
                  />
                </div>

                {/* Selfie Kamera & Auto Compress */}
                <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="sm:w-1/3">
                    <span className="text-xs font-semibold text-slate-600 block">
                      Foto Selfie / Lokasi:
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Otomatis kompres via Canvas (max 300px, 0.7)
                    </span>
                  </div>

                  <div className="flex-1 flex items-center gap-3">
                    <input
                      type="file"
                      ref={selfieInputRef}
                      accept="image/*"
                      capture="user"
                      onChange={handlePhotoCapture}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => selfieInputRef.current?.click()}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-[#008952]" />
                      <span>{photoBase64 ? 'Ganti Foto' : 'Ambil Foto Selfie'}</span>
                    </button>

                    {photoBase64 && (
                      <img
                        src={photoBase64}
                        alt="Selfie"
                        className="w-9 h-9 rounded-lg object-cover border border-emerald-300 shadow-2xs"
                      />
                    )}

                    {photoSizeInfo && (
                      <span className="text-[10px] text-emerald-700 font-bold">
                        ✓ {photoSizeInfo}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Clock In */}
              <div className="pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleClockIn}
                  className="w-full bg-[#008952] hover:bg-emerald-700 active:scale-98 text-white font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>KIRIM ABSEN MASUK SEKARANG</span>
                </button>
              </div>
            </div>

            {/* Rekap Log Absensi Hari Ini (Strict Underline List View) */}
            <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#008952]" />
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Log Absensi Karyawan Hari Ini ({attendanceRecords.length} Catatan)
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-slate-500">Live Status</span>
              </div>

              {/* Minimalist Row-based List with Underline Divider */}
              <div className="divide-y divide-slate-100">
                {attendanceRecords.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    Belum ada karyawan yang absen hari ini.
                  </div>
                ) : (
                  attendanceRecords.map((rec) => (
                    <div
                      key={rec.id}
                      className="py-3 px-1 hover:bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {rec.photoBase64 ? (
                          <img
                            src={rec.photoBase64}
                            alt={rec.staffName}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#008952] font-black text-xs flex items-center justify-center shrink-0">
                            {rec.staffName.substring(0, 2).toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900 truncate">{rec.staffName}</h4>
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                              {rec.role}
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-[#008952]">
                              Shift {rec.shift}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                            <span>Masuk: <strong className="text-slate-800">{rec.timeIn}</strong></span>
                            <span>Pulang: <strong className="text-slate-800">{rec.timeOut || '-'}</strong></span>
                            {rec.notes && <span className="italic truncate max-w-[200px]">"{rec.notes}"</span>}
                          </div>
                        </div>
                      </div>

                      {/* Action Clock Out */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {!rec.timeOut ? (
                          <button
                            type="button"
                            onClick={() => handleClockOut(rec.id)}
                            className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Absen Pulang</span>
                          </button>
                        ) : (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Selesai Shift</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: JADWAL SHIFT ================= */}
        {activeTab === 'shift' && (
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#008952]" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Jadwal Shift Kerja Karyawan
                </h3>
              </div>
              <span className="text-[11px] font-bold text-slate-500">6 Hari Kerja</span>
            </div>

            {/* List View Minimalis dengan Underline Divider */}
            <div className="divide-y divide-slate-100">
              {shiftSchedules.map((sch) => (
                <div
                  key={sch.id}
                  className="py-3 px-1 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{sch.staffName}</h4>
                    <span className="text-[11px] text-slate-500">{sch.dayOfWeek}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-2 py-1 rounded-lg bg-emerald-50 text-[#008952] border border-emerald-100">
                      Shift {sch.shift} ({sch.startTime} - {sch.endTime})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: HAK AKSES ROLE ================= */}
        {activeTab === 'hak-akses' && (
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#008952]" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Pembatasan Hak Akses (Role Permission Matrix)
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[#008952] bg-emerald-50 px-2 py-0.5 rounded">
                Owner, Kasir, Mekanik
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Atur modul mana saja yang dapat dibuka oleh tiap peran. Mekanik dibatasi hanya antrian & daftar suku cadang, kasir dapat memproses transaksi, dan owner memiliki otoritas penuh.
            </p>

            {/* Matrix List View with Underline Divider */}
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
              <div className="bg-slate-100 px-3 py-2 flex items-center justify-between text-[11px] font-bold text-slate-600 border-b border-slate-200">
                <span className="w-1/2">Hak Otoritas & Fitur</span>
                <div className="w-1/2 flex items-center justify-end gap-3 text-center">
                  <span className="w-16">Owner/SPV</span>
                  <span className="w-16">Kasir</span>
                  <span className="w-16">Mekanik</span>
                </div>
              </div>

              {permissions.map((perm) => (
                <div
                  key={perm.id}
                  className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 transition-colors"
                >
                  <div className="sm:w-1/2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-800">{perm.permissionName}</span>
                      <span className="text-[9px] bg-slate-100 text-slate-600 px-1 rounded">{perm.category}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">{perm.description}</p>
                  </div>

                  <div className="sm:w-1/2 flex items-center justify-end gap-3 shrink-0">
                    {/* SPV Toggle */}
                    <button
                      type="button"
                      onClick={() => handleTogglePermission(perm.id, 'spv')}
                      className={`w-16 py-1 rounded text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                        perm.spv ? 'bg-emerald-100 text-[#008952]' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {perm.spv ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      <span>{perm.spv ? 'Buka' : 'Kunci'}</span>
                    </button>

                    {/* Kasir Toggle */}
                    <button
                      type="button"
                      onClick={() => handleTogglePermission(perm.id, 'kasir')}
                      className={`w-16 py-1 rounded text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                        perm.kasir ? 'bg-emerald-100 text-[#008952]' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {perm.kasir ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      <span>{perm.kasir ? 'Buka' : 'Kunci'}</span>
                    </button>

                    {/* Mekanik Toggle */}
                    <button
                      type="button"
                      onClick={() => handleTogglePermission(perm.id, 'mekanik')}
                      className={`w-16 py-1 rounded text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                        perm.mekanik ? 'bg-emerald-100 text-[#008952]' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {perm.mekanik ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      <span>{perm.mekanik ? 'Buka' : 'Kunci'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: DAFTAR KARYAWAN ================= */}
        {activeTab === 'daftar-staf' && (
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#008952]" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Daftar Karyawan Aktif ({staffList.length} Orang)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddStaffOpen(true)}
                className="bg-[#008952] hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Tambah Karyawan</span>
              </button>
            </div>

            {/* Minimalist Row List with Underline Divider */}
            <div className="divide-y divide-slate-100">
              {staffList.map((staff) => (
                <div
                  key={staff.id}
                  className="py-3 px-1 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#008952] font-black text-xs flex items-center justify-center shrink-0">
                      {staff.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900">{staff.name}</h4>
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                          {staff.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span>HP: {staff.phone}</span>
                        <span>•</span>
                        <span>PIN Kasir: {staff.pin}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    Aktif
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Modal Tambah Karyawan Baru */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleCreateStaff}
            className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl border border-slate-100 space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Tambah Karyawan Baru
              </h3>
              <button
                type="button"
                onClick={() => setIsAddStaffOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="Contoh: Dedi Mulyadi"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#008952]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Peran / Role *
                </label>
                <select
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#008952]"
                >
                  <option value="mekanik">Mekanik / Teknisi</option>
                  <option value="kasir">Kasir</option>
                  <option value="owner">Owner / Supervisor</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Nomor HP WhatsApp
                </label>
                <input
                  type="text"
                  value={newStaffPhone}
                  onChange={(e) => setNewStaffPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#008952]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  PIN Otorisasi Kasir (4 Digit)
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={newStaffPin}
                  onChange={(e) => setNewStaffPin(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="1234"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold tracking-widest text-center focus:outline-none focus:border-[#008952]"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddStaffOpen(false)}
                className="flex-1 py-2 text-xs font-bold text-slate-500 rounded-xl border border-slate-200"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-2 text-xs font-bold text-white bg-[#008952] hover:bg-emerald-700 rounded-xl"
              >
                Simpan Karyawan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
