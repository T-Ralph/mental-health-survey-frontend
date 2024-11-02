import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SurveyService } from './survey.service';
import { Survey } from '../models/survey.model';

describe('SurveyService', () => {
  let service: SurveyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SurveyService]
    });

    service = TestBed.inject(SurveyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('submitSurvey', () => {
    const mockSurvey: Survey = {
      feeling: 'Good',
      stress: 3,
      comments: 'Feeling alright.'
    };

    it('should post the survey and return the response', () => {
      service.submitSurvey(mockSurvey).subscribe(response => {
        expect(response).toEqual(mockSurvey);
      });

      const req = httpMock.expectOne('http://127.0.0.1:3000/surveys');
      expect(req.request.method).toBe('POST');
      req.flush(mockSurvey);
    });

    it('should handle a client-side error', () => {
      const errorEvent = new ErrorEvent('Network error', {
        message: 'Unable to connect to server'
      });

      service.submitSurvey(mockSurvey).subscribe({
        next: () => fail('Expected an error, but got a response'),
        error: (error) => {
          expect(error.message).toContain('Error: Unable to connect to server');
        }
      });

      const req = httpMock.expectOne('http://127.0.0.1:3000/surveys');
      req.error(errorEvent);
    });

    it('should handle a server-side error', () => {
      service.submitSurvey(mockSurvey).subscribe({
        next: () => fail('Expected an error, but got a response'),
        error: (error) => {
          expect(error.message).toContain('Error Code: 500');
        }
      });

      const req = httpMock.expectOne('http://127.0.0.1:3000/surveys');
      req.flush('Internal server error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle a 404 not found error', () => {
      service.submitSurvey(mockSurvey).subscribe({
        next: () => fail('Expected an error, but got a response'),
        error: (error) => {
          expect(error.message).toContain('Error Code: 404');
          expect(error.message).toContain('Not Found');
        }
      });

      const req = httpMock.expectOne('http://127.0.0.1:3000/surveys');
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });
});
