import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserLogin } from '../../models/auth.model';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit {
  @Output() registerEvent = new EventEmitter<UserLogin>();

  @Input() errorForm: BehaviorSubject<boolean>;
  @Input() loading: BehaviorSubject<boolean>;

  public registerForm: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.createLogin();
    this.errorForm.subscribe((result) => {
      if (result){
        this.registerForm.setErrors({ incorrect: true });
      }
    });
  }

  public createLogin(): void {
    this.registerForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
        this.EmailValidator
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
    });
  }

  public submit(): void {
    const userLogin: UserLogin = new UserLogin();
    userLogin.email = this.registerForm.value.email;
    userLogin.password = this.registerForm.value.password;
    this.registerEvent.emit(userLogin);
  }

  private EmailValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(control.value).toLowerCase()) && control.value.trim() !== '' ) {
      return { emailIncorrect: true };
    }
    return null;
  }
}
