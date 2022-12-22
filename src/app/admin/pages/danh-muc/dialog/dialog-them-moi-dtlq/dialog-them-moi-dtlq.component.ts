import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-them-moi-dtlq',
  templateUrl: './dialog-them-moi-dtlq.component.html',
  styleUrls: ['./dialog-them-moi-dtlq.component.css'],
})
export class DialogThemMoiDtlqComponent {
  dialogAddDTLQ = new FormGroup({
    MADUONGDAY: new FormControl(this.data.id, [Validators.required]),
    MATBKHAC: new FormControl('', [Validators.required]),
    LOAITBKHAC: new FormControl('', [Validators.required]),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: {id: string}) { }

  get MATBKHAC() {
    return this.dialogAddDTLQ.get('MATBKHAC')!;
  }

  addClick(){
    console.log(this.dialogAddDTLQ.getRawValue())
  }
}
