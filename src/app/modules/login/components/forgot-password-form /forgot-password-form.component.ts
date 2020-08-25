import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ValidateService } from 'src/app/common/services/validate-form.service';

@Component({
  selector: 'app-forgot-password-form',
  templateUrl: './forgot-password-form.component.html',
  styleUrls: ['./forgot-password-form.component.scss']
})
export class ForgotFormComponent implements OnInit {
  @Output() forgotEvent = new EventEmitter<string>();

  @Input() errorForm: BehaviorSubject<boolean>;
  @Input() loading: BehaviorSubject<boolean>;

  public forgotForm: FormGroup;

  constructor(
    private validateService: ValidateService
  ) { }

  ngOnInit(): void {
    this.createLogin();
  }

  public createLogin(): void {
    this.forgotForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
        this.validateService.emailValidator
      ])
    });
  }

  public submit(): void {
    this.forgotEvent.emit(this.forgotForm.value.email);
  }
}
