import {
  TranslocoTestingModule,
  TranslocoTestingOptions,
} from '@jsverse/transloco';
import en_US from '../Assets/i18n/en-US.json';
import da_DK from '../Assets/i18n/da-DK.json';
import { TranslationConfiguration } from './translation.configuration';

export function getTranslationTestingModule(
  options: TranslocoTestingOptions = {}
) {
  return TranslocoTestingModule.forRoot({
    langs: { en_US, da_DK },
    translocoConfig: {
      availableLangs: TranslationConfiguration.availableLanguages,
      defaultLang: TranslationConfiguration.availableLanguages[0],
      fallbackLang: TranslationConfiguration.availableLanguages[0],
    },
    preloadLangs: true,
    ...options,
  });
}
