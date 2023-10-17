import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  HubConnectionBuilder,
  HubConnection,
  HubConnectionState,
} from '@microsoft/signalr';

import { catchError, tap } from 'rxjs/operators';
import { ErrorManager } from '../Managers/error.manager';
import { environment } from 'Configurations/Environments/environment';
import { SignalRConnection } from 'Source/Models/signalr-connection.model';

@Injectable()
export class SignalRService {
  private liveCount$: BehaviorSubject<number>;
  private signalRConnection: HubConnection = null;

  constructor(private httpClient: HttpClient) {}

  public renewConnection(): void {
    this.liveCount$ = new BehaviorSubject<number>(-1);
    this.httpClient
      .get<SignalRConnection>(environment.PWASignalRConnectionUrl)
      .pipe(
        tap((value: SignalRConnection) => {
          this.signalRConnection = new HubConnectionBuilder()
            .withUrl(value.url, { accessTokenFactory: () => value.accessToken })
            .build();
          this.signalRConnection.on(
            'SignalRSubscriptionCountEvent',
            (value: { Count: number }) => {
              //this.liveCount$.next(JSON.parse(value).Count);
              this.liveCount$.next(value.Count);
            }
          );
          this.signalRConnection.onclose(error => {
            console.log('SignalR Connection Closed: ' + error);
            this.liveCount$.complete();
            this.liveCount$.unsubscribe();
          });
          this.signalRConnection
            .start()
            .then(() => console.log('SignalR Connected!'))
            .catch(error => {
              console.error(error);
            });
        }),
        catchError(error => {
          return ErrorManager.generalError(
            'SignalRService.constructor',
            JSON.stringify(error)
          );
        })
      )
      .subscribe();
  }

  public stopConnection(): void {
    if (this.signalRConnection != null) {
      if (this.signalRConnection.state == HubConnectionState.Connected) {
        this.signalRConnection.stop().then(() => {
          this.signalRConnection = null;
        });
      }
    }
  }

  public get liveCount(): Observable<number> {
    return this.liveCount$.asObservable();
  }
}
