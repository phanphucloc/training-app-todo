import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SecureInnerPagesGuard } from 'src/app/common/guard/secure-inner-pages.guard';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { VerifyEmailPageComponent } from './pages/verify-email-page/verify-email-page.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [SecureInnerPagesGuard]
  },
  {
    path: 'register',
    component: RegisterPageComponent,
    canActivate: [SecureInnerPagesGuard]
  },
  {
    path: 'verify-email',
    component: VerifyEmailPageComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
