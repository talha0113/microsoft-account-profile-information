import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
    selector: 'main',
    templateUrl: './main.component.html'
})
export class MainComponent {
    public title: string = 'Profile Information!';
    public isOffline: boolean = !navigator.onLine;

    constructor(private swUpdate: SwUpdate) { }

    ngOnInit() {
        if (this.swUpdate.isEnabled) {
            this.swUpdate.available.subscribe((value) => {
                if (confirm("A newer application version is available. Load New Version?")) {
                    window.location.reload();
                }
            });
        }
    }
}
