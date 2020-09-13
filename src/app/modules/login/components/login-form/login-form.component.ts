import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UserLogin } from '../../models/auth.model';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ValidateService } from 'src/app/common/services/validate-form.service';
import { AuthService } from 'src/app/common/services/auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit{
  public loginForm: FormGroup;
  public loading$ = new BehaviorSubject<boolean>(false);
  public loadingGoogle$ = new BehaviorSubject<boolean>(false);
  public messageError: string;

  constructor(private validateService: ValidateService, private authService: AuthService) { }

  public ngOnInit(): void {
    this.createLoginForm();
  }

  public createLoginForm(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
        this.validateService.emailValidator
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
    });
  }

  public submitLogin(): void {
    this.loading$.next(true);
    this.authService
      .login(this.loginForm.value.email, this.loginForm.value.password)
      .pipe(
        first()
      )
      .subscribe((result) => {
        this.loading$.next(false);
      }, (res) => {
        this.loginForm.setErrors({ incorrect: true, message : res.message });
        this.loading$.next(false);
      });
  }

  public submitLoginGoogle(): void{
    this.loadingGoogle$.next(true);
    this.authService
      .loginGoogle()
      .pipe(
        first()
      )
      .subscribe((result) => {
        this.loadingGoogle$.next(false);
      }, (err) => {
        this.loadingGoogle$.next(false);
      });
  }
}
