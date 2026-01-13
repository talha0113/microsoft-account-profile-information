import { bootstrapApplication } from '@angular/platform-browser';
import { enableElfProdMode } from '@ngneat/elf';

import { isDevMode, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
import { applicationInitializationProvider } from './Initialization/app.initialization';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { profileInterceptor } from './Interceptors/profile.interceptor';
import { GlobalErrorHandlerService } from './Services/global-error-handler.service';
import { AuthenticationRepository } from './Repositories/authentcation.repository';
import { ProfileRepository } from './Repositories/profile.repository';
import { ProfileService } from './Services/profile.service';
import { NotificationService } from './Services/notification.service';
import { PushService } from './Services/push.service';
import { SignalRService } from 'Source/Services/signalr.service';
import { MainComponent } from './Components/Main/main.component';
import { InsightsManager } from './Managers/insights.manager';
import { AuthenticationService } from './Services/authentication.service';
import { provideServiceWorker } from '@angular/service-worker';
import { translationProvider } from './Transloco/translation.provider';
import { appRoutes } from './Routes/main.route';

if (!isDevMode()) {
  enableElfProdMode();
}

InsightsManager.initialize();

bootstrapApplication(MainComponent, {
  providers: [
    applicationInitializationProvider,
    provideRouter(appRoutes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerImmediately',
    }),
    provideHttpClient(withInterceptors([profileInterceptor])),
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlerService,
    },
    AuthenticationRepository,
    AuthenticationService,
    ProfileRepository,
    ProfileService,
    NotificationService,
    PushService,
    SignalRService,
    translationProvider,
  ],
});
