import { Routes } from '@angular/router';

import { StatusComponent } from '../Components/Status/status.component';
import { LoginComponent } from '../Components/Login/login.component';
import { ProfileComponent } from '../Components/Profile/profile.component';
import { LogoutComponent } from '../Components/Logout/logout.component';
import { AuthenticationGuard } from '../Guards/authentication.guard';
import { LoginGuard } from '../Guards/login.guard';

export const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'prefix'
    },    
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [LoginGuard]
    },
    {
        path: 'status',
        component: StatusComponent,
        canActivate: [AuthenticationGuard]
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthenticationGuard]
    },
    {
        path: 'logout',
        component: LogoutComponent,
        canActivate: [AuthenticationGuard]
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];
