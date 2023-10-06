import { HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { InsightsManager } from "./insights.manager";

export class ErrorManager {
    public static handleRequestError(path: string, error: HttpErrorResponse): Observable<never> {
        return this.generalError(path, JSON.stringify(error));        
    }
    public static generalError(path: string, error: string): Observable<never> {
        InsightsManager.trackException(path, error);
        return throwError(`${path}: ${error}`);
    }
}