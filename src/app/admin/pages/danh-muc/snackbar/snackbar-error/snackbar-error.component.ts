import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar-error',
  templateUrl: './snackbar-error.component.html',
  styleUrls: ['./snackbar-error.component.css'],
})
export class SnackbarErrorComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string }) {}
}
