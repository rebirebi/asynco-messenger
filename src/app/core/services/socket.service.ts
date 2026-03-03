import { Injectable, signal, inject } from '@angular/core';
import { timestamp } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Message } from '../models/message.model';
import { generateUUID } from '../utils/uuid';
import { UserStore } from './user.store';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket | null = null;
  private readonly SERVER_URL = 'http://localhost:3000';
  protected userStore = inject(UserStore);
  // Signal to store received messages
  public messages = signal<Message[]>([]);
  // Signal that tracks connection status
  public connected = signal(false);


  constructor() {
    this.initializeSocket();
  }

  private initializeSocket(): void {
    this.socket = io(this.SERVER_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    this.setupListeners();
  }

  private setupListeners(): void {
    if (!this.socket) return;

    // Listen for incoming messages
    this.socket.on('message_received', (message: Message) => {
      console.log('Received message from server', message);

      // If the message has an id and we already have an optimistic message with
      // the same id, update that message (status/serverTimestamp) instead of
      // appending a duplicate. Otherwise append normally.
      this.messages.update((currentMessages) => {
        if (message.id) {
          const exists = currentMessages.find((m) => m.id === message.id);
          if (exists) {
            return currentMessages.map((m) => (m.id === message.id ? { ...m, ...message } : m));
          }
        }
        return [...currentMessages, message];
      });
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.connected.set(true);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.connected.set(false);
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('Connection error:', error);
      this.connected.set(false);
    });
  }
    sendMessage(messageContent: string) {
    // 1. Create the message object locally
        const optimisticMessage: Message = {
            text: messageContent,
            sender: this.userStore._currentUser() || 'Anonymous',
            id: generateUUID(),
            status: 'pending',
            timestamp: Date.now()
        };

    // 2. OPTIMISTIC UPDATE: Add it to the Signal immediately
        this.messages.update(prev => [...prev, optimisticMessage]);
        // const rollbackTimer = setTimeout(() => this.handleFailure(optimisticMessage.id, 'Server took too long to respond.'), 5000);

        // 3. Send it to the server
        if (this.socket?.connected) {
            this.socket.emit('send_message', optimisticMessage, (response: any) => {
                // 4. SERVER ACKNOWLEDGMENT (The callback)
                // Here is where we would update 'pending' to 'sent'
                this.updateMessageStatus(optimisticMessage.id, 'sent');
                // clearTimeout(rollbackTimer);
                console.log('Message sent to server:', optimisticMessage);
            });
        } else {
        console.warn('Socket not connected');
        }
    }


    private updateMessageStatus(id: string, newStatus: string) {
        this.messages.update(msgs => 
            msgs.map(m => m.id === id ? { ...m, status: newStatus as "pending" | "sent" | "delivered" | "failed" } : m)
        );
    }

    private handleFailure(id: string, reason: string) {
        console.error('Message failed:', reason);
        // Remove the failed message from the UI
        this.messages.update(msgs => msgs.filter(m => m.id !== id));
        // Alert the user (you can replace this with a nice Toast later)
        alert(`Failed to send message: ${reason}`);
    }
  /**
   * Clear all messages from the signal
   */
  clearMessages(): void {
    this.messages.set([]);
  }

  /**
   * Disconnect from the server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.connected();
  }
}
