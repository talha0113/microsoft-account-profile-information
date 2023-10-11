import {
  TRANSLOCO_CONFIG,
  TranslocoModule,
  TranslocoConfig,
} from '@ngneat/transloco';
import { HttpClientModule } from '@angular/common/http';
import { translationLoader } from './translation-loader.service';
import { environment } from '../../Configurations/Environments/environment';
import { NgModule } from '@angular/core';
import { TranslationConfiguration } from './translation.configuration';

@NgModule({
  imports: [TranslocoModule, HttpClientModule],
  providers: [
    translationLoader,
    {
      provide: TRANSLOCO_CONFIG,
      useValue: {
        availableLangs: TranslationConfiguration.availableLanguages,
        prodMode: environment.production,
        //defaultLang: TranslationConfiguration.availableLanguages[0],
        fallbackLang: TranslationConfiguration.availableLanguages[0],
        reRenderOnLangChange: true,
      } as TranslocoConfig,
    },
  ],
  exports: [TranslocoModule],
})
export class TranslationModule {}
