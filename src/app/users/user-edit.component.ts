import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControlName, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GenericValidator } from '../shared/generic-validator';
import { Observable, merge, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { User } from './user';
import { UserService } from './user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  templateUrl: './user-edit.component.html',
  styles: [
    `
      .btn-agregar {
        margin: 30px;
      }
    `
  ]
})
export class UserEditComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: ElementRef[];
  displayMessage: { [key: string]: string } = {};

  listForm: FormGroup;
  user: User;
  errorMessage = '';
  id: string;
  profiles: any;

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private fb: FormBuilder,
    private routerService: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private toastr: ToastrService

  ) {
    this.validationMessages = {
      firstname: {
        required: 'Firstname is required',
      },
      lastname: {
        required: 'Lastname is required',
      },
      document: {
        required: 'Document is required',
      },
      email: {
        required: 'Email is required',
        email: 'Invalid formta email',
      },
      cemail: {
        required: 'Confirmation email is required',
        email: 'Invalid format email',
        EmailValidator: 'Confirmation email does not match',
      },
    };
    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => (this.id = params.get('id')));
    this.route.data.subscribe(data => {
      const resolvedDataUser = data['userResolved'];
      if (resolvedDataUser.error) {
        this.errorMessage = this.errorMessage + resolvedDataUser.error;
      }

      if(resolvedDataUser.user.data){
        this.user = resolvedDataUser.user.data;
      } else {
        this.user = resolvedDataUser.user;
      }

      this.listForm = this.fb.group({
        firstname: [this.user.firstname, [Validators.required]],
        lastname: [this.user.lastname, [Validators.required]],
        document: [this.user.document, [Validators.required]],
        email: [this.user.email, [Validators.required, Validators.email]],
        cemail: [this.user.email, [Validators.required, Validators.email, EmailValidator('email')]],
        phone: [this.user.phone],
      });
    });

  }

  onSubmit(): void {
      this.user = this.listForm.value;
      if (+this.id === 0) {
        this.userService.createUser(this.user).subscribe(success => {
          if (success) {
            this.toastr.success('User created success!');
            this.listForm.reset();
            this.goBack();
          }
          this.errorMessage =
            'Ocurrió un error al tratar de guardar los cambios en la base de datos. Contacte a su proveedor';
        }, err => (this.errorMessage = err));
      } else {
        this.user.id = this.id;
        this.userService.updateUser(this.user).subscribe(data => {
          if (data.data) {
            this.toastr.success(`User successfully updated`);
            this.listForm.reset();
            this.goBack();
          }
          this.errorMessage = data;
        }, (errors: string[]) => {
          errors.forEach(message => this.toastr.error(message));
        });
      }
  }

  goBack(): void {
    this.routerService.navigate(['system', 'users']);
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    const controlBlurs: Observable<any>[] = this.formInputElements.map((formControl: ElementRef) =>
      fromEvent(formControl.nativeElement, 'blur')
    );

    // Merge the blur event observable with the valueChanges observable
    merge(this.listForm.valueChanges, ...controlBlurs)
      .pipe(debounceTime(800))
      .subscribe(value => {
        this.displayMessage = this.genericValidator.processMessages(this.listForm);
      });
  }
}

function EmailValidator(confirmEmailInput: string) {
  let confirmEmailControl: FormControl;
  let emailControl: FormControl;

  return (control: FormControl) => {
    if (!control.parent) {
      return null;
    }

    if (!confirmEmailControl) {
      confirmEmailControl = control;
      emailControl = control.parent.get(confirmEmailInput) as FormControl;
      emailControl.valueChanges.subscribe(() => {
        confirmEmailControl.updateValueAndValidity();
      });
    }

    if (emailControl.value &&
      (emailControl.value.toLocaleLowerCase() !==
      confirmEmailControl.value.toLocaleLowerCase())
    ) {
      return {
        notMatch: true
      };
    }
    return null;
  };
}
