import { HttpRequest, HttpHeaders } from "@angular/common/http";

export class RequestManager {
    public static secureRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
        return request.clone({
            setHeaders: {
              Authorization  : `Bearer ${token}`
            }
        });
    }
}