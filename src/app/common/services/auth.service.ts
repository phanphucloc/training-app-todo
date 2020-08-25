import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';
import { throwError, of } from 'rxjs';
import { StatusRequest } from 'src/app/common/models/auth.model';
import {
  AngularFirestore,
} from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public user: User;
  public userFromLocalStorage: any;

  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    private fireStore: AngularFirestore
  ) {
    this.afAuth.authState.subscribe((user: User) => {
      console.log(user);
      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
      } else {
        localStorage.setItem('user', null);
      }
    });
  }

  get isLoggedIn(): boolean {
    this.userFromLocalStorage = JSON.parse(localStorage.getItem('user'));
    return this.userFromLocalStorage !== null;
  }

  public setUserStorage(user: User): void {
    if (user) {
      this.user = user;
      localStorage.setItem('user', JSON.stringify(this.user));
    } else {
      localStorage.setItem('user', null);
    }
  }

  public login(email: string, password: string): Promise<auth.UserCredential> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  public loginGoogle(): Promise<auth.UserCredential>{
    return this.authLogin(new auth.GoogleAuthProvider());
  }

  public authLogin(provider): Promise<auth.UserCredential> {
    return this.afAuth.signInWithPopup(provider);
  }

  public setUserData(): Promise<void>{
    const userRef = this.fireStore.doc(`users/${this.user.uid}`);
    const userData = {
      uid: this.user.uid,
      email: this.user.email,
      displayName: this.user.displayName,
      emailVerified: this.user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }


  public async logout(): Promise<any> {
    await this.afAuth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['auth/login']);
  }

  public checkAuthAPI(result: any): any {
    const checkResult = this.checkExpirationToken();
    if (!checkResult.status) {
      return throwError(checkResult.message);
    }
    return of(result);
  }

  public checkExpirationToken(): StatusRequest {
    const infoUser = JSON.parse(localStorage.getItem('user'));
    const expirationTime = infoUser?.stsTokenManager?.expirationTime;

    if (
      !this.isLoggedIn ||
      !expirationTime ||
      new Date().getTime() > expirationTime
    ) {
      return {
        status: false,
        message: $localize`:@@token-has-expired:token-has-expired`,
      };
    }

    return {
      status: true,
      message: null,
    };
  }
}
