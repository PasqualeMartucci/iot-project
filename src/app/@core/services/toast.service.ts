import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

export const enum ToastType {
    Default = 'default',
    Success = 'success',
    Error = 'error'
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private toast: HTMLIonToastElement;

    constructor(private toastController: ToastController) {

    }

    async makeToast(message: string, mode: ToastType = ToastType.Default): Promise<any> {
        const duration = mode == ToastType.Default ? 1000 : 3000;
        const position = mode == ToastType.Default ? 'middle' : 'bottom';
        var cssClass = `custom-toast`;
        var buttons = [];
        if (mode != ToastType.Default) {
            cssClass += ` ${mode}`;
            switch (mode) {
                case ToastType.Success:
                    buttons.push(
                        {
                            side: 'start',
                            icon: 'checkmark-circle-sharp',
                        }
                    )
                    break;

                case ToastType.Error:
                    buttons.push(
                        {
                            side: 'start',
                            icon: 'alert-circle-sharp'
                        }
                    )
                    break;

                default:
                    break;
            }
        }

        if (this.toast) this.toast.dismiss();

        this.toast = await this.toastController.create({
            buttons: buttons,
            message: message,
            duration: duration,
            position: position,
            cssClass: cssClass
        });

        this.toast.present();

        return this.toast.onDidDismiss();
    }
}