﻿import {
  ApplicationInsights,
    SeverityLevel,
    Snippet
} from '@microsoft/applicationinsights-web';
import { environment } from '../../Configurations/Environments/environment';

export class InsightsManager {
    private static applicationInsights = new ApplicationInsights({
        config: {
            connectionString: 'InstrumentationKey=02db383e-c586-47be-91a4-1aa6a1847d97;IngestionEndpoint=https://westeurope-5.in.applicationinsights.azure.com/;LiveEndpoint=https://westeurope.livediagnostics.monitor.azure.com/' 
        }
    });

  static initialize() {
    InsightsManager.applicationInsights.loadAppInsights();
      InsightsManager.trackPageView('Profile Information Main');      
  }

  static trackPageView(value: string): void {
    InsightsManager.applicationInsights.trackPageView({
      name: value,
    });
    InsightsManager.applicationInsights.trackPageViewPerformance({
      name: value,
    });
      InsightsManager.flush();      
  }

  static trackException(message: string, stack: string): void {
    const error = new Error();
    error.message = message;
    error.stack = stack;

    InsightsManager.applicationInsights.trackException({
      error: error,
      severityLevel: SeverityLevel.Error,
    });
    InsightsManager.flush();
  }

  static trackEvent(value: string): void {
    InsightsManager.applicationInsights.trackEvent({
      name: value,
    });
    InsightsManager.flush();
  }

  private static flush(): void {
    if (!environment.production) {
      InsightsManager.applicationInsights.flush(true);
    }
  }
}
