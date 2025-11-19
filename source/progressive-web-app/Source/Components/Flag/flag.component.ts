import {
  Component,
  OnInit,
  OnDestroy,
  WritableSignal,
  signal,
  effect,
  inject,
} from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TranslocoService, TranslocoDirective } from '@ngneat/transloco';
import { TranslationConfiguration } from '../../Transloco/translation.configuration';
import { Subscription } from 'rxjs';
import { StorageManager } from '../../Managers/storage.manager';
import { PushService } from '../../Services/push.service';

@Component({
  selector: 'flag',
  imports: [TranslocoDirective],
  templateUrl: 'flag.component.html',
  standalone: true,
})
export class FlagComponent implements OnInit, OnDestroy {
  private readonly domSanitizer = inject(DomSanitizer);
  private readonly translocoService = inject(TranslocoService);
  private readonly router = inject(Router);
  private readonly pushService = inject(PushService);
  private readonly subscription: Subscription = null;

  readonly currentLanguage: WritableSignal<string> = signal('');
  isOffline = signal(!navigator.onLine);

  constructor() {
    effect(() => {
      this.translocoService.setActiveLang(this.currentLanguage());
      StorageManager.add<string>(
        TranslationConfiguration.languageKey,
        this.currentLanguage()
      );
      this.pushService.updateLangauge(this.currentLanguage()).subscribe();
    });
  }

  public ngOnInit(): void {
    this.currentLanguage.set(this.translocoService.getActiveLang());
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.isOffline.set(!navigator.onLine);
      }
    });
  }

  public ngOnDestroy(): void {
    if (this.subscription !== null) {
      this.subscription.unsubscribe();
    }
  }

  public safeFlag(value: string): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustUrl(value);
  }

  public switchLanguage(): void {
    if (navigator.onLine) {
      this.currentLanguage.update((value: string) => {
        return value === TranslationConfiguration.availableLanguages[0]
          ? TranslationConfiguration.availableLanguages[1]
          : TranslationConfiguration.availableLanguages[0];
      });
    }
  }
}
