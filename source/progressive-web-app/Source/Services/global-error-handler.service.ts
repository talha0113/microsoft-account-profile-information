import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { InsightsManager } from '../Managers/insights.manager';
import { Router } from '@angular/router';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: Error | HttpErrorResponse): void {
    let stackTrace = 'Server Stack Trace';
    if (!(error instanceof HttpErrorResponse)) {
      stackTrace = error.stack;
    }
    InsightsManager.trackException(
      `${this.injector.get(Router)} : ${error.message}`,
      stackTrace
    );
    console.error(error.message);
  }
}
