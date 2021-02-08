import { User } from '../models/user.model';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
//import { RoleValidator } from 'src/app/auth/helpers/roleValidator';
import { ToastService, ToastType } from './toast.service';
import { Router } from '@angular/router';
import firebase from 'firebase/app';


@Injectable({ providedIn: 'root' })
export class AuthService /* extends RoleValidator */ {
  public user$: Observable<User>;
  private _user: firebase.User;
  constructor(public afAuth: AngularFireAuth,
    private toastr: ToastService, 
    private afs: AngularFirestore,
    private router: Router) {
   // super();
   this.user$ = this.afAuth.authState.pipe(
    switchMap(firebaseUser => {
      this._user = firebaseUser;
      if (!firebaseUser) return of(null);
      return this.afs.doc<User>(`users/${firebaseUser.uid}`).valueChanges();
    }),
    shareReplay(1)
  );

  }

  async resetPassword(userEmail: string): Promise<void> {
    try {
      return this.afAuth.sendPasswordResetEmail(userEmail);
    } catch (error) {
      this.toastr.makeToast(error,ToastType.Error);
    }
  }

  async sendVerificationEmail(): Promise<void> {
    return (await this.afAuth.currentUser).sendEmailVerification();
  }


  async login(email: string, password: string): Promise<User> {
    try {
      const { user } = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      this.updateUserData2(user);
      this.toastr.makeToast("Login effettuato con successo",ToastType.Success);
      return user;
    } catch (error) {
      this.toastr.makeToast(error,ToastType.Error);
      console.log(error);
    }
  }

  async register(email: string, password: string, Name:string): Promise<User> {
    try {
      const { user }  = await this.afAuth.createUserWithEmailAndPassword(email,password);
       user.updateProfile({
        displayName: Name,
      })
      this.updateUserData(user,Name);
      this.toastr.makeToast("Registrazione effettua con successo, controlla la tua mail box !",ToastType.Success);
      await this.sendVerificationEmail();
      return user;
    } catch (error) {
      this.toastr.makeToast(error,ToastType.Error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut().then(()=>{
        this.router.navigate(['/login']);
        this.toastr.makeToast("Logout effettuato con successo",ToastType.Success);
      });
    } catch (error) {
      this.toastr.makeToast(error,ToastType.Error);
    }
  }

  public updateUserData(user: User,Name: string) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );


    const data: User = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: Name,
      //role: 'TEORIA',
    };


    return userRef.set(data, { merge: true });
  }



  updateUserData3(data: any) {
    return this.afs.collection('users').doc(`/${this._user.uid}`).update({ ...data })
  }

 

  public updateUserData2(user: User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );
    const data: User = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName:  user.displayName,
    };
    return userRef.set(data, { merge: true });
  }




}
