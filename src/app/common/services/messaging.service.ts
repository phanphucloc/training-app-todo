import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
@Injectable()
export class MessagingService {
  public currentMessage = new BehaviorSubject(null);

  constructor(
    private angularFireDB: AngularFireDatabase,
    private angularFireAuth: AngularFireAuth,
    private angularFireMessaging: AngularFireMessaging
  ) {
    this.angularFireMessaging.messages.subscribe(
        (messaging: any) => {
            messaging.onMessage = messaging.onMessage.bind(messaging);
            messaging.onTokenRefresh = messaging.onTokenRefresh.bind(messaging);
        }
    );
  }

  public requestPermission(): void {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        console.log(token);
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  public updateToken(userId: string, token: string): void {
    this.angularFireAuth.authState.pipe(take(1)).subscribe(
      () => {
        const data = {};
        data[userId] = token;
        this.angularFireDB.object('fcmTokens/').update(data);
      });
  }

  public receiveMessage(): void  {
    this.angularFireMessaging.messages.subscribe((payload: any) => {
      this.currentMessage.next(payload.notification);
    });
  }

}
