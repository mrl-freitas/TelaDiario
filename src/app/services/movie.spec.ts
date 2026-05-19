import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { MovieService } from './movie';

describe('MovieService', () => {
  let service: MovieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(MovieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
