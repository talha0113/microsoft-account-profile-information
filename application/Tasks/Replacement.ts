import { readFileSync, writeFileSync } from "fs";
let serviceWorkerFile = readFileSync('./Distributions/ngsw-worker.js').toString();
let serviceWorkerModificationFile = readFileSync('./Tasks/ServiceWorkerModification.txt').toString();
let newServiceWorkerFile = serviceWorkerFile.replace("this.scope.addEventListener('notificationclick', (event) => this.onClick(event));", serviceWorkerModificationFile);
writeFileSync('./Distributions/ngsw-worker.js', newServiceWorkerFile,)
