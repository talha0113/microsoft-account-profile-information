import { ApplicationInsights, SeverityLevel } from "@microsoft/applicationinsights-web";
import { environment } from "../../Configurations/Environments/environment";

export class InsightsManager {
    private static applicationInsights = new ApplicationInsights({
        config: {
            instrumentationKey: "dc86a0f3-1d13-4fa5-b1ed-2d8e4c2ed49a"
        }
    });

    static initialize() {
        InsightsManager.applicationInsights.loadAppInsights();
        InsightsManager.trackPageView("Profile Information Main");
    }

    static trackPageView(value: string): void
    {
        InsightsManager.applicationInsights.trackPageView({
            name: value
        });
        InsightsManager.applicationInsights.trackPageViewPerformance({
            name: value
        });
        InsightsManager.flush();
    }

    static trackException(message: string, stack: string): void {
        let error = new Error();
        error.message = message;
        error.stack = stack;

        InsightsManager.applicationInsights.trackException({
            error: error,
            severityLevel: SeverityLevel.Error
        });
        InsightsManager.flush();
    }

    static trackEvent(value: string): void {
        InsightsManager.applicationInsights.trackEvent({
            name: value
        });
        InsightsManager.flush();
    }

    private static flush(): void {
        if (!environment.production) {
            InsightsManager.applicationInsights.flush(true);
        }
    }
}
