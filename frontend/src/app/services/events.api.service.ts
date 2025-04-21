import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class EventsApiService {

  private baseUrl = 'http://localhost:3000/api';

  private _rsvpEvents = new BehaviorSubject<any[] | null>(null);
  rsvpEvents$ = this._rsvpEvents.asObservable();

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
          this.fetchRSVPEvents();
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
          this.fetchRSVPEvents();
        },
        error: (err) => {
          this.toastService.showToast('error', 'Cancellation Failed', err.error?.message || err.message || 'An error occurred');
        }
      })
    );
  }

  createEvent(eventData: { clubId: number; name: string; eventDate: string; location: string }) {
    return this.http.post(`${this.baseUrl}/events/event/create`, eventData).pipe(
      tap({
        next: () => {
          this.toastService.showToast('success', 'Event Created', 'The event was created successfully.');
        },
        error: (err) => {
          this.toastService.showToast(
            'error',
            'Event Creation Failed',
            err.error?.message || err.message || 'Something went wrong while creating the event.'
          );
        }
      })
    );
  }

  getUserEvents() {
    return this.http.get<any[]>(`${this.baseUrl}/events/user-events`);
  }

  fetchRSVPEvents(): void {
    this.http.get<any[]>(`${this.baseUrl}/events/rsvp`).subscribe({
      next: (events) => this._rsvpEvents.next(events),
      error: (err) => {
        this.toastService.showToast('error', 'Error fetching RSVP events', err.message);
        this._rsvpEvents.next([]);
      }
    });
  }
}
