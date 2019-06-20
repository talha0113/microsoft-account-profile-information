import { ApplicationInsights, SeverityLevel } from "@microsoft/applicationinsights-web";
import { environment } from "../../Configurations/Environments/environment";

export class InsightsManager {
    private static applicationInsights = new ApplicationInsights({
        config: {
            instrumentationKey: "516a22ac-808a-457b-8d69-0a25f2863bf9"
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