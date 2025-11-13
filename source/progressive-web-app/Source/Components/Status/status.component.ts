import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { TranslocoPipe } from '@ngneat/transloco';
import { PushService } from 'Source/Services/push.service';
import { SignalRService } from 'Source/Services/signalr.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'status',
  imports: [FormsModule, TranslocoPipe],
  templateUrl: './status.component.html',
  standalone: true,
})
export class StatusComponent implements OnInit, OnDestroy {
  private readonly pushService = inject(PushService);
  private readonly signalRService = inject(SignalRService);

  private subscriptionLiveCountSubscription: Subscription = null;

  public subscriptionCount: number = 0;
  public isOffline: boolean = true;
  public statsSubscribed: boolean = false;

  ngOnInit(): void {
    this.isOffline = !navigator.onLine;
  }

  ngOnDestroy(): void {
    this.stopLiveCount();
  }

  private stopLiveCount(): void {
    if (this.subscriptionLiveCountSubscription != null) {
      this.subscriptionLiveCountSubscription.unsubscribe();
      this.subscriptionLiveCountSubscription = null;
      this.signalRService.stopConnection();
    }
  }

  toogleStats(): void {
    this.stopLiveCount();

    if (this.statsSubscribed) {
      const subscriptionCountSubscription = this.pushService.count.subscribe(
        (value: number) => {
          this.subscriptionCount = value;
        },
        null,
        () => {
          subscriptionCountSubscription.unsubscribe();
        }
      );
      this.signalRService.renewConnection();
      this.subscriptionLiveCountSubscription =
        this.signalRService.liveCount.subscribe((value: number) => {
          if (value > -1) {
            this.subscriptionCount = value;
          }
        });
    } else {
      this.stopLiveCount();
    }
  }
}
