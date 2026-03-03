import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SocketService } from './core/services/socket.service';
import { UserStore } from './core/services/user.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [RouterOutlet],
  styleUrl: './app.scss',
  template:`
    @if (!userStore.currentUser()) {
      <div class="login-overlay">
        <input #nameInput type="text" placeholder="Enter your name...">
        <button (click)="userStore.setUser(nameInput.value)">Join Chat</button>
      </div>
    } @else {
      <div class="chat-container">
        </div>
    }
  `
})
export class App {
  protected readonly title = signal('asynco-messenger');
  // protected socketService = inject (SocketService);
  // protected socketservicemessages = this.socketService.messages;

  public userStore = inject(UserStore);

  // sendTest() {
  //   this.socketService.sendMessage("Hello from Angular!");
  //   console.log('Test message sent to server',  this.socketService);
  // }
}
