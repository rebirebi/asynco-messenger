import { Injectable,signal } from "@angular/core";

@Injectable({providedIn: 'root'})
export class UserStore {
    public _currentUser = signal<string|null>(null);
    
    setUser(name: string) {
        this._currentUser.set(name);
    }
}