import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableElfProdMode } from '@ngneat/elf';

import { MainModule } from './Modules/main.module';
import { isDevMode } from '@angular/core';

if (!isDevMode()) {
  enableElfProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(MainModule)
  .catch(err => console.error(err));
