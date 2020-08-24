import { Component, OnInit, Output, EventEmitter, SimpleChanges, OnChanges, Input } from '@angular/core';
import { UserLogin } from '../../models/auth.model';
import { FormGroup, FormControl, Validators, AbstractControl} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit{
  @Output() loginEvent = new EventEmitter<UserLogin>();

  @Input() errorForm: BehaviorSubject<boolean>;
  @Input() loading: BehaviorSubject<boolean>;

  public loginForm: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.createLogin();
    this.errorForm.subscribe((result) => {
      if (result){
        this.loginForm.setErrors({ incorrect: true });
      }
    });
  }

  public createLogin(): void {
    this.loginForm = new FormGroup({
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
    userLogin.email = this.loginForm.value.email;
    userLogin.password = this.loginForm.value.password;
    this.loginEvent.emit(userLogin);
  }

  private EmailValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(control.value).toLowerCase()) && control.value.trim() !== '' ) {
      return { emailIncorrect: true };
    }
    return null;
  }
}
