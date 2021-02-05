import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/@core/services/auth.service';
import { ToastService, ToastType } from 'src/app/@core/services/toast.service';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss'],
})
export class SendEmailComponent implements OnInit {
 sendForm: FormGroup;
  constructor(public modalController: ModalController,
    private fb: FormBuilder,
    private authSvc: AuthService,
    private toast: ToastService,
    private router: Router) { }

  ngOnInit() {
    this.sendForm= this.fb.group({
     email: ['',[Validators.email,Validators.required]]
    });
  }

  dismissModal() {
    this.modalController.dismiss();
  }


  async onReset(){

    try{
      const {email} = this.sendForm.value;
      await this.authSvc.resetPassword(email).then(()=>{
       this.toast.makeToast("Email inviata, controlla la tua inbox!",ToastType.Success);
      }).then(()=>{
        this.modalController.dismiss();
      });
    }
  catch(error){
    this.toast.makeToast(error,ToastType.Error);
  }
  
  
  }

}
