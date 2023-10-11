import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TranslocoService } from '@ngneat/transloco';
import { TranslationConfiguration } from '../../Transloco/translation.configuration';
import { Subscription } from 'rxjs';
import { StorageManager } from '../../Managers/storage.manager';

@Component({
  selector: 'flag',
  templateUrl: 'flag.component.html',
})
export class FlagComponent implements OnInit, OnDestroy {
  public currentLanguage: string = '';
  private subscription: Subscription = null;

  constructor(
    private domSanitizer: DomSanitizer,
    private translocoService: TranslocoService
  ) {}

  public ngOnInit(): void {
    this.currentLanguage = this.translocoService.getActiveLang();
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
    this.currentLanguage =
      this.currentLanguage === TranslationConfiguration.availableLanguages[0]
        ? TranslationConfiguration.availableLanguages[1]
        : TranslationConfiguration.availableLanguages[0];
    this.translocoService.setActiveLang(this.currentLanguage);
    StorageManager.add<string>(
      TranslationConfiguration.languageKey,
      this.currentLanguage
    );
  }
}
