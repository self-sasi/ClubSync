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
import { Dialog } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [CommonModule, AccordionModule, FormsModule, InputGroup, InputGroupAddonModule, InputTextModule, ButtonModule, MenuModule, Dialog, SelectButtonModule],
  templateUrl: './announcements.component.html',
  styleUrl: './announcements.component.css'
})
export class AnnouncementsComponent implements OnChanges {

  @Input() clubId: number | undefined;

  announcements: any[] = [];
  private subscription: Subscription | null = null;

  newMessageContent: { [channelId: number]: string } = {};
  newCommentContent: { [messageId: number]: string } = {};

  showCreateChannelDialog: boolean = false;

  newChannel = {
    ChannelName: '',
    Description: ''
  };

  announcementId: number | undefined;

  showCommentDialog: boolean = false;
  selectedMessageId: number | null = null;
  selectedMessageContent: string = '';
  newCommentText: string = '';

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

  createChannel() {
    if (!this.clubId || !this.announcementId || !this.newChannel.ChannelName.trim() || !this.newChannel.Description.trim()) return;

    this.announcementsApiService.createDiscussionChannel({
      clubId: this.clubId,
      announcementId: this.announcementId,
      channelName: this.newChannel.ChannelName.trim(),
      description: this.newChannel.Description.trim()
    }).subscribe({
      complete: () => {
        this.resetChannelForm();
        this.showCreateChannelDialog = false;
      }
    });
  }


  showChanelForm(announcementId : number) {
    this.showCreateChannelDialog = true;
    this.announcementId = announcementId;
  }

  resetChannelForm() {
    this.newChannel = { ChannelName: '', Description: '' };
    this.announcementId = undefined;
  }

  sendMessage(channelId: number): void {
    const content = this.newMessageContent[channelId]?.trim();

    if (!content || !this.clubId) return;

    this.announcementsApiService.postMessage({
      channelId: channelId,
      content: content,
      clubId: this.clubId
    }).subscribe({
      complete: () => {
        this.newMessageContent[channelId] = '';
      }
    });
  }

  sendComment(messageId: number): void {
    const content = this.newCommentContent[messageId]?.trim();
    if (content) {
      console.log(`Add comment to message ${messageId}:`, content);
      // Call service here...
      this.newCommentContent[messageId] = '';
    }
  }

  openCommentDialog(messageId: number, content: string) {
    this.selectedMessageId = messageId;
    this.selectedMessageContent = content;
    this.showCommentDialog = true;
  }

  resetCommentDialog() {
    this.showCommentDialog = false;
    this.selectedMessageId = null;
    this.selectedMessageContent = '';
    this.newCommentText = '';
  }

  submitComment() {
    if (!this.clubId || !this.selectedMessageId || !this.newCommentText.trim()) return;

    this.announcementsApiService.postComment({
      messageId: this.selectedMessageId,
      content: this.newCommentText.trim(),
      clubId: this.clubId
    }).subscribe({
      complete: () => {
        this.resetCommentDialog();
      }
    });
  }

}
