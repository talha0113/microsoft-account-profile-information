import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
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
import { AuthenticationGuard } from '../Guards/authentication.guard';
import { LoginGuard } from '../Guards/login.guard';
import { ProfileInterceptor } from '../Interceptors/profile.interceptor';
import { ProfileService } from '../Services/profile.service';
import { NotificationService } from '../Services/notification.service';
import { PushService } from '../Services/push.service';

import { AuthenticationStore } from '../Stores/authentication.store';
import { AuthenticationQuery } from '../Queries/authentication.query';
import { ProfileStore } from '../Stores/profile.store';
import { ProfileQuery } from '../Queries/profile.query';

import { environment } from '../../Configurations/Environments/environment';
import { InsightsManager } from '../Managers/insights.manager';
import { SignalRService } from 'Source/Services/signalr.service';
import { GlobalErrorHandlerService } from '../Services/global-error-handler.service';


@NgModule({
    declarations: [
        MainComponent,
        NavigationComponent,
        LoginComponent,
        StatusComponent,
        ProfileComponent,
        LogoutComponent,
        SafeUrlPipe
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    ],
    providers: [        
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ProfileInterceptor,
            multi: true
        },
        {
            provide: ErrorHandler,
            useClass: GlobalErrorHandlerService
        },
        AuthenticationStore,
        AuthenticationQuery,
        ProfileStore,
        ProfileQuery,
        LoginGuard,
        AuthenticationGuard,
        ProfileService,
        AuthenticationService,
        NotificationService,
        PushService,
        SignalRService
    ],
    bootstrap: [
        MainComponent
    ]
})
export class MainModule {
    constructor() {
        InsightsManager.initialize();
    }
}
