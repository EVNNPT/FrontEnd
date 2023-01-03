import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ThietBiLienQuan,
  ThietBiLienQuanAdd,
} from 'src/app/core/models/thiet-bi-lq';
import { DuongDayService } from 'src/app/core/services/duong-day.service';
import { SnackbarErrorComponent } from '../../snackbar/snackbar-error/snackbar-error.component';
import { SnackbarOkComponent } from '../../snackbar/snackbar-ok/snackbar-ok.component';

@Component({
  selector: 'app-dialog-xoa-dtlq',
  templateUrl: './dialog-xoa-dtlq.component.html',
  styleUrls: ['./dialog-xoa-dtlq.component.css'],
})
export class DialogXoaDtlqComponent {
  constructor(
    private _duongDayService: DuongDayService,
    public snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<DialogXoaDtlqComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { item: ThietBiLienQuanAdd }
  ) {}

  deleteClick() {
    this._duongDayService.deleteDTLienQuan(this.data.item).subscribe(
      (result) => {
        if (result.fail) {
          this.snackBar.openFromComponent(SnackbarErrorComponent, {
            data: { message: result.message },
          });
        } else {
          this.snackBar.openFromComponent(SnackbarOkComponent, {
            data: { message: result.message },
          });
          this.dialogRef.close();
        }
      },
      (err) => {
        this.snackBar.openFromComponent(SnackbarErrorComponent, {
          data: { message: err },
        });
      }
    );
  }
}
