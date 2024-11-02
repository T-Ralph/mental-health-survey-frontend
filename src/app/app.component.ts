import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SurveyService } from './services/survey.service';
import { Survey } from './models/survey.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  surveyForm: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private surveyService: SurveyService) {
    this.surveyForm = this.fb.group({
      feeling: ['', Validators.required],
      stress: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      comments: [''],
    });
  }

  onSubmit(): void {
    this.successMessage = null;
    this.errorMessage = null;

    if (!this.surveyForm.valid) {
      this.errorMessage = 'Please fill out all required fields.';
      return;
    }

    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;
    const survey: Survey = this.surveyForm.value;

    this.surveyService.submitSurvey(survey).subscribe({
      next: (response) => {
        this.successMessage = 'Survey submitted successfully!';
        this.surveyForm.reset();
        this.surveyForm.get('feeling')?.setErrors(null);
      },
      error: (error) => {
        this.errorMessage = 'An error occurred: ' + error.message;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
