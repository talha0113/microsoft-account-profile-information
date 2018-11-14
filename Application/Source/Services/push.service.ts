import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { from, of, Observable } from 'rxjs';
import { VAPIDConfiguration } from '../Configurations/vapid.configuration';
import { NotificationService } from './notification.service';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { ErrorManager } from '../Managers/error.manager';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'Configurations/Environments/environment';


@Injectable()
export class PushService {

    constructor(private swPush: SwPush, private notificationService: NotificationService, private httpClient: HttpClient ) { }

    public subscribe(): Observable<boolean> {
        if (this.swPush.isEnabled) {
            return from(this.swPush.requestSubscription({ serverPublicKey: VAPIDConfiguration.publicKey })).pipe(switchMap((value: PushSubscription) => {
                console.log(JSON.stringify(value));
                return this.httpClient.post(environment.PWASubscribeUrl, value.toJSON());
            }), map(() => {
                    this.notificationService.generalNotification("Successfully Subscribed to Web Push");
                    return true;
            }), catchError((error: any) => {
                    return ErrorManager.generalError("PushService.subscribe", error);
            }));
        }
        return of(false);
    }

    public get isSubscribed(): Observable<boolean> {
        if (this.swPush.isEnabled) {
            return this.swPush.subscription.pipe(map((value: PushSubscription) => {
                return value != null;
            }));
        }
        return of(false);
    }

    public get unSubscribe(): Observable<void> {
        if (this.swPush.isEnabled) {
            return this.swPush.subscription.pipe(switchMap((value: PushSubscription) => {
                return this.httpClient.delete(`${environment.PWAUnSubscribeUrl}?endpoint=${value.endpoint}`);                
            }), switchMap(() => {
                    return from(this.swPush.unsubscribe());
                }), map(() => {
                    return null;
                }), catchError((error: any) => {
                    // Bug
                    //return ErrorManager.generalError("PushService.unSubscribe", error);
                    return null;
            }));
        }
        return of(null);
    }
}