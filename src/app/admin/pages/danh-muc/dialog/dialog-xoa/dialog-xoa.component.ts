import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DuongDayService } from 'src/app/core/services/duong-day.service';
import { MayBienApService } from 'src/app/core/services/may-bien-ap.service';
import { RoLeService } from 'src/app/core/services/ro-le.service';
import { ThanhCaiService } from 'src/app/core/services/thanh-cai.service';

@Component({
  selector: 'app-dialog-xoa',
  templateUrl: './dialog-xoa.component.html',
  styleUrls: ['./dialog-xoa.component.css'],
})
export class DialogXoaComponent {
  constructor(
    private _duongDayService: DuongDayService,
    private _mayBienApService: MayBienApService,
    private _roLeService: RoLeService,
    private _thanhCaiService: ThanhCaiService,
    private dialogRef: MatDialogRef<DialogXoaComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { idDDay: string; idMBA: string; idRL: string; idTC: string }
  ) {}

  deleteClick() {
    if (this.data.idDDay != '') {
      this._duongDayService.deleteDuongDay(this.data.idDDay).subscribe(
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
    } else if (this.data.idMBA != '') {
      this._mayBienApService.deleteMayBienAp(this.data.idMBA).subscribe(
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
    } else if (this.data.idRL != '') {
      this._roLeService.deleteRoLe(this.data.idRL).subscribe(
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
    } else if (this.data.idTC != '') {
      this._thanhCaiService.deleteThanhCai(this.data.idTC).subscribe(
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
