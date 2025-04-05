import { inject, Injectable } from '@angular/core';
import { UserSignup } from '../models/user.signup';
import { HttpClient } from '@angular/common/http';
import { UserLogin } from '../models/user.login';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user';
import { UserResponse } from '../models/user.response';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  private _authService : AuthService = inject(AuthService);

  private _user : BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(undefined);
  user$ : Observable<User | undefined> = this._user.asObservable();

  constructor(private http : HttpClient) { }

  signup(userSignupBody : UserSignup) {
    return this.http.post('http://localhost:3000/api/auth/signup' , userSignupBody);
  }

  login(userLoginBody: UserLogin): Observable<UserResponse> {
    return this.http.post<UserResponse>('http://localhost:3000/api/auth/login', userLoginBody)
      .pipe(
        tap(response => {
          this._user.next(response.user);
          this._authService.setToken(response.token);
        })
    );
  }

  validateToken(token : string) : Observable<User> {
    return this.http.get<User>('http://localhost:3000/api/auth/validate')
      .pipe(
        tap(response => this._user.next(response))
    );
  }

}
