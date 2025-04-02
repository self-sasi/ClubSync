import { Injectable } from '@angular/core';
import { UserSignup } from '../models/user.signup';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  constructor(private http : HttpClient) { }

  signup(userSignupBody : UserSignup) {
    return this.http.post('http://localhost:3000/api/auth/signup' , userSignupBody);
  }
}
