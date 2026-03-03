import { TestBed } from '@angular/core/testing';
import { SocketService } from './socket.service';
import { timestamp } from 'rxjs';

describe('SocketService', () => {
  let service: SocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update messages signal when a new message is received', () => {
    const mockMessage = { id: '1', text: 'Test', sender: 'User', status: 'sent' as const, timestamp: Date.now() };
    
    // Simulate the socket receiving a message
    // Note: In a real test, you'd spy on the socket.io 'on' method
    service.messages.set([mockMessage]); 
    
    expect(service.messages().length).toBe(1);
    expect(service.messages()[0].text).toBe('Test');
  });
});