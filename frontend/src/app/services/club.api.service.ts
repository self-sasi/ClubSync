import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Club } from '../models/club';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class ClubApiService {

  private _userClubs : BehaviorSubject<Club[] | undefined> = new BehaviorSubject<Club[] | undefined>(undefined);
  private _clubs : BehaviorSubject<Club[] | undefined> = new BehaviorSubject<Club[] | undefined>(undefined);

  userClubs$ : Observable<Club[] | undefined> = this._userClubs.asObservable();
  clubs$ : Observable<Club[] | undefined> = this._clubs.asObservable();

  private http = inject(HttpClient);
  private toastService = inject(ToastService);

  constructor() {
    this.getUserClubs().subscribe({
      error : (err : Error) => {
        this.toastService.showToast('error', 'Error fetching clubs', err.message);
        this._userClubs.next(undefined);
      }
    });
   }

  getUserClubs() : Observable<Club[]> {
    return this.http.get<Club[]>('http://localhost:3000/api/clubs')
      .pipe(
        tap(response => {
          this._userClubs.next(response);
        })
      );
  }

  getClubs(universityId : number) {
    return this.http.get<Club[]>(`http://localhost:3000/api/clubs/university/${universityId}`)
    .pipe(
      tap(response => {
        this._clubs.next(response);
      })
    );
  }
}
