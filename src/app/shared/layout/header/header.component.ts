import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  constructor(private _router: Router) {}

  openDashboard() {
    this._router.navigate(['/admin/dashboard']);
  }

  openMBA() {
    this._router.navigate(['/admin/may-bien-ap-list']);
  }

  openRL() {
    this._router.navigate(['/admin/ro-le-list']);
  }

  openDD() {
    this._router.navigate(['/admin/duong-day-list']);
  }

  openTC() {
    this._router.navigate(['/admin/thanh-cai-list']);
  }

  openDiagramView() {
    this._router.navigate(['/diagram/view']);
  }

  openDiagramEdit() {
    this._router.navigate(['/diagram/edit']);
  }

  logoutWeb() {
    this._router.navigate(['/login']);
  }
}
