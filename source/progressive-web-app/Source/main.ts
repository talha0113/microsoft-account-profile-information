import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { MainModule } from './Modules/main.module';

platformBrowserDynamic()
    .bootstrapModule(MainModule)
    .catch(err => console.error(err));
