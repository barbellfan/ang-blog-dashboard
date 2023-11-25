import { Injectable } from '@angular/core';
import { Auth, getAuth, signInWithEmailAndPassword } from '@angular/fire/auth'
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth, private toaster: ToastrService, private router: Router) { }

  login(email: string, password: string) {

    signInWithEmailAndPassword(getAuth(), email, password).then(logRef => {
      this.toaster.success('Logged in successfully');
      this.router.navigate(['/']);
    }).catch(error => {
      this.toaster.warning(error.message);
    });
  }
}
