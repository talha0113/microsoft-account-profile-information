import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, isDevMode } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';

import { appRoutes } from '../Routes/main.route';

import { MainComponent } from '../Components/Main/main.component';
import { LoginComponent } from '../Components/Login/login.component';
import { StatusComponent } from '../Components/Status/status.component';
import { ProfileComponent } from '../Components/Profile/profile.component';
import { LogoutComponent } from '../Components/Logout/logout.component';
import { NavigationComponent } from '../Components/Navigation/navigation.component';

import { SafeUrlPipe } from '../Pipes/safe-url.pipe';

import { AuthenticationService } from '../Services/authentication.service';
import { ProfileInterceptor } from '../Interceptors/profile.interceptor';
import { ProfileService } from '../Services/profile.service';
import { NotificationService } from '../Services/notification.service';
import { PushService } from '../Services/push.service';

import { InsightsManager } from '../Managers/insights.manager';
import { SignalRService } from 'Source/Services/signalr.service';
import { GlobalErrorHandlerService } from '../Services/global-error-handler.service';
import { TranslationModule } from '../Transloco/translation.module';
import { FlagComponent } from '../Components/Flag/flag.component';
import { applicationInitializationProvider } from '../Initialization/app.initialization';
import { ProfileRepository } from '../Repositories/profile.repository';
import { AuthenticationRepository } from '../Repositories/authentcation.repository';

@NgModule({
  declarations: [
    MainComponent,
    FlagComponent,
    NavigationComponent,
    LoginComponent,
    StatusComponent,
    ProfileComponent,
    LogoutComponent,
    SafeUrlPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, {}),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerImmediately',
    }),
    TranslationModule,
  ],
  providers: [
    applicationInitializationProvider,
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
  ],
  bootstrap: [MainComponent],
})
export class MainModule {
  constructor() {
    InsightsManager.initialize();
  }
}
