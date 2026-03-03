import { Routes } from '@angular/router';
import { ChatComponent } from './features/workspace/components/chat.component';

export const routes: Routes = [
    { path: '', component: ChatComponent },
    { path: 'chat', component: ChatComponent }
];
