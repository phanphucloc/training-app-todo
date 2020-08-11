import { Component, OnInit, AfterViewInit, AfterViewChecked, AfterContentChecked, ChangeDetectorRef, LOCALE_ID, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterContentChecked {
  public languageCurrent;
  constructor(
    private cdref: ChangeDetectorRef,
    private translateService: TranslateService,
    @Inject(LOCALE_ID) protected localeId: string) {
  }
  ngOnInit(): void {
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
    console.log(this.localeId);
  }
  ngAfterContentChecked(): void {
    this.languageCurrent = this.translateService.currentLang;
    this.cdref.detectChanges();
  }
  switchLanguage(event: any): void {
    console.log(event);
    this.translateService.use(event.value);
    window.location.href = '/' + event.value;
  }
}
