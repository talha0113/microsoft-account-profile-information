import { provideHttpClient } from '@angular/common/http';
import { provideTransloco, TranslocoModule } from '@ngneat/transloco';
import { TranslationLoader } from './translation-loader.service';
import { NgModule, isDevMode } from '@angular/core';
import { TranslationConfiguration } from './translation.configuration';

@NgModule({
  imports: [TranslocoModule],
    providers: [
        provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: TranslationConfiguration.availableLanguages,
        fallbackLang: TranslationConfiguration.availableLanguages[0],
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
        missingHandler: {
          allowEmpty: true,
          logMissingKey: true,
          useFallbackTranslation: true,
        },
        defaultLang: TranslationConfiguration.availableLanguages[0],
      },
      loader: TranslationLoader,
    }),
  ],
  exports: [TranslocoModule],
})
export class TranslationModule {}