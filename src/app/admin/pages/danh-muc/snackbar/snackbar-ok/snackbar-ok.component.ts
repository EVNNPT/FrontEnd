import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar-ok',
  templateUrl: './snackbar-ok.component.html',
  styleUrls: ['./snackbar-ok.component.css'],
})
export class SnackbarOkComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string }) {}
}
