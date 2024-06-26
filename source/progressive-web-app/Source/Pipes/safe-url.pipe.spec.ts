﻿import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule } from '@angular/platform-browser/testing';

import { SafeUrlPipe } from './safe-url.pipe';
import { DomSanitizer } from '@angular/platform-browser';
import { setUpMock } from '../Managers/storage.mock';

describe('Safe Url Pipe', () => {
  let domSanitizer: DomSanitizer;
  let safeUrlPipe: SafeUrlPipe;

  beforeAll(async () => {
    setUpMock();
  });

  beforeAll(async () => {
    TestBed.configureTestingModule({
      imports: [BrowserTestingModule],
    });
  });

  beforeAll(async () => {
    domSanitizer = TestBed.inject(DomSanitizer);
    safeUrlPipe = new SafeUrlPipe(domSanitizer);
  });

  beforeAll(async () => {
    spyOn(URL, 'createObjectURL').and.returnValue('something');
  });

  it('Should exist', async () => {
    expect(domSanitizer).toBeDefined();
    expect(safeUrlPipe).toBeDefined();
  });

  it('Should transform', async () => {
    expect(safeUrlPipe.transform(new Blob())).toBeDefined();
  });
});
