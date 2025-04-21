import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsApiService } from '../../services/events.api.service';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-rsvp-events',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './rsvp-events.component.html',
  styleUrl: './rsvp-events.component.css'
})
export class RSVPEventsComponent implements OnInit {

  rsvpEvents: any[] = [];

  constructor(
    private eventsApiService: EventsApiService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.eventsApiService.rsvpEvents$.subscribe(events => {
      this.rsvpEvents = events ?? [];
    });

    this.eventsApiService.fetchRSVPEvents();
  }

  openEventDialog(eventId: number) {
    this.router.navigate([{ outlets: { modal: ['event', eventId] } }]);
  }
}
