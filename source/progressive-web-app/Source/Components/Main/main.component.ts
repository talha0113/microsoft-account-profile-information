import { Component, OnInit, OnDestroy, signal, effect } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import {
  SwUpdate,
  VersionEvent,
  VersionReadyEvent,
} from '@angular/service-worker';
import { filter, map, switchMap, takeUntil } from 'rxjs';
import { Subject } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { toSignal } from '@angular/core/rxjs-interop';

import { NotificationService } from '../../Services/notification.service';
import { PushService } from '../../Services/push.service';
import { Version } from 'Source/Models/version.model';
import { VersionConstant } from 'Source/Constants/version.constant';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  standalone: false,
})
export class MainComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  public title: string = 'Profile Information!';
  public isOffline = signal(!navigator.onLine);
  public offlineNotificationDone = signal(false);
  public notificationsSubscribed = signal(false);
  public isSubscriptionInProgress = signal(false);
  public hideSubscription = signal(false);

  constructor(
    private translocoService: TranslocoService,
    private swUpdate: SwUpdate,
    private router: Router,
    private notificationService: NotificationService,
    private pushService: PushService
  ) {}

  ngOnInit() {
    this.isOffline.set(!navigator.onLine);
    this.hideSubscription.set(this.notificationService.isDenied);
    
    if (!this.isOffline()) {
      this.pushService.isSubscribed
        .pipe(takeUntil(this.destroy$))
        .subscribe((value: boolean) => {
          this.notificationsSubscribed.set(value);
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
                })),
                takeUntil(this.destroy$)
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

    this.router.events
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: Event) => {
        if (event instanceof NavigationEnd) {
          this.isOffline.set(!navigator.onLine);
          if (this.isOffline() && !this.offlineNotificationDone()) {
            this.offlineNotificationDone.set(true);
            this.notificationService.offline();
          }
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  subscriptionChanged(): void {
    if (!this.isOffline()) {
      this.isSubscriptionInProgress.set(true);
      const currentState = this.notificationsSubscribed();
      
      if (!currentState) {
        this.pushService
          .subscribe()
          .pipe(
            switchMap(() => {
              return this.pushService.updateLangauge(
                this.translocoService.getActiveLang()
              );
            }),
            takeUntil(this.destroy$)
          )
          .subscribe({
            next: (value: boolean) => {
              this.notificationsSubscribed.set(value);
              this.isSubscriptionInProgress.set(false);
            },
            error: error => {
              console.log(error);
              this.notificationsSubscribed.set(false);
              this.hideSubscription.set(true);
              this.isSubscriptionInProgress.set(false);
            },
          });
      } else {
        this.pushService.unSubscribe
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.isSubscriptionInProgress.set(false);
              window.location.reload();
            },
          });
      }
    }
  }
}
