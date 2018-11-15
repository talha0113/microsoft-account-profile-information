import { Component } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

import { NotificationService } from '../../Services/notification.service';
import { PushService } from '../../Services/push.service';

@Component({
    selector: 'main',
    templateUrl: './main.component.html'
})
export class MainComponent {
    public title: string = 'Profile Information!';
    public isOffline: boolean = !navigator.onLine;
    public offlineNotificationDone: boolean = false;
    public notificationsSubscribed: boolean = false;
    public hideSubscription: boolean = false;
    private newVersionMessage: string = "A newer application version is available. Load New Version?";


    constructor(private swUpdate: SwUpdate, private router: Router, private notificationService: NotificationService, private pushService: PushService) { }

    ngOnInit() {
        this.isOffline = !navigator.onLine;
this.hideSubscription = this.notificationService.isDenied;
        if (!this.isOffline) {
            this.pushService.isSubscribed.subscribe((value: boolean) => {
                this.notificationsSubscribed = value;
                if (this.swUpdate.isEnabled) {
                    this.swUpdate.available.subscribe(() => {
                        if (value && this.notificationService.isSupportNotification) {
                            this.notificationService.generalNotification(this.newVersionMessage, () => {
                                window.location.reload();
                            });
                        }
                        else {
                            if (confirm(this.newVersionMessage)) {
                                window.location.reload();
                            }
                        }
                    });
                }
            });
        }

        //https://www.bartvanuden.com/2018/01/23/push-notifications-to-your-pwa-with-asp-net-core-2-0-and-aurelia/
        //https://github.com/yashints/Angular-PWA

        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                this.isOffline = !navigator.onLine;
                if (this.isOffline && !this.offlineNotificationDone) {
                    this.offlineNotificationDone = true;
                    this.notificationService.offline();
                }
            }
        });
    }

    subscriptionChanged(): void {

        if (!this.isOffline) {
            if (this.notificationsSubscribed) {
                this.pushService.subscribe().subscribe((value: boolean) => {
                    this.notificationsSubscribed = value;
                }, (error) => {
                    this.notificationsSubscribed = !this.notificationsSubscribed;
                    this.hideSubscription = true;
                });
            }
            else {
                this.pushService.unSubscribe.subscribe();
            }
        }

    }
}
