import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SurveyService } from './services/survey.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatSpinner } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let surveyService: SurveyService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent, MatSpinner],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSliderModule,
        MatButtonModule,
        BrowserAnimationsModule
      ],
      providers: [SurveyService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    surveyService = TestBed.inject(SurveyService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    const form = component.surveyForm;
    expect(form.get('feeling')?.value).toBe('');
    expect(form.get('stress')?.value).toBe(3);
    expect(form.get('comments')?.value).toBe('');
  });

  it('should disable submit button if form is invalid', () => {
    component.surveyForm.get('feeling')?.setValue('');
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBeTruthy();
  });

  it('should enable submit button if form is valid', () => {
    component.surveyForm.setValue({
      feeling: 'Good',
      stress: 3,
      comments: 'No comments'
    });
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBeFalsy();
  });

  it('should show a success message after successful submission', () => {
    const mockSurvey = {
      feeling: 'Good',
      stress: 3,
      comments: 'Feeling great'
    };
    spyOn(surveyService, 'submitSurvey').and.returnValue(of(mockSurvey));

    component.surveyForm.setValue(mockSurvey);
    component.onSubmit();
    fixture.detectChanges();

    expect(component.successMessage).toBe('Survey submitted successfully!');
    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBeNull();
  });

  it('should show an error message if submission fails', () => {
    spyOn(surveyService, 'submitSurvey').and.returnValue(throwError(() => new Error('Server error')));

    component.surveyForm.setValue({
      feeling: 'Bad',
      stress: 4,
      comments: 'Having a tough day'
    });
    component.onSubmit();
    fixture.detectChanges();

    expect(component.errorMessage).toBe('An error occurred: Server error');
    expect(component.successMessage).toBeNull();
  });

  it('should reset the form after successful submission', () => {
    const mockSurvey = {
      feeling: 'Good',
      stress: 3,
      comments: 'Feeling great'
    };
    spyOn(surveyService, 'submitSurvey').and.returnValue(of(mockSurvey));
    spyOn(component.surveyForm, 'reset').and.callThrough();

    component.surveyForm.setValue({
      feeling: 'Good',
      stress: 2,
      comments: 'All is well'
    });

    component.onSubmit();
    fixture.detectChanges();

    expect(component.surveyForm.reset).toHaveBeenCalledOnceWith();
  });
});
