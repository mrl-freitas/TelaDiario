import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(private router: Router) {
    App.addListener('appUrlOpen', (event) => {
      console.log('URL recebida:', event.url);

      try {
        const url = new URL(event.url);

        const mode = url.searchParams.get('mode');
        const oobCode = url.searchParams.get('oobCode');

        console.log('mode:', mode);
        console.log('oobCode:', oobCode);

        if (mode === 'resetPassword' && oobCode) {
          this.router.navigate(['/reset-password'], {
            queryParams: {
              code: oobCode,
            },
          });
        }
      } catch (error) {
        console.error('Erro ao processar Deep Link:', error);
      }
    });
  }
}
