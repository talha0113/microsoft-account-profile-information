import { Component, OnInit, inject } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import {
  SwUpdate,
  VersionEvent,
  VersionReadyEvent,
} from '@angular/service-worker';
import { filter, map, switchMap } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';

import { NotificationService } from '../../Services/notification.service';
import { PushService } from '../../Services/push.service';
import { Version } from 'Source/Models/version.model';
import { VersionConstant } from 'Source/Constants/version.constant';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
})
export class MainComponent implements OnInit {
  private translocoService = inject(TranslocoService);
  private swUpdate = inject(SwUpdate);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private pushService = inject(PushService);

  public title: string = 'Profile Information!';
  public isOffline: boolean = !navigator.onLine;
  public offlineNotificationDone: boolean = false;
  public notificationsSubscribed: boolean = false;
  public isSubscriptionInProgress: boolean = false;
  public hideSubscription: boolean = false;

  ngOnInit() {
    this.isOffline = !navigator.onLine;
    this.hideSubscription = this.notificationService.isDenied;
    if (!this.isOffline) {
      this.pushService.isSubscribed.subscribe((value: boolean) => {
        this.notificationsSubscribed = value;
        if (this.swUpdate.isEnabled) {
          this.swUpdate.versionUpdates
            .pipe(
              filter(
                (
                  versionEvent: VersionEvent
                ): versionEvent is VersionReadyEvent =>
                  versionEvent.type === 'VERSION_READY'
              ),
              map((versionReadyEvent: VersionReadyEvent) => ({
                type: 'UPDATE_AVAILABLE',
                current: versionReadyEvent.currentVersion,
                available: versionReadyEvent.latestVersion,
              }))
            )
            .subscribe(versionData => {
              const applicationVersionInformationNew: Version = <Version>(
                versionData.available.appData
              );
              const applicationVersionInformationOld: Version = <Version>(
                versionData.current.appData
              );
              if (applicationVersionInformationOld == null) {
                applicationVersionInformationOld.version = '0.0.0';
              }
              applicationVersionInformationNew.message =
                applicationVersionInformationNew.message
                  .replace(
                    VersionConstant.versionOld,
                    applicationVersionInformationOld.version
                  )
                  .replace(
                    VersionConstant.versionNew,
                    applicationVersionInformationNew.version
                  );
              if (value && this.notificationService.isSupportNotification) {
                this.notificationService.generalNotification(
                  applicationVersionInformationNew.message,
                  () => {
                    window.location.reload();
                  }
                );
              } else {
                if (confirm(applicationVersionInformationNew.message)) {
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
      this.isSubscriptionInProgress = true;
      if (this.notificationsSubscribed) {
        this.pushService
          .subscribe()
          .pipe(
            switchMap(() => {
              return this.pushService.updateLangauge(
                this.translocoService.getActiveLang()
              );
            })
          )
          .subscribe({
            next: (value: boolean) => {
              this.notificationsSubscribed = value;
              this.isSubscriptionInProgress = false;
            },
            error: error => {
              console.log(error);
              this.notificationsSubscribed = !this.notificationsSubscribed;
              this.hideSubscription = true;
              this.isSubscriptionInProgress = false;
            },
          });
      } else {
        this.pushService.unSubscribe.subscribe({
          next: () => {
            this.isSubscriptionInProgress = false;
            window.location.reload();
          },
        });
      }
    }
  }
}
