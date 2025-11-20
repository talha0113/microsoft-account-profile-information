import {
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { GraphConstant } from '../Constants/graph.constant';

export class ProfileServiceMock {
  public static metaDataErrorRequest(
    httpMockRequest: HttpTestingController
  ): void {
    const mockRequest: TestRequest = httpMockRequest.expectOne(
      GraphConstant.profileMetaDataUrl
    );
    mockRequest.error(new ProgressEvent('ERROR_LOADING_PROFILE_METADATA'), {
      status: 404,
    });
  }

  public static pictureErrorRequest(
    httpMockRequest: HttpTestingController
  ): void {
    const mockRequest: TestRequest = httpMockRequest.expectOne(
      GraphConstant.profilePictureUrl
    );
    mockRequest.error(new ProgressEvent('ERROR_LOADING_PROFILE_PICTURE'), {
      status: 404,
    });
  }

  public static metaDataRequest(
    httpMockRequest: HttpTestingController
  ): TestRequest {
      const mockRequest: TestRequest = httpMockRequest.expectOne((request) => {
          console.log("metaDataRequest: ", request.url);
          return request.url === GraphConstant.profileMetaDataUrl;
      }
    );
    mockRequest.flush({
      '@odata.context':
        'https://graph.microsoft.com/beta/$metadata#users/$entity',
      id: '48d31887-5fad-4d73-a9f5-3c356e68a038',
      displayName: 'Megan Bowen',
      userPrincipalName: 'MeganB@M365x214355.onmicrosoft.com',
    });
    return mockRequest;
  }

  public static pictureRequest(
    httpMockRequest: HttpTestingController
  ): TestRequest {
    const mockRequest: TestRequest = httpMockRequest.expectOne(
      GraphConstant.profilePictureUrl
    );
    mockRequest.flush(
      new Blob([JSON.stringify('Images')], { type: 'image/jpeg' })
    );
    return mockRequest;
  }
}
