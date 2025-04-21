import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class EventsApiService {

  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient,
              private toastService : ToastService) {}

  getClubEvents(clubId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/clubs/club/${clubId}/events`);
  }

  getEventById(eventId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/events/event/${eventId}`);
  }

  rsvpToEvent(eventId: number) {
    return this.http.post(`${this.baseUrl}/events/event/${eventId}/rsvp`, {}).pipe(
      tap({
        next: () => {
          this.toastService.showToast('success', 'RSVP Confirmed', 'You have successfully RSVP’d for this event.');
        },
        error: (err) => {
          this.toastService.showToast('error', 'RSVP Failed', err.error?.message || err.message || 'An error occurred');
        }
      })
    );
  }

  cancelRsvpToEvent(eventId: number) {
    return this.http.delete(`${this.baseUrl}/events/event/${eventId}/rsvp`).pipe(
      tap({
        next: () => {
          this.toastService.showToast('info', 'RSVP Cancelled', 'You have successfully cancelled your RSVP.');
        },
        error: (err) => {
          this.toastService.showToast('error', 'Cancellation Failed', err.error?.message || err.message || 'An error occurred');
        }
      })
    );
  }

}
