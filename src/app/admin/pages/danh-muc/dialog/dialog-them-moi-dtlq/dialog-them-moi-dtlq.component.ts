import { Component, Inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  ComboThietBiLienQuan,
  ThietBiLienQuanAdd,
} from 'src/app/core/models/thiet-bi-lq';
import { DuongDayService } from 'src/app/core/services/duong-day.service';
import { MayBienApService } from 'src/app/core/services/may-bien-ap.service';
import { RoLeService } from 'src/app/core/services/ro-le.service';
import { ThanhCaiService } from 'src/app/core/services/thanh-cai.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-dialog-them-moi-dtlq',
  templateUrl: './dialog-them-moi-dtlq.component.html',
  styleUrls: ['./dialog-them-moi-dtlq.component.css'],
})
export class DialogThemMoiDtlqComponent {
  dataCombo: ComboThietBiLienQuan[] = [];

  dialogAddDTLQ = new FormGroup({
    MADUONGDAY: new FormControl(this.data.id, [Validators.required]),
    MATBKHAC: new FormControl({ value: '', disabled: true }, [
      Validators.required,
    ]),
    LOAITBKHAC: new FormControl('', [Validators.required]),
  });
  matcher = new MyErrorStateMatcher();

  constructor(
    private dialogRef: MatDialogRef<DialogThemMoiDtlqComponent>,
    private _duongDayService: DuongDayService,
    private _mayBienApService: MayBienApService,
    private _roLeService: RoLeService,
    private _thanhCaiService: ThanhCaiService,
    @Inject(MAT_DIALOG_DATA) public data: { id: string }
  ) {}

  changeLoaiTB(event: any) {
    this.dataCombo = [];
    if (event.value == 'MayBienAp') {
      this._mayBienApService.getDSMayBienAp().subscribe((client) => {
        for (var i = 0; i < client.length; i++) {
          var customObj = new ComboThietBiLienQuan();
          customObj.MATHIETBI = client[i].mapmis;
          customObj.TENTHIETBI = client[i].tenmba;
          this.dataCombo.push(customObj);
        }
        this.dialogAddDTLQ.controls['MATBKHAC'].enable();
      });
    } else if (event.value == 'RoLe') {
      this._roLeService.getDSRoLe().subscribe((client) => {
        for (var i = 0; i < client.length; i++) {
          var customObj = new ComboThietBiLienQuan();
          customObj.MATHIETBI = client[i].mapmis;
          customObj.TENTHIETBI = client[i].tenrole;
          this.dataCombo.push(customObj);
        }
        this.dialogAddDTLQ.controls['MATBKHAC'].enable();
      });
    } else if (event.value == 'ThanhCai') {
      this._thanhCaiService.getDSThanhCai().subscribe((client) => {
        for (var i = 0; i < client.length; i++) {
          var customObj = new ComboThietBiLienQuan();
          customObj.MATHIETBI = client[i].mapmis;
          customObj.TENTHIETBI = client[i].tenthanhcai;
          this.dataCombo.push(customObj);
        }
        this.dialogAddDTLQ.controls['MATBKHAC'].enable();
      });
    } else {
      this.dialogAddDTLQ.controls['MATBKHAC'].disable();
    }
  }

  addClick() {
    var a = this.dialogAddDTLQ.getRawValue().MADUONGDAY;
    var b = this.dialogAddDTLQ.getRawValue().LOAITBKHAC;
    var c = this.dialogAddDTLQ.getRawValue().MATBKHAC;
    if (a != '' && b != '' && c != '') {
      var item = this.dialogAddDTLQ.getRawValue();
      var itemAdd: ThietBiLienQuanAdd = new ThietBiLienQuanAdd();
      itemAdd.Loaitbkhac = item.LOAITBKHAC;
      itemAdd.Maduongday = item.MADUONGDAY;
      itemAdd.Matbkhac = item.MATBKHAC;
      this._duongDayService.addDTLienQuan(itemAdd).subscribe(
        (result) => {
          if (result.fail) {
            console.log(result.message);
          } else {
            console.log(result.message);
            this.dialogRef.close();
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
}
