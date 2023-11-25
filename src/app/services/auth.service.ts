import { Injectable } from '@angular/core';
import { Auth, getAuth, signInWithEmailAndPassword } from '@angular/fire/auth'
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth, private toaster: ToastrService) { }

  login(email: string, password: string) {

    signInWithEmailAndPassword(getAuth(), email, password).then(logRef => {
      this.toaster.success('Logged in successfully');
    }).catch(error => {
      this.toaster.error(`Error logging in: ${error}`);
    });
  }
}
