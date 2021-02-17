import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './@core/models/user.model';
import { AuthService } from './@core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  navigate: any;   navigate2: any; 
  public user$: Observable<User> = this.authSvc.afAuth.user;
  user : User;
  constructor(public authSvc: AuthService) {}

    ngOnInit()
    {
        
          this.navigate =
          [
            {
              title : "Home",
              url   : "/home",
              icon  : "home"
            },
            {
              title : "Login",
              url   : "/login",
              icon  : "log-in-outline"
            },
          ];

          this.navigate2 =
          [
            {
              title : "Home",
              url   : "/home",
              icon  : "home"
            },
            {
              title : "Profilo",
              url   : "/profile",
              icon  : "person-circle-outline"
            },
            {
              title : "Amministratore",
              url   : "/admin",
              icon  : "document-lock-outline"
            },
          ];
    }



    
}



