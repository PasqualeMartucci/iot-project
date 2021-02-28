import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class LockService {
  users: Observable<User[]>;
 
  constructor(private afs: AngularFirestore,private toast: ToastService,private auth: AuthService) { 

    this.users = this.afs.collection<User>('users').snapshotChanges().pipe(
      map(actions => actions.filter(a => a.payload.doc.id == this.auth.userID).map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

    
  }



 

}
