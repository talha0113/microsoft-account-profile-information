import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

import { StatusComponent } from './status.component';
import { PushService } from 'Source/Services/push.service';
import { SignalRService } from 'Source/Services/signalr.service';
import { SignalRServiceStub } from 'Source/Services/signalr.service.stub';
import { environment } from 'Configurations/Environments/environment';
import { NotificationService } from 'Source/Services/notification.service';
import { By } from '@angular/platform-browser';
import { getTranslationTestingModule } from '../../Transloco/translation-testing.module';

let fixture: ComponentFixture<StatusComponent>;
let component: StatusComponent;

describe('Status Component', () => {
  beforeAll(async () => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: environment.production,
        }),
        getTranslationTestingModule(),
        StatusComponent,
      ],
      providers: [
        PushService,
        NotificationService,
        {
          provide: SignalRService,
          useClass: SignalRServiceStub,
        },
      ],
    }).compileComponents();
  });

  beforeAll(async () => {
    fixture = TestBed.createComponent(StatusComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
  });

  it('Should exist', async () => {
    expect(component).toBeTruthy();
  });

  it('Should render message', async () => {
    const nativeElement: HTMLElement = fixture.debugElement.nativeElement;
    const messageDiv: HTMLDivElement = nativeElement.querySelector('div');

    expect(messageDiv.textContent).toBeTruthy();
  });

  it('Should render live stats input', async () => {
    const nativeElement: HTMLElement = fixture.debugElement.nativeElement;
    const liveStatsLabel: HTMLLabelElement =
      nativeElement.querySelector('label');

    expect(liveStatsLabel.textContent).toBeTruthy();
  });

  it('Should not render live stats number', async () => {
    const nativeElement = fixture.debugElement.query(
      By.css('.stats-subscribed')
    ).nativeElement;
    expect(nativeElement.checked).toBeFalsy();
  });

  it('Should render live stats number', async () => {
    const nativeElementCheckbox = fixture.debugElement.query(
      By.css('.stats-subscribed')
    ).nativeElement;
    nativeElementCheckbox.click();
    expect(nativeElementCheckbox.checked).toBeTruthy();
    nativeElementCheckbox.click();
  });
});
