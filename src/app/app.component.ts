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
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterContentChecked {
  public languageCurrent;
  constructor(
    private cdref: ChangeDetectorRef,
    @Inject(LOCALE_ID) public localeId: string
  ) {}
  ngOnInit(): void {}
  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
  }
  switchLanguage(event: any): void {
    window.location.href = '/' + event.value;
  }
}
