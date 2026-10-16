/**
 * Dynamic Preset JSON Engine for UsahaQu / BengkelQu Master Engine v1.90
 * Provides multi-sector catalog presets, GitHub Pages auto-download compatibility,
 * and safe merging/replacing into local storage/IndexedDB without breaking DB schemas.
 */

import { Sparepart, PresetSector } from '../types';

export const PRESET_SECTORS: PresetSector[] = [
  {
    id: 'bengkel-motor',
    name: 'Bengkel Motor (Bebek, Matic, Sport)',
    sectorTag: 'Motor & Skutik',
    description: 'Suku cadang motor harian: Oli MPX, Shell Advance, kampas rem cakram, busi NGK, v-belt matic, aki kering GS, filter udara.',
    icon: 'Bike',
    itemsCount: 12,
    items: [
      {
        code: 'OIL-MPX2-01',
        name: 'Oli Mesin AHM MPX 2 Matic 0.8L',
        category: 'Oli & Pelumas',
        brand: 'AHM Genuine Oil',
        stock: 35,
        minStock: 8,
        buyPrice: 42000,
        sellPrice: 52000,
        unit: 'Botol',
        rackLocation: 'Rak OLI-1',
        supplier: 'PT Astra Motor Jawa Barat'
      },
      {
        code: 'OIL-SPX1-01',
        name: 'Oli Mesin AHM SPX 1 Full Synth 1.0L',
        category: 'Oli & Pelumas',
        brand: 'AHM Genuine Oil',
        stock: 20,
        minStock: 5,
        buyPrice: 58000,
        sellPrice: 70000,
        unit: 'Botol',
        rackLocation: 'Rak OLI-2',
        supplier: 'PT Astra Motor Jawa Barat'
      },
      {
        code: 'OIL-GR-YAM',
        name: 'Oli Gardan Yamalube Gear 100ml',
        category: 'Oli & Pelumas',
        brand: 'Yamalube',
        stock: 40,
        minStock: 10,
        buyPrice: 13000,
        sellPrice: 18000,
        unit: 'Botol',
        rackLocation: 'Rak OLI-3',
        supplier: 'PT Yamaha Motor Distributor'
      },
      {
        code: 'REM-AHM-DP',
        name: 'Kampas Rem Depan Honda Beat / Vario',
        category: 'Sistem Rem',
        brand: 'Honda Genuine Part',
        stock: 25,
        minStock: 6,
        buyPrice: 38000,
        sellPrice: 55000,
        unit: 'Set',
        rackLocation: 'Rak REM-1',
        supplier: 'PT Daya Adicipta Motora'
      },
      {
        code: 'REM-YMH-DP',
        name: 'Kampas Rem Depan Mio / NMax',
        category: 'Sistem Rem',
        brand: 'Yamaha Genuine Part',
        stock: 18,
        minStock: 5,
        buyPrice: 42000,
        sellPrice: 60000,
        unit: 'Set',
        rackLocation: 'Rak REM-2',
        supplier: 'PT Yamaha Motor Distributor'
      },
      {
        code: 'CVT-VAN-01',
        name: 'Vanbelt CVT Honda Beat ESP Ori',
        category: 'Transmisi / CVT',
        brand: 'Bando / AHM',
        stock: 14,
        minStock: 4,
        buyPrice: 85000,
        sellPrice: 120000,
        unit: 'Pcs',
        rackLocation: 'Rak CVT-1',
        supplier: 'Distributor Suku Cadang'
      },
      {
        code: 'CVT-ROL-01',
        name: 'Roller Standar Honda Vario 125 (6pcs)',
        category: 'Transmisi / CVT',
        brand: 'Honda Genuine Part',
        stock: 15,
        minStock: 4,
        buyPrice: 45000,
        sellPrice: 65000,
        unit: 'Set',
        rackLocation: 'Rak CVT-2',
        supplier: 'PT Daya Adicipta Motora'
      },
      {
        code: 'BS-NGK-CPR',
        name: 'Busi NGK CPR9EA-9 (Beat, Vario, Sonic)',
        category: 'Busi & Kelistrikan',
        brand: 'NGK Spark Plug',
        stock: 30,
        minStock: 8,
        buyPrice: 18000,
        sellPrice: 28000,
        unit: 'Pcs',
        rackLocation: 'Rak BUSI-1',
        supplier: 'Distributor Busi Resmi'
      },
      {
        code: 'AKI-GS-GTZ5S',
        name: 'Aki Kering GS Astra GTZ-5S 12V 3.5Ah',
        category: 'Busi & Kelistrikan',
        brand: 'GS Astra',
        stock: 8,
        minStock: 3,
        buyPrice: 185000,
        sellPrice: 235000,
        unit: 'Pcs',
        rackLocation: 'Rak AKI-1',
        supplier: 'PT Astra Otoparts'
      },
      {
        code: 'BAN-IRC-8090',
        name: 'Ban Luar Tubeless IRC 80/90-14 NF59',
        category: 'Ban & Velg',
        brand: 'IRC Tire',
        stock: 10,
        minStock: 3,
        buyPrice: 145000,
        sellPrice: 190000,
        unit: 'Pcs',
        rackLocation: 'Rak BAN-A',
        supplier: 'Gajah Tunggal Distributor'
      },
      {
        code: 'FLT-BEAT-01',
        name: 'Filter Udara Honda Beat FI / Scoopy',
        category: 'Filter & Karburator',
        brand: 'Honda Genuine Part',
        stock: 16,
        minStock: 5,
        buyPrice: 38000,
        sellPrice: 55000,
        unit: 'Pcs',
        rackLocation: 'Rak FLT-1',
        supplier: 'PT Daya Adicipta Motora'
      },
      {
        code: 'LAM-LED-TY',
        name: 'Bohlam Depan LED Osram T19 H6 Putih',
        category: 'Busi & Kelistrikan',
        brand: 'Osram Germany',
        stock: 22,
        minStock: 5,
        buyPrice: 35000,
        sellPrice: 50000,
        unit: 'Pcs',
        rackLocation: 'Rak ACC-1',
        supplier: 'Distributor Osram Lighting'
      }
    ]
  },
  {
    id: 'bengkel-mobil',
    name: 'Bengkel Mobil & Servis Berkala',
    sectorTag: 'Mobil & Armada',
    description: 'Suku cadang mobil: Oli mesin Fastron/Shell Helix, filter oli Sakura, kampas rem Bendix, minyak rem DOT 4, wiper blade Bosch, radiator coolant.',
    icon: 'Car',
    itemsCount: 8,
    items: [
      {
        code: 'MOB-OLI-SHL',
        name: 'Oli Mobil Shell Helix HX7 10W-40 4L',
        category: 'Oli & Pelumas',
        brand: 'Shell Helix',
        stock: 12,
        minStock: 3,
        buyPrice: 310000,
        sellPrice: 375000,
        unit: 'Galon',
        rackLocation: 'Rak MOB-OLI-1',
        supplier: 'PT Shell Indonesia Distributor'
      },
      {
        code: 'MOB-FLT-AVZ',
        name: 'Filter Oli Mesin Toyota Avanza / Xenia',
        category: 'Filter & Karburator',
        brand: 'Sakura Filter',
        stock: 24,
        minStock: 6,
        buyPrice: 28000,
        sellPrice: 45000,
        unit: 'Pcs',
        rackLocation: 'Rak MOB-FLT-1',
        supplier: 'Distributor Sakura Auto'
      },
      {
        code: 'MOB-REM-BDX',
        name: 'Kampas Rem Depan Bendix Avanza/Veloz',
        category: 'Sistem Rem',
        brand: 'Bendix Brakes',
        stock: 8,
        minStock: 2,
        buyPrice: 220000,
        sellPrice: 295000,
        unit: 'Set',
        rackLocation: 'Rak MOB-REM-1',
        supplier: 'Distributor Bendix'
      },
      {
        code: 'MOB-COL-PRE',
        name: 'Radiator Coolant Prestone 50/50 4L Hijau',
        category: 'Oli & Pelumas',
        brand: 'Prestone USA',
        stock: 15,
        minStock: 4,
        buyPrice: 85000,
        sellPrice: 115000,
        unit: 'Galon',
        rackLocation: 'Rak MOB-CHEM-1',
        supplier: 'PT Laris Chandra'
      },
      {
        code: 'MOB-BS-DEN',
        name: 'Busi Iridium Denso IKH20 (Isi 4 Pcs)',
        category: 'Busi & Kelistrikan',
        brand: 'Denso Corp',
        stock: 10,
        minStock: 2,
        buyPrice: 260000,
        sellPrice: 340000,
        unit: 'Set',
        rackLocation: 'Rak MOB-BUSI-1',
        supplier: 'PT Denso Sales Indonesia'
      },
      {
        code: 'MOB-WPR-BSC',
        name: 'Wiper Bosch Clear Advantage 16+21 inch',
        category: 'Bodi & Aksesoris',
        brand: 'Bosch Automotive',
        stock: 12,
        minStock: 3,
        buyPrice: 95000,
        sellPrice: 140000,
        unit: 'Set',
        rackLocation: 'Rak MOB-WIPER',
        supplier: 'Bosch Indonesia Distributor'
      },
      {
        code: 'MOB-FLT-CAB',
        name: 'Filter AC Kabin Karbon Avanza / Rush',
        category: 'Filter & Karburator',
        brand: 'Denso AC',
        stock: 15,
        minStock: 4,
        buyPrice: 55000,
        sellPrice: 85000,
        unit: 'Pcs',
        rackLocation: 'Rak MOB-AC',
        supplier: 'PT Denso Sales Indonesia'
      },
      {
        code: 'MOB-MIN-REM',
        name: 'Minyak Rem DOT 4 Seiken 1 Liter',
        category: 'Sistem Rem',
        brand: 'Seiken Japan',
        stock: 16,
        minStock: 4,
        buyPrice: 65000,
        sellPrice: 90000,
        unit: 'Botol',
        rackLocation: 'Rak MOB-REM-2',
        supplier: 'Distributor Seiken Indonesia'
      }
    ]
  },
  {
    id: 'toko-sparepart-mur',
    name: 'Toko Sparepart, Baut & Mur',
    sectorTag: 'Retail & Mur Baut',
    description: 'Baut baja 8.8, mur flens, ring plat, klem selang, lem paking ThreeBond, WD-40, seal tape, amplas, bearing roda 6201-6301.',
    icon: 'Wrench',
    itemsCount: 8,
    items: [
      {
        code: 'MUR-M8-FLN',
        name: 'Mur Flens Kuning M8 Kunci 12 (Pack 50)',
        category: 'Bodi & Aksesoris',
        brand: 'Fastener Tech',
        stock: 20,
        minStock: 5,
        buyPrice: 30000,
        sellPrice: 50000,
        unit: 'Pack',
        rackLocation: 'Laci BAUT-08',
        supplier: 'Toko Baut Glodok Utama'
      },
      {
        code: 'BAU-M6-20',
        name: 'Baut Blok Mesin M6x20mm Baja 8.8 (50pcs)',
        category: 'Bodi & Aksesoris',
        brand: 'Fastener Tech',
        stock: 25,
        minStock: 5,
        buyPrice: 35000,
        sellPrice: 60000,
        unit: 'Pack',
        rackLocation: 'Laci BAUT-06',
        supplier: 'Toko Baut Glodok Utama'
      },
      {
        code: 'BRG-6201-2RS',
        name: 'Bearing Roda Depan 6201-2RS SKF Ori',
        category: 'Transmisi / CVT',
        brand: 'SKF Bearings',
        stock: 28,
        minStock: 8,
        buyPrice: 22000,
        sellPrice: 35000,
        unit: 'Pcs',
        rackLocation: 'Rak BEARING-1',
        supplier: 'PT SKF Bearing Distributor'
      },
      {
        code: 'BRG-6301-2RS',
        name: 'Bearing Roda Belakang 6301-2RS Koyo',
        category: 'Transmisi / CVT',
        brand: 'Koyo Japan',
        stock: 24,
        minStock: 6,
        buyPrice: 25000,
        sellPrice: 40000,
        unit: 'Pcs',
        rackLocation: 'Rak BEARING-2',
        supplier: 'Distributor Bearing Resmi'
      },
      {
        code: 'LEM-TB-1104',
        name: 'Lem Paking Gasket ThreeBond 1104 Neo',
        category: 'Oli & Pelumas',
        brand: 'ThreeBond',
        stock: 18,
        minStock: 4,
        buyPrice: 28000,
        sellPrice: 42000,
        unit: 'Tube',
        rackLocation: 'Rak LEM-01',
        supplier: 'PT ThreeBond Distributor'
      },
      {
        code: 'WD40-SP-191',
        name: 'Cairan Pelumas Anti Karat WD-40 191ml',
        category: 'Oli & Pelumas',
        brand: 'WD-40 Company',
        stock: 20,
        minStock: 5,
        buyPrice: 38000,
        sellPrice: 52000,
        unit: 'Kaleng',
        rackLocation: 'Rak CHEM-WD',
        supplier: 'PT Indochemical Distributor'
      },
      {
        code: 'KLM-SEL-12',
        name: 'Klem Selang Bensin Stenlis 1/2 inch (20pcs)',
        category: 'Filter & Karburator',
        brand: 'Stainless Lock',
        stock: 15,
        minStock: 3,
        buyPrice: 25000,
        sellPrice: 45000,
        unit: 'Pack',
        rackLocation: 'Laci KLEM',
        supplier: 'Toko Baut Glodok Utama'
      },
      {
        code: 'AMP-NIK-800',
        name: 'Amplas Kertas Tahan Air Nikken Grit 800',
        category: 'Bodi & Aksesoris',
        brand: 'Nikken Japan',
        stock: 50,
        minStock: 10,
        buyPrice: 4000,
        sellPrice: 7000,
        unit: 'Lembar',
        rackLocation: 'Rak AMPLAS',
        supplier: 'Toko Cat & Amplas'
      }
    ]
  }
];

/**
 * Fetch Preset JSON from GitHub Pages with fallback to bundled sector data
 */
export async function fetchPresetFromGitHub(sectorId: string): Promise<PresetSector> {
  const url = `https://usahaqu.github.io/presets/${sectorId}.json`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const resp = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (resp.ok) {
      const data = await resp.json();
      if (Array.isArray(data.items) && data.items.length > 0) {
        return data as PresetSector;
      }
    }
  } catch {
    // Network or CORS error -> use bundled preset
  }

  // Fallback to local bundled sector
  const localSector = PRESET_SECTORS.find((s) => s.id === sectorId) || PRESET_SECTORS[0];
  return localSector;
}

/**
 * Apply Preset items to current spareparts safely
 * mode: 'merge' (updates existing by code, adds new) or 'replace' (replaces catalog entirely)
 */
export function applyPresetToSpareparts(
  currentParts: Sparepart[],
  presetSector: PresetSector,
  mode: 'merge' | 'replace' = 'merge'
): Sparepart[] {
  const formattedItems: Sparepart[] = presetSector.items.map((item, index) => ({
    id: `preset-${presetSector.id}-${index}-${Date.now()}`,
    code: item.code.trim().toUpperCase(),
    name: item.name.trim(),
    category: item.category,
    brand: item.brand,
    stock: item.stock,
    minStock: item.minStock,
    buyPrice: item.buyPrice,
    sellPrice: item.sellPrice,
    unit: item.unit,
    rackLocation: item.rackLocation,
    supplier: item.supplier || 'Preset Distributor UsahaQu',
    photoBase64: item.photoBase64
  }));

  if (mode === 'replace') {
    return formattedItems;
  }

  // Merge mode
  const resultMap = new Map<string, Sparepart>();
  // 1. Put current items
  currentParts.forEach((p) => {
    resultMap.set(p.code.toUpperCase(), p);
  });

  // 2. Overwrite or insert from preset
  formattedItems.forEach((p) => {
    const key = p.code.toUpperCase();
    if (resultMap.has(key)) {
      const existing = resultMap.get(key)!;
      resultMap.set(key, {
        ...existing,
        stock: existing.stock + p.stock,
        buyPrice: p.buyPrice || existing.buyPrice,
        sellPrice: p.sellPrice || existing.sellPrice,
        rackLocation: p.rackLocation || existing.rackLocation
      });
    } else {
      resultMap.set(key, p);
    }
  });

  return Array.from(resultMap.values());
}
