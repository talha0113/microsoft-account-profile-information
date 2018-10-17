import { Component } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

@Component({
    selector: 'main',
    templateUrl: './main.component.html'
})
export class MainComponent {
    public title: string = 'Profile Information!';
    public isOffline: boolean = !navigator.onLine;

    constructor(private swUpdate: SwUpdate, private router: Router) { }

    ngOnInit() {
        if (this.swUpdate.isEnabled) {
            this.swUpdate.available.subscribe((value) => {
                if (confirm("A newer application version is available. Load New Version?")) {
                    window.location.reload();
                }
            });
        }

        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                this.isOffline = !navigator.onLine;
            }
        });
    }
}
