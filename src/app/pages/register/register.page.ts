import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/@core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;

  constructor(private authSvc: AuthService,
     private fb: FormBuilder,
     private router: Router) { }

  ngOnInit() {
    this.registerForm= this.fb.group({
      email: new FormControl('',[Validators.required,Validators.email]),
      password: new FormControl('',Validators.minLength(6)),
      displayName: new FormControl('',Validators.required),
    })
  }

  onRegister() {
    var {email,password,displayName} = this.registerForm.value;
    this.authSvc.register(email,password,displayName).then(()=>{
      this.router.navigate(['/login']);
    });
  }
 


}
