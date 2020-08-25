import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/common/services/auth.service';
import { Router } from '@angular/router';
import {
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
  MatSnackBar,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-verify-email-page',
  templateUrl: './verify-email-page.component.html',
  styleUrls: ['./verify-email-page.component.scss'],
})
export class VerifyEmailPageComponent implements OnInit {
  public loading$ = new BehaviorSubject<boolean>(false);

  private horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  private verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    public authService: AuthService,
    public router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  public sendVerificationMail(): void {
    this.loading$.next(true);
    this.authService
      .sendVerificationMail()
      .then((result) => {
        this.loading$.next(false);
        const alertText = $localize`:@@alert-send-successfully:Send successfully. Please check in your email to verify your email`;
        this.showAlert(alertText);
      })
      .catch(() => {
        this.loading$.next(false);
        const alertText = $localize`:@@alert-send-failed:Please try again`;
        this.showAlert(alertText);
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
