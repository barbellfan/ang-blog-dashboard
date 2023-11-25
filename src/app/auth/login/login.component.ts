import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {

  }

  onSubmit(form: NgForm) {
    //console.log(form.controls['email'].value);
    //console.log(form.controls['password'].value);

    this.authService.login(form.controls['email'].value, form.controls['password'].value);
  }

}
