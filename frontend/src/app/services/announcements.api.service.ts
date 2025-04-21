import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementsApiService {

  private baseUrl = 'http://localhost:3000/api/announcements';

  private _announcements = new BehaviorSubject<any[] | null>(null);
  public announcements$ = this._announcements.asObservable();

  constructor(private http: HttpClient, private toastService: ToastService) {}

  fetchAnnouncementDetails(clubId: number): void {
    this.http.get<any[]>(`${this.baseUrl}/club/${clubId}`).subscribe({
      next: (data) => this._announcements.next(data),
      error: (err) => {
        this.toastService.showToast(
          'error',
          'Failed to Load Announcements',
          err.error?.message || err.message || 'Something went wrong.'
        );
        this._announcements.next([]);
      }
    });
  }

  refresh(clubId: number): void {
    this.fetchAnnouncementDetails(clubId);
  }
}
