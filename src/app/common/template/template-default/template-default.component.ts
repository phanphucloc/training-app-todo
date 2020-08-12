import { Component, OnInit, ChangeDetectorRef, LOCALE_ID, Inject } from '@angular/core';

@Component({
  selector: 'app-template-default',
  templateUrl: './template-default.component.html',
  styleUrls: ['./template-default.component.scss']
})
export class TemplateDefaultComponent implements OnInit {

  constructor(
    @Inject(LOCALE_ID) public localeId: string
  ) { }

  ngOnInit(): void {
  }
  switchLanguage(event: any): void {
    window.location.href = '/' + event.value;
  }
}
