import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

import { FlagComponent } from './flag.component';
import { PushService } from 'Source/Services/push.service';
import { SignalRService } from 'Source/Services/signalr.service';
import { SignalRServiceStub } from 'Source/Services/signalr.service.stub';
import { environment } from 'Configurations/Environments/environment';
import { NotificationService } from 'Source/Services/notification.service';
import { getTranslationTestingModule } from '../../Transloco/translation-testing.module';
import { TranslocoService } from '@ngneat/transloco';
import { TranslationConfiguration } from '../../Transloco/translation.configuration';


let fixture: ComponentFixture<FlagComponent>;
let component: FlagComponent;
let translocoService: TranslocoService;

describe('Status Component', () => {

    beforeAll(async () => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                FormsModule,
                ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
                getTranslationTestingModule()
            ],
            declarations: [
                FlagComponent
            ],
            providers: [
                PushService,
                NotificationService,
                {
                    provide: SignalRService,
                    useClass: SignalRServiceStub
                }
            ]
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
        let nativeElement: HTMLElement = fixture.debugElement.nativeElement;
        let flagImg: HTMLImageElement = nativeElement.querySelector('img');
        expect(flagImg.src).toBeTruthy();
    });

    it('Should switch language', async () => {
        expect(translocoService.getActiveLang()).toBe(TranslationConfiguration.availableLanguages[0]);
        component.switchLanguage();
        expect(translocoService.getActiveLang()).toBe(TranslationConfiguration.availableLanguages[1]);
    });
});
