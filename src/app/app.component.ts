import { Component, OnInit, AfterContentChecked, ChangeDetectorRef, LOCALE_ID, Inject} from '@angular/core';
import { AuthService } from './common/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, AfterContentChecked {
  public languageCurrent;
  constructor(
    @Inject(LOCALE_ID) public localeId: string,
    public authService: AuthService,
    public router: Router,
    private cdr: ChangeDetectorRef,
  ) {}
  ngOnInit(): void {}

  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
  }

  public switchLanguage(event: any): void {
    window.location.href = '/' + event.value;
  }

  public logout(): void{
    this.authService.logout().subscribe();
  }
}
