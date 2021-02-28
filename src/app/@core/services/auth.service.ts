import { User } from '../models/user.model';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of, Subscription } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import { ToastService, ToastType } from './toast.service';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { RoleValidator } from '../models/roleValidator';


@Injectable({ providedIn: 'root' })
export class AuthService  extends RoleValidator  {
  public user$: Observable<User>;
  private _user: firebase.User;
  users: Observable<User[]>;
  users_family: Observable<User[]>;
  myUser: Observable<User[]>;
  subscription: Subscription;
  
  constructor(public afAuth: AngularFireAuth,
    private toastr: ToastService, 
    private afs: AngularFirestore,
    private router: Router) {
    super();
   this.user$ = this.afAuth.authState.pipe(
    switchMap(firebaseUser => {
      this._user = firebaseUser;
      if (!firebaseUser) return of(null);
      return this.afs.doc<User>(`users/${firebaseUser.uid}`).valueChanges();
    }),
    shareReplay(1)
  );

  this.users = this.afs.collection<User>('users').snapshotChanges().pipe(
    map(actions => actions.filter(a => a.payload.doc.id != this.userID && a.payload.doc.data().idFamiglia != this.userID ).map(a => {
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      return { id, ...data };
    }))
  );

  this.users_family = this.afs.collection<User>('users').snapshotChanges().pipe(
    map(actions => actions.filter(a => a.payload.doc.data().idFamiglia == this.userID).map(a => {
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      return { id, ...data };
    }))
  );
  
 
  this.myUser = this.afs.collection<User>('users').snapshotChanges().pipe(
    map(actions => actions.filter(a => a.payload.doc.id == this.userID).map(a => {
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      return { id, ...data };
    }))
  );
 
  }


  get userID() {
    return this._user.uid;
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

  async register(email: string, password: string, Name:string,latitude,longitude,ssid): Promise<User> {
    try {
      const { user }  = await this.afAuth.createUserWithEmailAndPassword(email,password);
       user.updateProfile({
        displayName: Name,
      })
      this.updateUserData(user,Name,latitude,longitude,ssid);
      await this.sendVerificationEmail().then(()=>{
        this.afAuth.signOut();
      });
      this.toastr.makeToast("Registrazione effettua con successo, controlla la tua mail box !",ToastType.Success);
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

  public updateUserData(user: User,Name: string,latitude,longitude,ssid) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );
   

    const data: User = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: Name,
      latitude: latitude,
      longitude: longitude,
      ssid: ssid,
      role: 'USER',
    };


    return userRef.set(data, { merge: true });
  }

  public ssid(id: string) {
    const userRef= this.afs.doc(`users/${this.userID}`);
  
    const data = {
      ssid: id,
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
    };
    return userRef.set(data, { merge: true });
  } 


   addMembro(uid,ssid,latitude,longitude){
  
   const ref = this.afs.doc(`famiglia/${this.userID}`);   
   ref.valueChanges().subscribe(response=>{
     if(response == undefined){
     this.afs.collection("famiglia").doc(this.userID).set({
       idFamiglia: this.userID
     }).then(()=>{
       this.afs.collection("users").doc(uid).update({
         idFamiglia: this.userID
       });
       this.afs.collection("dispositivi").doc(ssid).update({
        latitude: latitude ,
        longitude: longitude,
        
       })
     });
     }else{
      this.afs.collection("users").doc(uid).update({
        idFamiglia: this.userID
      });
     }
     

   });
   this.toastr.makeToast("Membro aggiunto con successo",ToastType.Success);


   }


   deleteUser(uid){
   this.afs.collection("users").doc(uid).update({
     idFamiglia: firebase.firestore.FieldValue.delete()
   }).then(()=>{
     this.toastr.makeToast("Utente eliminato con successo",ToastType.Success);
   })

   }



}