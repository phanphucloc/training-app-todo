import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UserLogin } from '../../models/auth.model';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ValidateService } from 'src/app/common/services/validate-form.service' ;

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit{
  @Output() loginEvent = new EventEmitter<UserLogin>();
  @Output() loginGoogleEvent = new EventEmitter<string>();

  @Input() errorForm: BehaviorSubject<boolean>;
  @Input() loading: BehaviorSubject<boolean>;
  @Input() loadingGoogle: BehaviorSubject<boolean>;

  public loginForm: FormGroup;

  constructor(private validateService: ValidateService) { }

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
        this.validateService.emailValidator
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

  public loginGoogle(): void{
     this.loginGoogleEvent.emit('submit');
  }
}
