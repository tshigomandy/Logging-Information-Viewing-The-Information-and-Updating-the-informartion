import { RegisterRequest } from './../../models/Requests.model';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordValidatorService } from '../../Validators/password-validator.service';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public errorMessage = '';
  public showError = false;
  public registerForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirm: new FormControl('')
  });

  constructor(
    private authService: AuthService,
    private passwordValidator: PasswordValidatorService,
    private router: Router,
    private avRoute: ActivatedRoute,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.registerForm.controls.confirm.setValidators([Validators.required,
      this.passwordValidator.validateConfirmPassword(this.registerForm.controls.password)]);

  }

  public validateControl = (controlName: string) => {
    return this.registerForm.controls[controlName].invalid && this.registerForm.controls[controlName].touched;
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.registerForm.controls[controlName].hasError(errorName);
  }

  // openDialog(){
  //   const dialogRef = this.dialog.open(RegConfirmDialogComponent,{
  //     width: '350px',
  //   });
  // }

  public onSubmit(): void {
    this.showError = false;
    const request: RegisterRequest = {
      firstName: this.registerForm.controls.firstName.value,
      lastName: this.registerForm.controls.lastName.value,
      email: this.registerForm.controls.email.value,
      phoneNumber: this.registerForm.controls.phoneNumber.value,
      password: this.registerForm.controls.password.value,
      roleId: 1
    };

    this.authService.register(request).subscribe( data => {
      this.router.navigate(['/auth/login']);
      console.log('Successful registration');
    }, (error: any) => {
      console.log(error);

      this.errorMessage = error;
      this.showError = true;
    });

  }


}
