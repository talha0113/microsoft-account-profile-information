import { describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { SignalRService } from './signalr.service';
import { SignalRServiceStub } from './signalr.service.stub';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SignalR Service', () => {
  let signalRService: SignalRService;

  beforeAll(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: SignalRService,
          useClass: SignalRServiceStub,
        },
      ],
    });
  });

  beforeAll(async () => {
    signalRService = TestBed.inject(SignalRService);
  });

  it('Should exist', async () => {
    expect(signalRService).toBeDefined();
  });

  it(`Should return count`, async () => {
    signalRService.liveCount.subscribe((value: number) => {
      expect(value).toBeGreaterThan(0);
    });
  });
});
