import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core'; // <--- 1. Importe o Capacitor

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    this.initializeApp();
  }

  async initializeApp() {
    // 2. Proteja o código com o if
    if (Capacitor.isNativePlatform()) {
      await StatusBar.setStyle({
        style: Style.Light,
      });
    }
  }
}
