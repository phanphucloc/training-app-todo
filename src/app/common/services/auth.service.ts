import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';
import { Observable, from } from 'rxjs';
import { UserModel } from 'src/app/common/models/auth.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { first, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public user: UserModel;

  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    private fireStore: AngularFirestore
  ) {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.afAuth.authState.subscribe((user: User) => {
      this.handleLoginLogout(user);
    });
  }

  public get isLoggedIn(): boolean {
    return JSON.parse(localStorage.getItem('user'));
  }

  public login(email: string, password: string): Observable<auth.UserCredential> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password));
  }

  public loginGoogle(): Observable<auth.UserCredential> {
    return from(this.authLogin(new auth.GoogleAuthProvider())).pipe(
      tap((result: auth.UserCredential) => {
        this.setUserData(result.user);
      })
    );
  }

  public setUserData(user: User): Observable<void> {
    const userRef = this.fireStore.doc(`users/${this.user.uid}`);
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified,
    };
    return from(
      userRef.set(userData, {
        merge: true,
      })
    );
  }

  public logout(): Observable<void> {
    return from(this.afAuth.signOut());
  }

  private authLogin(provider): Promise<auth.UserCredential> {
    return this.afAuth.signInWithPopup(provider);
  }

  private handleLoginLogout(user: User): void {
    if (user) {
      this.user = new UserModel();
      this.user.uid = user.uid;
      this.user.displayName = user.displayName;
      this.user.email = user.email;
      this.user.emailVerified = user.emailVerified;
      from(user.getIdTokenResult())
        .pipe(
          first()
        )
        .subscribe((tokenResult: auth.IdTokenResult) => {
          this.user.expirationTime = tokenResult.expirationTime;
          this.user.accessToken = tokenResult.token;
          localStorage.setItem('user', JSON.stringify(this.user));
          this.router.navigate(['/todo/list']);
        });
    } else {
      localStorage.setItem('user', null);
      this.router.navigate(['auth/login']);
    }
  }
}
