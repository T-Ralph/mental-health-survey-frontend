import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Survey } from '../models/survey.model';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  private surveyUrl = 'http://localhost:3000/surveys';
  private analysisUrl = 'http://localhost:3000/analysis';

  constructor(private http: HttpClient) {}

  submitSurvey(survey: Survey): Observable<Survey> {
    return this.http.post<Survey>(this.surveyUrl, survey).pipe(
      catchError(this.handleError)
    );
  }

  getAnalysis(): Observable<{ count: number, average: number }> {
    return this.http.get<{ count: number, average: number }>(this.analysisUrl).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage: string;

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }
}
