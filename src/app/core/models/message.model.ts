export interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: number;
  status?: 'pending' | 'sent' | 'delivered' | 'failed';
  serverTimestamp?: string;
}