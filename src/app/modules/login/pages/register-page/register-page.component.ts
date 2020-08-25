import { Component, OnInit } from '@angular/core';
import { UserLogin } from '../../models/auth.model';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/common/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {
  public loading$ = new BehaviorSubject<boolean>(false);
  public errorForm$ = new BehaviorSubject<boolean>(false);

  constructor(private authService: AuthService, public router: Router) { }

  ngOnInit(): void {
  }

  public submit(user: UserLogin): void {
    this.loading$.next(true);
    this.authService
      .signUp(user.email, user.password)
      .then((result) => {
        this.authService.user = result.user;
        this.authService.sendVerificationMail().then(() => {
          this.router.navigate(['/auth/verify-email']);
        });
        this.authService.setUserData();
      })
      .catch((error) => {
        window.alert(error.message);
        this.errorForm$.next(true);
        this.loading$.next(false);
      });
  }
}
