import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/common/services/auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { UserLogin } from '../../models/auth.model';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  public loading$ = new BehaviorSubject<boolean>(false);
  public errorForm$ = new BehaviorSubject<boolean>(false);
  constructor(private authService: AuthService, public router: Router) {}

  ngOnInit(): void {
  }

  public submit(user: UserLogin): void {
    this.loading$.next(true);
    this.authService
      .login(user.email, user.password)
      .then((result) => {
        console.log(result);
        this.loading$.next(false);
        this.authService.setUserStorage(result.user);
        this.router.navigate(['/todo/list']);
      })
      .catch(() => {
        this.errorForm$.next(true);
        this.loading$.next(false);
      });
  }
}
