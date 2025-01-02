import {
  Component,
  OnInit,
  OnDestroy,
  WritableSignal,
  signal,
  effect,
} from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TranslocoService } from '@ngneat/transloco';
import { TranslationConfiguration } from '../../Transloco/translation.configuration';
import { Subscription } from 'rxjs';
import { StorageManager } from '../../Managers/storage.manager';
import { PushService } from '../../Services/push.service';

@Component({
  selector: 'flag',
  templateUrl: 'flag.component.html',
  standalone: false,
})
export class FlagComponent implements OnInit, OnDestroy {
  public readonly currentLanguage: WritableSignal<string> = signal('');
  private readonly subscription: Subscription = null;
  public isOffline: boolean = !navigator.onLine;

  constructor(
    private readonly domSanitizer: DomSanitizer,
    private readonly translocoService: TranslocoService,
    private readonly router: Router,
    private readonly pushService: PushService
  ) {
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
        this.isOffline = !navigator.onLine;
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
