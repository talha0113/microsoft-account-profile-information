import { HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";

export class ErrorManager {
    public static handleRequestError(path: string, error: HttpErrorResponse): Observable<never> {
        return this.generalError(path, JSON.stringify(error));        
    }
    public static generalError(path: string, error: string): Observable<never> {
        return throwError(`${path}: ${error}`);
    }
}