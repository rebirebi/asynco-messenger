import { Component, computed, inject, signal, ViewChild, ElementRef, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../../../../app/core/services/socket.service';
import { Message } from '../../../core/models/message.model';
import { generateUUID } from '../../../core/utils/uuid';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent {
  protected socketService = inject(SocketService);
  @ViewChild('messagesContainer') messagesContainer!: ElementRef<HTMLDivElement>;
  
  // Input state
  messageText = signal('');
  
  // Expose messages from the service
  public messages = this.socketService.messages;
  
  // Computed property to check connection status
  isConnected = computed(() => this.socketService.isConnected());
  
  // Current user
  currentUser = signal('Me');
  
  constructor() {
    // Auto-scroll when messages update
    effect(() => {
      this.messages();
      setTimeout(() => this.scrollToBottom(), 0);
    });
  }

  formatTime(timestamp: number | undefined): string {
    if (timestamp === undefined) {
      return '';
    }
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  getStatusIcon(status: string | undefined): string {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'failed':
        return '✗';
      default:
        return '';
    }
  }

  getStatusClass(status: string | undefined): string {
    switch (status) {
      case 'pending':
        return 'status--pending';
      case 'delivered':
        return 'status--delivered';
      case 'failed':
        return 'status--failed';
      default:
        return '';
    }
  }
  
  sendMessage(): void {
    const text = this.messageText().trim();
    if (!text) return;
    
    const optimisticMessage: Message = {
      id: generateUUID(),
      text,
      sender: this.currentUser(),
      status: 'pending' as const,
      timestamp: Date.now()
    };
    
    this.socketService.messages.update(msgs => [...msgs, optimisticMessage]);
    this.socketService.sendMessage(optimisticMessage.text);
    this.messageText.set('');
  }
  
  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const container = this.messagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    }
  }
}
