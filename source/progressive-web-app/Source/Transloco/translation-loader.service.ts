import { HttpClient } from '@angular/common/http';
import { Translation, TranslocoLoader } from '@ngneat/transloco';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TranslationLoader implements TranslocoLoader {
  private readonly httpClient = inject(HttpClient);

  getTranslation(lang: string) {
    return this.httpClient.get<Translation>(`/Assets/i18n/${lang}.json`);
  }
}
