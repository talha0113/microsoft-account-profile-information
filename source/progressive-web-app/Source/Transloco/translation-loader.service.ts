import { HttpClient } from '@angular/common/http';
import { Translation, TranslocoLoader } from '@ngneat/transloco';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TranslationLoader implements TranslocoLoader {
  constructor(private httpClient: HttpClient) {}
  getTranslation(lang: string) {
    return this.httpClient.get<Translation>(`/Assets/i18n/${lang}.json`);
  }
}
