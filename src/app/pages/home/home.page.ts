import { Component, OnInit } from '@angular/core';
import { ToastService, ToastType } from 'src/app/@core/services/toast.service';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/@core/services/auth.service';
import { User } from 'src/app/@core/models/user.model';
import { Subscription } from 'rxjs';
import { LockService } from 'src/app/@core/services/lock.service';
import { AngularFirestore } from '@angular/fire/firestore';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {
  users: User[] = [];
  subscription: Subscription;
  ssid: string;
  lock;
  door;
  status;
constructor(public toast: ToastService,
  public alertController: AlertController,
  private auth: AuthService,
  private lockSvc: LockService,
  private afs: AngularFirestore) { }


readLock(){

  this.lockSvc.users.subscribe((response)=> {
    this.ssid = response[0].ssid;
   });
   

   setTimeout(()=>{ 
  const ref = this.afs.collection("dispositivi").doc(this.ssid);
  ref.valueChanges().subscribe(response=>{
    this.status = response["lock"];
    });
  
  }, 1200)

}


ngOnInit(){

   this.lockSvc.users.subscribe((response)=> {
    this.ssid = response[0].ssid;
   });
   

   setTimeout(()=>{ 
  const ref = this.afs.collection("dispositivi").doc(this.ssid);
  ref.valueChanges().subscribe(response=>{
    this.status = response["lock"];
    });
  
  }, 1200)
}



async lockUnlock(){
 await this.lockSvc.users.subscribe((response)=> {
  this.ssid = response[0].ssid;
 });
 
 setTimeout(()=>{
const ref = this.afs.collection("dispositivi").doc(this.ssid);
ref.valueChanges().subscribe(response=>{
  this.lock = !response["lock"];
  this.door = response["porta"];
  });

}, 100)

setTimeout(()=>{
  const ref = this.afs.collection("dispositivi").doc(this.ssid);
  if(!this.door){
    return ref.update({
      lock: this.lock,
       }).then(()=>{
         this.readLock();
        this.toast.makeToast("Serratura aperta con successo!",ToastType.Success);

       })
  }else{
    this.toast.makeToast("Non puoi aprire o chiudere la serratura, la porta è aperta!",ToastType.Error);
  }

  
  }, 250)

}







}






