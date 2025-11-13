import { bootstrapApplication } from '@angular/platform-browser';
import { enableElfProdMode } from '@ngneat/elf';

import { isDevMode, ErrorHandler, importProvidersFrom } from '@angular/core';
import { applicationInitializationProvider } from './Initialization/app.initialization';
import { provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProfileInterceptor } from './Interceptors/profile.interceptor';
import { GlobalErrorHandlerService } from './Services/global-error-handler.service';
import { AuthenticationRepository } from './Repositories/authentcation.repository';
import { ProfileRepository } from './Repositories/profile.repository';
import { ProfileService } from './Services/profile.service';
import { NotificationService } from './Services/notification.service';
import { PushService } from './Services/push.service';
import { SignalRService } from 'Source/Services/signalr.service';
import { provideRouter } from '@angular/router';
import { appRoutes } from './Routes/main.route';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslationModule } from './Transloco/translation.module';
import { MainComponent } from './Components/Main/main.component';
import { InsightsManager } from './Managers/insights.manager';
import { AuthenticationService } from './Services/authentication.service';

if (!isDevMode()) {
  enableElfProdMode();
}

bootstrapApplication(MainComponent, {
  providers: [
    importProvidersFrom(
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerImmediately',
      }),
      TranslationModule
    ),
    applicationInitializationProvider,
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ProfileInterceptor,
      multi: true,
    },
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
    provideRouter(appRoutes),
  ],
})
  .then(() => {
    InsightsManager.initialize();
  })
  .catch(err => console.error(err));
