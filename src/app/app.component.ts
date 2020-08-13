import {
  Component,
  OnInit,
  AfterContentChecked,
  ChangeDetectorRef,
  LOCALE_ID,
  Inject,
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, AfterContentChecked {
  public languageCurrent;
  constructor(
    private cref: ChangeDetectorRef,
    @Inject(LOCALE_ID) public localeId: string
  ) {}
  ngOnInit(): void {}
  ngAfterContentChecked(): void {
    this.cref.detectChanges();
  }
  switchLanguage(event: any): void {
    window.location.href = '/' + event.value;
  }
}
