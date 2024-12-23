import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslocoService } from '@ngneat/transloco';

import { FlagComponent } from './flag.component';
import { getTranslationTestingModule } from '../../Transloco/translation-testing.module';
import { TranslationConfiguration } from '../../Transloco/translation.configuration';
import { PushService } from '../../Services/push.service';
import { appRoutes } from '../../Routes/main.route';
import { environment } from '../../../Configurations/Environments/environment';
import { NotificationService } from '../../Services/notification.service';

let fixture: ComponentFixture<FlagComponent>;
let component: FlagComponent;
let translocoService: TranslocoService;

describe('Flag Component', () => {
  beforeAll(async () => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        RouterTestingModule.withRoutes(appRoutes),
        ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: environment.production,
        }),
        getTranslationTestingModule(),
      ],
      providers: [NotificationService, PushService],
      declarations: [FlagComponent],
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
    expect(translocoService.getActiveLang()).toBe(
      TranslationConfiguration.availableLanguages[1]
    );
  });
});
