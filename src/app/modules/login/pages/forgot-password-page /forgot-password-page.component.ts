import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/common/services/auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password-page',
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.scss'],
})
export class ForgotPasswordPageComponent implements OnInit {
  public loading$ = new BehaviorSubject<boolean>(false);
  public errorForm$ = new BehaviorSubject<boolean>(false);

  private horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  private verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    private authService: AuthService,
    public router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  public submit(email: string): void {
    this.loading$.next(true);
    this.authService
      .forgotPassword(email)
      .then((result) => {
        this.loading$.next(false);
        const alertText = 'Sent successfully. Please check in your email to change your password';
        this.showAlert(alertText);
      })
      .catch(() => {
        this.errorForm$.next(true);
        this.loading$.next(false);
      });
  }

  public showAlert(alertText: string): void {
    this.snackBar.open(alertText, null, {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
}
