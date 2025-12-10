import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  effect,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { TranslocoPipe } from '@jsverse/transloco';
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

  subscriptionCount = signal(0);
  isOffline = signal(true);
  statsSubscribed = signal(false);

  constructor() {
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

    const subscriptionCountSubscription = this.pushService.count.subscribe({
      next: (value: number) => {
        this.subscriptionCount.set(value);
      },
      error: () => {
        subscriptionCountSubscription.unsubscribe();
      },
    });

    this.signalRService.renewConnection();
    this.subscriptionLiveCountSubscription =
      this.signalRService.liveCount.subscribe((value: number) => {
        if (value > -1) {
          this.subscriptionCount.set(value);
        }
        subscriptionCountSubscription.unsubscribe();
      });

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
}
