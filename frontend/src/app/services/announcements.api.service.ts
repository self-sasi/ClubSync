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

  createAnnouncement(announcementData: { clubId: number; eventId: number; content: string }) {
    return this.http.post(`${this.baseUrl}/create`, announcementData).pipe(
      tap({
        next: () => {
          this.toastService.showToast('success', 'Announcement Posted', 'Your announcement was successfully created.');
          this.fetchAnnouncementDetails(announcementData.clubId);
        },
        error: err => {
          this.toastService.showToast('error', 'Failed to Post', err.error?.message || err.message || 'Something went wrong.');
        }
      })
    );
  }

  createDiscussionChannel(channelData: { announcementId: number; channelName: string; description: string; clubId: number }) {
    return this.http.post(`${this.baseUrl}/discussion/create`, channelData).pipe(
      tap({
        next: () => {
          this.toastService.showToast('success', 'Channel Created', 'Your discussion channel was successfully created.');
          this.fetchAnnouncementDetails(channelData.clubId);
        },
        error: err => {
          this.toastService.showToast('error', 'Failed to Create Channel', err.error?.message || err.message || 'Something went wrong.');
        }
      })
    );
  }

  postMessage(messageData: { channelId: number; content: string; clubId: number }) {
    return this.http.post(`${this.baseUrl}/discussion/message`, messageData).pipe(
      tap({
        next: () => {
          this.toastService.showToast('success', 'Message Sent', 'Your message was posted successfully.');
          this.fetchAnnouncementDetails(messageData.clubId);
        },
        error: err => {
          this.toastService.showToast('error', 'Failed to Post Message', err.error?.message || err.message || 'Something went wrong.');
        }
      })
    );
  }


}
