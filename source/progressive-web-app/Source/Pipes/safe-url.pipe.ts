import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({ name: 'safeUrl', standalone: true })
export class SafeUrlPipe implements PipeTransform {
  private readonly domSanitizer = inject(DomSanitizer);

  transform(blob: Blob): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(
      globalThis.URL.createObjectURL(blob)
    );
  }
}
