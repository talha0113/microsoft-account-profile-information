import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslocoService } from '@ngneat/transloco';

import { FlagComponent } from './flag.component';
import { getTranslationTestingModule } from '../../Transloco/translation-testing.module';
import { TranslationConfiguration } from '../../Transloco/translation.configuration';
import { PushService } from '../../Services/push.service';
import { appRoutes } from '../../Routes/main.route';
import { environment } from '../../../Configurations/Environments/environment';
import { NotificationService } from '../../Services/notification.service';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

let fixture: ComponentFixture<FlagComponent>;
let component: FlagComponent;
let translocoService: TranslocoService;

describe('Flag Component', () => {
  beforeAll(async () => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: environment.production,
        }),
        getTranslationTestingModule(),
        FlagComponent,
      ],
      providers: [
        provideRouter(appRoutes),
        provideHttpClient(),
        provideHttpClientTesting(),
        NotificationService,
        PushService,
      ],
    }).compileComponents();
  });

  beforeAll(() => {
    translocoService = TestBed.inject(TranslocoService);
  });

  beforeAll(async () => {
    fixture = TestBed.createComponent(FlagComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
  });

  it('Should exist', async () => {
    expect(component).toBeTruthy();
  });

  it('Should render flag', async () => {
    const nativeElement: HTMLElement = fixture.debugElement.nativeElement;
    const flagImg: HTMLImageElement = nativeElement.querySelector('img');
    expect(flagImg.src).toBeTruthy();
  });

  it('Should switch language', async () => {
    expect(translocoService.getActiveLang()).toBe(
      TranslationConfiguration.availableLanguages[0]
    );
    component.switchLanguage();
    TestBed.flushEffects();
    setTimeout(() => {
      expect(translocoService.getActiveLang()).toBe(
        TranslationConfiguration.availableLanguages[1]
      );
    }, 1000);
  });
});
