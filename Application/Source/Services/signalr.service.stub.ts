import { Observable, of } from 'rxjs';

import { SignalRService } from './signalr.service';

export class SignalRServiceStub extends SignalRService {

    public get liveCount(): Observable<number> {
        return of(2);
    }
}
