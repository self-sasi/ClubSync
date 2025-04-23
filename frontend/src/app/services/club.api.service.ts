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

  getClubMembers(clubId : number) {
    return this.http.get(`http://localhost:3000/api/clubs/club/${clubId}/members`);
  }

  createClub(clubData: { clubName: string; description: string }) {
    return this.http.post('http://localhost:3000/api/clubs/create', clubData).pipe(
      tap({
        next: () => {
          this.toastService.showToast('success', 'Club Created', 'Your club has been successfully created.');
        },
        error: (err) => {
          this.toastService.showToast('error', 'Creation Failed', err.message);
        },
        complete: () => {
          this.getClubs().subscribe();
          this.getUserClubs().subscribe();
        }
      })
    );
  }

  removeMember(memberId: number, clubId: number) {
    return this.http.delete(`http://localhost:3000/api/clubs/member/${memberId}/${clubId}`).pipe(
      tap({
        next: () => {
          this.toastService.showToast('success', 'Member Removed', 'The member was removed from the club.');
          this.getClubMembers(clubId).subscribe();
        },
        error: (err) => {
          this.toastService.showToast('error', 'Remove Failed', err.error?.message || err.message);
        }
      })
    );
  }

  promoteToAdmin(memberId: number, clubId: number) {
    return this.http.put(`http://localhost:3000/api/clubs/promote/${memberId}/${clubId}`, {}).pipe(
      tap({
        next: () => {
          this.toastService.showToast('success', 'Promotion Successful', 'The member was promoted to admin.');
          this.getClubMembers(clubId).subscribe();
        },
        error: (err) => {
          this.toastService.showToast('error', 'Promotion Failed', err.error?.message || err.message);
        }
      })
    );
  }

  updateClub(clubId: number, updateData: { ClubName: string; Description: string }) {
    return this.http.put(`http://localhost:3000/api/clubs/${clubId}`, updateData).pipe(
      tap({
        next: () => {
          this.toastService.showToast('success', 'Club Updated', 'The club was successfully updated.');
          this.getClubs().subscribe();
          this.getUserClubs().subscribe();
        },
        error: (err) => {
          this.toastService.showToast('error', 'Update Failed', err.error?.message || err.message);
        }
      })
    );
  }


}
