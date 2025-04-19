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

    this.getClubs().subscribe({
      error : (err : Error) => {
        this.toastService.showToast('error', 'Error fetching clubs', err.message);
        this._clubs.next(undefined);
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

  getClubs() {
    return this.http.get<Club[]>(`http://localhost:3000/api/clubs/university`)
    .pipe(
      tap(response => {
        this._clubs.next(response);
      })
    );
  }

  joinClub(clubId: number) {
    return this.http.post('http://localhost:3000/api/clubs/join', { clubId }).pipe(
      tap(() => {
        this.getClubs().subscribe();
        this.getUserClubs().subscribe();
      })
    );
  }

  leaveClub(clubId: number) {
    return this.http.delete(`http://localhost:3000/api/clubs/leave/${clubId}`).pipe(
      tap(() => {
        this.getClubs().subscribe();
        this.getUserClubs().subscribe();
      })
    );
  }

  getClub(clubId: number) {
    return this.http.get<Club>(`http://localhost:3000/api/clubs/club/${clubId}`);
  }

}
