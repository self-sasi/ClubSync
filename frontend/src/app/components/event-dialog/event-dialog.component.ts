import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Dialog } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { EventsApiService } from '../../services/events.api.service';
import { ToastService } from '../../services/toast.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-event-dialog',
  standalone: true,
  templateUrl: './event-dialog.component.html',
  imports: [CommonModule, Dialog, ButtonModule],
})
export class EventDialogComponent implements OnInit {
  visible = true;
  eventId!: number;
  eventData: any;

  event : any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventsApiService: EventsApiService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('eventId');
      if (id) {
        this.eventId = parseInt(id, 10);
        this.fetchEvent();
      }
    });
  }

  fetchEvent(): void {
    this.eventsApiService.getEventById(this.eventId).subscribe({
      next: (event) => {
        this.eventData = event;
        console.log("Fetched event:", this.eventData);
      },
      error: (err) => {
        this.toastService.showToast(
          'error',
          'Error Fetching Event',
          err.error?.message || err.message || 'Something went wrong'
        );
        this.closeDialog();
      }
    });
  }

  closeDialog() {
    this.router.navigate([{ outlets: { modal: null } }]);
  }

  rsvpToEvent() {
    this.eventsApiService.rsvpToEvent(this.eventId).subscribe({
      complete : () => this.fetchEvent()
    });
  }

  cancelRSVP() {
    this.eventsApiService.cancelRsvpToEvent(this.eventId).subscribe({
      complete : () => this.fetchEvent()
    });
  }
}
