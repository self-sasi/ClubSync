import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnouncementsApiService } from '../../services/announcements.api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './announcements.component.html',
  styleUrl: './announcements.component.css'
})
export class AnnouncementsComponent implements OnChanges {

  @Input() clubId: number | undefined;

  announcements: any[] = [];
  private subscription: Subscription | null = null;

  constructor(private announcementsApiService: AnnouncementsApiService) {}

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['clubId'] && this.clubId) {
      this.announcementsApiService.fetchAnnouncementDetails(this.clubId);

      if (this.subscription) {
        this.subscription.unsubscribe();
      }

      this.subscription = this.announcementsApiService.announcements$.subscribe(data => {
        this.announcements = data ?? [];
      });
    }
  }

  test() {
    console.log(this.announcements)
  }
}
