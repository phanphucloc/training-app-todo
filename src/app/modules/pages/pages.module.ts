import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { HomeComponent } from './components/home/home.component';
import { MatDialogModule } from '@angular/material/dialog';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [HomeComponent, LoginComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PagesRoutingModule,
    MatDialogModule,
    MatCardModule,
    MatInputModule,
    MatSnackBarModule,
  ]
})
export class PagesModule { }
