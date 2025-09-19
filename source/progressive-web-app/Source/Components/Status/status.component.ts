import { Component, OnInit, OnDestroy, signal, effect } from '@angular/core';
import { Subscription } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { PushService } from 'Source/Services/push.service';
import { SignalRService } from 'Source/Services/signalr.service';

@Component({
  selector: 'status',
  templateUrl: './status.component.html',
  standalone: false,
})
export class StatusComponent implements OnInit, OnDestroy {
  private subscriptionLiveCountSubscription: Subscription = null;

  public subscriptionCount = signal(0);
  public isOffline = signal(true);
  public statsSubscribed = signal(false);

  constructor(
    private pushService: PushService,
    private signalRService: SignalRService
  ) {
    // Effect to handle stats subscription changes
    effect(() => {
      if (this.statsSubscribed()) {
        this.startLiveCount();
      } else {
        this.stopLiveCount();
      }
    });
  }

  ngOnInit(): void {
    this.isOffline.set(!navigator.onLine);
  }

  ngOnDestroy(): void {
    this.stopLiveCount();
  }

  private startLiveCount(): void {
    this.stopLiveCount();
    
    const subscriptionCountSubscription = this.pushService.count.subscribe(
      (value: number) => {
        this.subscriptionCount.set(value);
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
          this.subscriptionCount.set(value);
        }
      });
  }

  private stopLiveCount(): void {
    if (this.subscriptionLiveCountSubscription != null) {
      this.subscriptionLiveCountSubscription.unsubscribe();
      this.subscriptionLiveCountSubscription = null;
      this.signalRService.stopConnection();
    }
  }

  toogleStats(): void {
    this.statsSubscribed.update(value => !value);
  }
}
