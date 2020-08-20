import {Component, OnInit, AfterContentChecked, ChangeDetectorRef, LOCALE_ID, Inject,} from '@angular/core';
import { MessagingService } from './common/services/messaging.service';
import { Messaging } from 'src/app/common/models/messaging.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, AfterContentChecked {
  public languageCurrent;
  constructor(
    private cdr: ChangeDetectorRef,
    private messagingService: MessagingService,
    private snackBar: MatSnackBar,
    @Inject(LOCALE_ID) public localeId: string
  ) {}
  ngOnInit(): void {
    this.setupPushNotification();
  }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
  }
  public switchLanguage(event: any): void {
    window.location.href = '/' + event.value;
  }

  private setupPushNotification(): void{
    this.messagingService.requestPermission();
    this.messagingService.receiveMessage();
    this.messagingService.currentMessage.subscribe((result: Messaging) => {
      if (result) {
        this.snackBar.open(result.title + ': ' + result.body, null, {
          duration: 2000,
        });
      }
    });
  }
}
