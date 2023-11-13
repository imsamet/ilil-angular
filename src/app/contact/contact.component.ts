import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'app/services/api.service';
import { AnimationOptions } from "ngx-lottie";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  options: AnimationOptions = {
    path: "assets/animations/animation_meet.json",
    loop: true,
    autoplay: true,
  };

  feedbackForm: UntypedFormGroup;

  formErrors = {
    name: "",
    lastname: "",
    email: "",
    website: "",
    message: ""
  };

  validationMessages = {
    name: {
      required: "Name is required."
    },
    lastname: {
      required: "Lastname is required."
    },
    email: {
      required: "Email is required.",
      email: "The email format is incorrect"
    },
    message: {
      required: "Message is required."
    },
  };


  @ViewChild('signInNgForm') feedbackNgForm: NgForm;

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
    public snackBar: MatSnackBar,
    private _apiService: ApiService
  ) {

  }

  ngOnInit(): void {
    this.createForm()
  }

  createForm() {
    this.feedbackForm = this._formBuilder.group({
      name: ["", [Validators.required]],
      lastname: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      website: [""],
      about: [""],
      message: ["", [Validators.required]],
    });
    this.feedbackForm.valueChanges.subscribe(() => {
      this.onValueChanged();
      this._changeDetectorRef.markForCheck();
    });
    this.onValueChanged();
  }


  onValueChanged() {
    if (!this.feedbackForm) {
      return;
    }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous erroe message (if any)
        this.formErrors[field] = "";
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + " ";
            }
          }
        }
      }
    }
  }


  onSubmit(): void {
    if (this.feedbackForm.invalid) {
      return;
    }
    this.feedbackForm.disable();
    this._apiService.createFeedback(this.feedbackForm.getRawValue())
      .subscribe(() => {
        this.feedbackForm.enable();
        this.feedbackForm.reset();
        this.openSnackBar("We received your feedback, we will contact you as soon as possible.", "✔");
      });
  }

  openSnackBar(message, action) {
    this.snackBar.open(message, action, {
      duration: 10000,
      horizontalPosition: "right",
      direction: "ltr",
      panelClass: "snackbar",
    });
  }


}
