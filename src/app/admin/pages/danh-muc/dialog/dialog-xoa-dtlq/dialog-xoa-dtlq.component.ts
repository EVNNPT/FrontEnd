import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ThietBiLienQuan, ThietBiLienQuanAdd } from 'src/app/core/models/thiet-bi-lq';
import { DuongDayService } from 'src/app/core/services/duong-day.service';

@Component({
  selector: 'app-dialog-xoa-dtlq',
  templateUrl: './dialog-xoa-dtlq.component.html',
  styleUrls: ['./dialog-xoa-dtlq.component.css']
})
export class DialogXoaDtlqComponent {
  constructor(
    private _duongDayService: DuongDayService,
    private dialogRef: MatDialogRef<DialogXoaDtlqComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { item: ThietBiLienQuanAdd }
  ) {}

  deleteClick() {
    this._duongDayService.deleteDTLienQuan(this.data.item).subscribe(
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
