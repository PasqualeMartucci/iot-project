import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Plugins } from '@capacitor/core';
import { Observable } from 'rxjs';
const { Storage } = Plugins;

@Injectable({
    providedIn: 'root'
})
export class UserPreferencesService {
    private OnDarkModeChange: BehaviorSubject<boolean>;
    readonly darkMode: Observable<boolean>;

    constructor() {
        this.OnDarkModeChange = new BehaviorSubject(window.matchMedia('(prefers-color-scheme: dark)').matches);
        this.darkMode = this.OnDarkModeChange.asObservable();
        Storage.get({ key: 'dark-theme' }).then(item => {
            const enabled = JSON.parse(item.value) || false;
            document.body.classList.toggle('dark', enabled);
            this.OnDarkModeChange.next(enabled);
        })
    }

    setDarkMode(enabled: boolean) {
        Storage.set({ key: 'dark-theme', value: JSON.stringify(enabled) });
        document.body.classList.toggle('dark', enabled);
        this.OnDarkModeChange.next(enabled);
    }
}