import { provideTransloco } from '@jsverse/transloco';
import { TranslationLoader } from './translation-loader.service';
import { isDevMode } from '@angular/core';
import { TranslationConfiguration } from './translation.configuration';

export const translationProvider = provideTransloco({
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
});
