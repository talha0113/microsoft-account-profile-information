import { APP_INITIALIZER } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { StorageManager } from '../Managers/storage.manager';
import { TranslationConfiguration } from '../Transloco/translation.configuration';

export function ApplicationInitialization(
    translocoService: TranslocoService
): () => Promise<boolean> {
  return (): Promise<boolean> => {
    return new Promise<boolean>(
        (resolve: (a: boolean) => void, reject: (reason: any) => void): void => {
            const currentLanguage = StorageManager.get<string>(TranslationConfiguration.languageKey) === null ? TranslationConfiguration.availableLanguages[0] : StorageManager.get<string>(TranslationConfiguration.languageKey);
            StorageManager.add<string>(TranslationConfiguration.languageKey, currentLanguage);
            translocoService.setActiveLang(currentLanguage);
            resolve(true);
      }
    );
  };
}

export const applicationInitializationProvider = {
  provide: APP_INITIALIZER,
    useFactory: ApplicationInitialization,
    deps: [TranslocoService],
  multi: true
};
