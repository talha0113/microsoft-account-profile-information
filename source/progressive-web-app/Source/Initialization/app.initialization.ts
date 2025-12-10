/* eslint-disable @typescript-eslint/no-unused-vars */

import { inject, provideAppInitializer } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { StorageManager } from '../Managers/storage.manager';
import { TranslationConfiguration } from '../Transloco/translation.configuration';

export function ApplicationInitialization(
  translocoService: TranslocoService
): () => Promise<boolean> {
  return (): Promise<boolean> => {
    return new Promise<boolean>(
      (resolve: (a: boolean) => void, reject: (reason) => void): void => {
        const currentLanguage =
          StorageManager.get<string>(TranslationConfiguration.languageKey) ===
          null
            ? TranslationConfiguration.availableLanguages[0]
            : StorageManager.get<string>(TranslationConfiguration.languageKey);
        StorageManager.add<string>(
          TranslationConfiguration.languageKey,
          currentLanguage
        );
        translocoService.setActiveLang(currentLanguage);
        resolve(true);
      }
    );
  };
}

export const applicationInitializationProvider = provideAppInitializer(() => {
  const initializerFn = ApplicationInitialization(inject(TranslocoService));
  return initializerFn();
});
