import { TranslocoTestingModule, TranslocoConfig } from '@ngneat/transloco';
import en_US from '../Assets/i18n/en-US.json';
import da_DK from '../Assets/i18n/da-DK.json';
import { TranslationConfiguration } from './translation.configuration.js';

export function getTranslationTestingModule(config: Partial<TranslocoConfig> = {}) {
    return TranslocoTestingModule.withLangs(
        { en_US, da_DK },
        {
            availableLangs: TranslationConfiguration.availableLanguages,
            defaultLang: TranslationConfiguration.availableLanguages[0],
            ...config
        }
    );
}