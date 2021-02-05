import { NgModule, Directive, ElementRef } from '@angular/core';
@Directive({
  selector: '[appScrollbarTheme]'
})
export class ScrollbarThemeDirective {
  constructor(el: ElementRef) {
    const stylesheet = `
      ::-webkit-scrollbar {
      width: 10px;
      }
      ::-webkit-scrollbar-track {
      background: #b30000;
      }
      ::-webkit-scrollbar-thumb {
      border-radius: 1rem;
      background: linear-gradient(var(--ion-color-light-tint), var(--ion-color-light));
      border: 4px solid #b30000;
      }
      ::-webkit-scrollbar-thumb:hover {
      }
    `;

    const styleElmt = el.nativeElement.shadowRoot.querySelector('style');

    if (styleElmt) {
      styleElmt.append(stylesheet);
    } else {
      const barStyle = document.createElement('style');
      barStyle.append(stylesheet);
      el.nativeElement.shadowRoot.appendChild(barStyle);
    }

  }
}


@NgModule({
  declarations: [ ScrollbarThemeDirective ],
  exports: [ ScrollbarThemeDirective ]
})
export class ScrollbarThemeModule {}