import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { from, of, Observable, BehaviorSubject } from 'rxjs';
import { VAPIDConfiguration } from '../Configurations/vapid.configuration';
import { NotificationService } from './notification.service';
import { map, catchError, switchMap } from 'rxjs/operators';
import { ErrorManager } from '../Managers/error.manager';
import { HttpClient } from '@angular/common/http';
import { environment } from 'Configurations/Environments/environment';

@Injectable()
export class PushService {
  private subscriptionCount$: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);

  constructor(
    private swPush: SwPush,
    private notificationService: NotificationService,
    private httpClient: HttpClient
  ) {}

  public subscribe(): Observable<boolean> {
    if (this.swPush.isEnabled) {
      return from(
        this.swPush.requestSubscription({
          serverPublicKey: VAPIDConfiguration.publicKey,
        })
      ).pipe(
        switchMap((value: PushSubscription) => {
          //console.log(JSON.stringify(value));
          return this.httpClient.post(
            environment.PWASubscribeUrl,
            value.toJSON()
          );
        }),
        map(() => {
          this.notificationService.generalNotification(
            'Successfully Subscribed to Web Push'
          );
          return true;
        }),
        catchError(error => {
          return ErrorManager.generalError('PushService.subscribe', error);
        })
      );
    }
    return of(false);
  }

  public get count(): Observable<number> {
    this.httpClient
      .get(`${environment.PWASubscribeCountUrl}`)
      .pipe(
        catchError(error => {
          return ErrorManager.generalError(
            'PushService.count',
            JSON.stringify(error)
          );
        })
      )
      .subscribe((value: number) => {
        this.subscriptionCount$.next(value);
      });
    return this.subscriptionCount$.asObservable();
  }

  public get isSubscribed(): Observable<boolean> {
    if (this.swPush.isEnabled) {
      return this.swPush.subscription.pipe(
        map((value: PushSubscription) => {
          return value != null;
        })
      );
    }
    return of(false);
  }

  public get unSubscribe(): Observable<void> {
    if (this.swPush.isEnabled) {
      return this.swPush.subscription.pipe(
        switchMap((value: PushSubscription) => {
          return this.httpClient.delete(
            `${environment.PWAUnSubscribeUrl}&endpoint=${encodeURIComponent(
              value.endpoint
            )}`
          );
        }),
        switchMap(() => {
          return from(this.swPush.unsubscribe());
        }),
        catchError(error => {
          // Bug
          //return ErrorManager.generalError("PushService.unSubscribe", error);
          console.error(error);
          return of(null);
        })
      );
    }
    return of(null);
  }
}
