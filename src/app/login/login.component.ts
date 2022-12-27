import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    TENTK: new FormControl('', [Validators.required,]),
    MATKHAU: new FormControl('', [Validators.required,]),
  });

  yearStr!: number;

  constructor(private _router: Router) {}

  ngOnInit(): void {
    this.yearStr = new Date().getFullYear();
  }

  onClickLogin(){
    var valueForm = this.loginForm.getRawValue();
    if(valueForm.TENTK != '' && valueForm.MATKHAU != ''){
      this._router.navigate(['/admin/dashboard']);
    }
  }
}
