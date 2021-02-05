import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { UserPreferencesService } from 'src/app/@core/services/user-preferences.service';
import { MenuComponent } from './menu/menu.component';

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {

  constructor(
   
    private popover: PopoverController ) { }

  ngOnInit() {}


  openMenu(ev: any) {
    this.popover.create({
      component: MenuComponent,
      event: ev
    }).then((popoverElement) => {
      popoverElement.present();
    })
  }

}
