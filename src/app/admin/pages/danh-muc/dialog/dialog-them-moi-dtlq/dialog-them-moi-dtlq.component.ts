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
  ThietBiLienQuan,
} from 'src/app/core/models/thiet-bi-lq';
import { GetDataTestService } from 'src/app/core/services/get-data-test.service';

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
    MATBKHAC: new FormControl({value: '', disabled: true}, [Validators.required]),
    LOAITBKHAC: new FormControl('', [Validators.required,]),
  });
  matcher = new MyErrorStateMatcher();

  constructor(
    private dialogRef: MatDialogRef<DialogThemMoiDtlqComponent>,
    private getDataTestService: GetDataTestService,
    @Inject(MAT_DIALOG_DATA) public data: { id: string }
  ) {}

  changeLoaiTB(event: any) {
    this.dataCombo = [];
    if (event.value == 'MBA') {
      this.getDataTestService.listMBA().subscribe((client) => {
        client.forEach(element => {
          var customObj = new ComboThietBiLienQuan();
          customObj.MATHIETBI = element.MAPMIS;
          customObj.TENTHIETBI = element.TENMBA;
          this.dataCombo.push(customObj);
        });
        this.dialogAddDTLQ.controls['MATBKHAC'].enable();
      });
    } else if (event.value == 'RL') {
      this.getDataTestService.listRL().subscribe((client) => {
        client.forEach(element => {
          var customObj = new ComboThietBiLienQuan();
          customObj.MATHIETBI = element.MAPMIS;
          customObj.TENTHIETBI = element.TENROLE;
          this.dataCombo.push(customObj);
        });
        this.dialogAddDTLQ.controls['MATBKHAC'].enable();
      });
    } else{
      this.dialogAddDTLQ.controls['MATBKHAC'].disable();
    }
  }

  addClick() {
    var a = this.dialogAddDTLQ.getRawValue().MADUONGDAY;
    var b = this.dialogAddDTLQ.getRawValue().LOAITBKHAC;
    var c = this.dialogAddDTLQ.getRawValue().MATBKHAC;
    if (a != '' && b != '' && c != '') {
      this.dialogRef.close();
    }
  }
}
