import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LabelDetail } from 'src/app/core/models/label-detail';
import { RoLeService } from 'src/app/core/services/ro-le.service';

@Component({
  selector: 'app-label-detail',
  templateUrl: './label-detail.component.html',
  styleUrls: ['./label-detail.component.css'],
})
export class LabelDetailComponent implements OnInit {
  @Output() formEvent = new EventEmitter<any>();

  @Input() typeForm!: string;

  public fontColorDefault = '#000000';

  public fontFamilys = [
    'Times New Roman',
    'Georgia',
    'Garamond',
    'Arial',
    'Verdana',
    'Helvetica',
    'Courier New',
    'Lucida Console',
    'Monaco',
  ];

  private _labelDefault = new LabelDetail(
    '',
    14,
    this.fontFamilys[0],
    this.fontColorDefault
  );

  public labelForm = new FormGroup({
    text: new FormControl(this._labelDefault.text),
    fontSize: new FormControl(this._labelDefault.fontSize),
    fontFamily: new FormControl(this._labelDefault.fontFamily),
    fontColor: new FormControl(this._labelDefault.fontColor),
    isBold: new FormControl(this._labelDefault.isBold),
    isItalic: new FormControl(this._labelDefault.isItalic),
  });

  public roLeForm = new FormGroup({
    MAPMIS: new FormControl(''),
    MADVQL: new FormControl(''),
    TENCONGTY: new FormControl(''),
    TRUYENTAIDIEN: new FormControl(''),
    TENROLE: new FormControl(''),
    SOHIEU: new FormControl(''),
    SOHUU: new FormControl('NPT'),
    NGAYLAPDAT: new FormControl(new Date()),
    NGAYVH: new FormControl(new Date()),
    THUOCTRAM: new FormControl(''),
    TENTRAM: new FormControl(''),
    HANGSX: new FormControl(''),
    SOSERIAL: new FormControl(''),
    SOHIEUBANVE: new FormControl(''),
    SODODANHSO: new FormControl(''),
    MACH: new FormControl(''),
    TBBAOVE: new FormControl(''),
    TUBV: new FormControl(''),
    COTTENHIENTHI: new FormControl(''),
    DAHIENTHITRENSD: new FormControl(false),
    HIENTHITEN: new FormControl(false),
    HOATDONG: new FormControl(false),
    TTHIENTAI: new FormControl('Đóng'),
    JSONGEO: new FormControl(''),
    MAUDONG: new FormControl(''),
    MAUCAT: new FormControl(''),
    DAUNOIDAU: new FormControl(''),
    DAUNOICUOI: new FormControl(''),
    GHICHU: new FormControl(''),
  });

  constructor(private _roLeService: RoLeService) {}

  ngOnInit(): void {}

  setFormDataLabel(formData: LabelDetail | null) {
    if (formData instanceof LabelDetail) {
      // Set value
      this.labelForm.patchValue({
        text: formData.text,
        fontSize: formData.fontSize,
        fontFamily: formData.fontFamily,
        fontColor: formData.fontColor,
        isBold: formData.isBold,
        isItalic: formData.isItalic,
      });
    } else {
      // Clear
      this.labelForm.patchValue({
        text: this._labelDefault.text,
        fontSize: this._labelDefault.fontSize,
        fontFamily: this._labelDefault.fontFamily,
        fontColor: this._labelDefault.fontColor,
        isBold: this._labelDefault.isBold,
        isItalic: this._labelDefault.isItalic,
      });
    }
  }

  setFormDataRole(id: string) {
    this._roLeService.getDetailRoLe(id).subscribe((client) => {
      this.roLeForm.patchValue({
        MAPMIS: client.mapmis,
        MADVQL: client.madvql,
        TENCONGTY: client.tencongty,
        TRUYENTAIDIEN: client.truyentaidien,
        TENROLE: client.tenrole,
        SOHIEU: client.sohieu,
        SOHUU: client.sohuu,
        NGAYLAPDAT: new Date(client.ngaylapdat),
        NGAYVH: new Date(client.ngayvh),
        THUOCTRAM: client.thuoctram,
        TENTRAM: client.tentram,
        HANGSX: client.hangsx,
        SOSERIAL: client.soserial,
        SOHIEUBANVE: client.sohieubanve,
        SODODANHSO: client.sododanhso,
        MACH: client.mach,
        COTTENHIENTHI: client.cottenhienthi,
        DAHIENTHITRENSD: client.dahienthitrensd == 'Y' ? true : false,
        HIENTHITEN: client.hienthiten == 'Y' ? true : false,
        HOATDONG: client.hoatdong == 'Y' ? true : false,
        TTHIENTAI: client.tthientai,
        JSONGEO: client.jsongeo,
        MAUDONG: client.maudong,
        MAUCAT: client.maucat,
        DAUNOIDAU: client.daunoidau,
        DAUNOICUOI: client.daunoicuoi,
        GHICHU: client.ghichu,
      });
    });
  }

  onDetail() {
    let formData = this.roLeForm.getRawValue();
    var url = `/admin/ro-le-detail/${formData.MAPMIS}`;
    window.open(url);
  }

  onConfirmLabel() {
    let formData = this.labelForm.getRawValue();
    this.formEvent.emit({
      isConfirm: true,
      typeForm: 'Label',
      formData: formData,
    });
  }

  onCancelLabel() {
    this.formEvent.emit({
      isConfirm: false,
      typeForm: 'Label',
      formData: null,
    });
  }

  onConfirmRole() {
    let formData = this.roLeForm.getRawValue();
    this.formEvent.emit({
      isConfirm: true,
      typeForm: 'Role',
      formData: formData,
    });
  }

  onCancelRole() {
    this.formEvent.emit({
      isConfirm: false,
      typeForm: 'Role',
      formData: null,
    });
  }
}
