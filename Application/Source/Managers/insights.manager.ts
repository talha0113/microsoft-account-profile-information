import { AppInsights } from "applicationinsights-js";

export class InsightsManager {
    
    static initialize() {
        AppInsights.downloadAndSetup({ instrumentationKey: "516a22ac-808a-457b-8d69-0a25f2863bf9" });
        InsightsManager.trackPageView("Profile Information Main");
    }

    static trackPageView(value: string): void
    {
        AppInsights.trackPageView(value, null, null, null, null);
    }

    static trackException(message: string, stack: string): void {
        let error = new Error();
        error.message = message;
        error.stack = stack;
        AppInsights.trackException(error, null, null, null, AI.SeverityLevel.Error);
    }

    static trackEvent(value: string): void {
        AppInsights.trackEvent(value, null, null);
    }
}