import { Component, OnInit } from '@angular/core';
import { EventsApiService } from '../../services/events.api.service';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-events.component.html',
  styleUrl: './all-events.component.css'
})
export class AllEventsComponent implements OnInit {
  userEvents: any[] = [];

  constructor(
    private eventsApiService: EventsApiService,
    private toastService: ToastService,
    private router : Router
  ) {}

  ngOnInit(): void {
    this.eventsApiService.getUserEvents().subscribe({
      next: (events) => {
        this.userEvents = events;
        console.log('Fetched user events:', this.userEvents);
      },
      error: (err) => {
        this.toastService.showToast(
          'error',
          'Error Fetching Events',
          err.error?.message || err.message || 'Something went wrong'
        );
      }
    });
  }

  openEventDialog(eventId: number): void {
    this.router.navigate([{ outlets: { modal: ['event', eventId] } }]);
  }

}
