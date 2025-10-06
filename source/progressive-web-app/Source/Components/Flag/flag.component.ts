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
import { Subject, takeUntil } from 'rxjs';
import { StorageManager } from '../../Managers/storage.manager';
import { PushService } from '../../Services/push.service';

@Component({
  selector: 'flag',
  templateUrl: 'flag.component.html',
  standalone: false,
})
export class FlagComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  public readonly currentLanguage: WritableSignal<string> = signal('');
  public isOffline = signal(!navigator.onLine);

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
    this.router.events
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: Event) => {
        if (event instanceof NavigationEnd) {
          this.isOffline.set(!navigator.onLine);
        }
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
