export class DuongDayList {
  MAPMIS: string = '';
  TENDUONGDAY: string = '';
  TENCONGTY: string = '';
  TRUYENTAIDIEN: string = '';
  CAPDA: string = '';
}

export class DuongDayDetail {
  Mapmis: string | null | undefined;
  Id: string | null | undefined;
  Tenduongday: string | null | undefined;
  Madvql: string | null | undefined;
  Tencongty: string | null | undefined;
  Truyentaidien: string | null | undefined;
  Capda: string | null | undefined;
  Sohieu: string | null | undefined;
  Sohuu: string | null | undefined;
  Ngaylapdat: Date | null | undefined;
  Ngayvh: Date | null | undefined;
  Tutram: string | null | undefined;
  Tentutram: string | null | undefined;
  Dentram: string | null | undefined;
  Tendentram: string | null | undefined;
  Sohieubanve: string | null | undefined;
  Sododanhso: string | null | undefined;
  Mach: string | null | undefined;
  Cottenhienthi: string | null | undefined;
  Dahienthitrensd: string | null | undefined;
  Hienthiten: string | null | undefined;
  Hoatdong: string | null | undefined;
  Tthientai: string | null | undefined;
  Jsongeo: string | null | undefined;
  Maudong: string | null | undefined;
  Maucat: string | null | undefined;
  Daunoidau: string | null | undefined;
  Daunoicuoi: string | null | undefined;
  Ghichu: string | null | undefined;
  constructor(init?: Partial<DuongDayDetail>) {
    Object.assign(this, init);
  }
}