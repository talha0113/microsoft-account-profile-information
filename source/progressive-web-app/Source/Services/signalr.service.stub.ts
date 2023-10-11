import { Observable, of } from 'rxjs';

import { SignalRService } from './signalr.service';
import { Injectable } from '@angular/core';

@Injectable()
export class SignalRServiceStub extends SignalRService {
  public get liveCount(): Observable<number> {
    return of(2);
  }
}
