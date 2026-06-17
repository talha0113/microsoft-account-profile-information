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
      (
        resolve: (a: boolean) => void,
        reject: (reason: unknown) => void
      ): void => {
        const storedLanguage = StorageManager.get<string>(
          TranslationConfiguration.languageKey
        );
        const currentLanguage: string =
          storedLanguage ?? TranslationConfiguration.availableLanguages[0];
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
