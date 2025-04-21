import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnouncementsApiService } from '../../services/announcements.api.service';
import { Subscription } from 'rxjs';
import { AccordionModule } from 'primeng/accordion';
import { FormsModule } from '@angular/forms';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [CommonModule, AccordionModule, FormsModule, InputGroup, InputGroupAddonModule, InputTextModule, ButtonModule, MenuModule],
  templateUrl: './announcements.component.html',
  styleUrl: './announcements.component.css'
})
export class AnnouncementsComponent implements OnChanges {

  @Input() clubId: number | undefined;

  announcements: any[] = [];
  private subscription: Subscription | null = null;

  newMessageContent: { [channelId: number]: string } = {};
newCommentContent: { [messageId: number]: string } = {};

sendMessage(channelId: number): void {
  const content = this.newMessageContent[channelId]?.trim();
  if (content) {
    console.log(`Send message to channel ${channelId}:`, content);
    // Call service here...
    this.newMessageContent[channelId] = '';
  }
}

sendComment(messageId: number): void {
  const content = this.newCommentContent[messageId]?.trim();
  if (content) {
    console.log(`Add comment to message ${messageId}:`, content);
    // Call service here...
    this.newCommentContent[messageId] = '';
  }
}

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
