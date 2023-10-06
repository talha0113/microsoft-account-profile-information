import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { MainModule } from './Modules/main.module';
import { environment } from '../Configurations/Environments/environment';
import { enableAkitaProdMode } from '@datorama/akita';

if (environment.production) {
    enableProdMode();
    enableAkitaProdMode();
}

platformBrowserDynamic().bootstrapModule(MainModule)
  .catch(err => console.log(err));
