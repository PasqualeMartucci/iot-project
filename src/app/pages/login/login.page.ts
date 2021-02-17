import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/@core/models/user.model';
import { AuthService } from 'src/app/@core/services/auth.service';
import { ToastService, ToastType } from 'src/app/@core/services/toast.service';
import { SendEmailComponent } from 'src/app/components/send-email/send-email.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  constructor(private fb: FormBuilder,
    private authSvc: AuthService,
    private router: Router,
    private modalController: ModalController,
    private toast: ToastService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null,[Validators.required]]
    });
  }
  async onLogin() {
    const { email, password } = this.loginForm.value;
    try {
      const user = await this.authSvc.login(email, password);
     if (user) {
        this.checkUserIsVerified(user);
      } 
    } catch (error) {

      console.log(error,"sono qui");
    }
  }

  private checkUserIsVerified(user: User) {
    if (user && user.emailVerified) {
      this.router.navigate(['/home']);
    } else if (user) {
     this.toast.makeToast("Verifica la tua email prima di eseguire l'accesso!",ToastType.Error);
    } else {
      this.router.navigate(['/register']);
    }
  }

  

  async presentModal() {
    const modal = await this.modalController.create({
      component: SendEmailComponent,
    });
    return await modal.present();
  }



}
