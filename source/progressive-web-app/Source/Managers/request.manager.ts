import { HttpRequest } from '@angular/common/http';

export class RequestManager {
  public static secureRequest(
    request: HttpRequest<unknown>,
    token: string | null
  ): HttpRequest<unknown> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
