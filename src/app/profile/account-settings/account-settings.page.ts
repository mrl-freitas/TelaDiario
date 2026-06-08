import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { RouterLink } from '@angular/router';
import {
  mailOutline,
  lockClosedOutline,
  chevronForwardOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.page.html',
  styleUrls: ['./account-settings.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonIcon, RouterLink],
})
export class AccountSettingsPage implements OnInit {
  constructor() {
    addIcons({
      'mail-outline': mailOutline,
      'lock-closed-outline': lockClosedOutline,
      'chevron-forward-outline': chevronForwardOutline,
    });
  }

  ngOnInit() {}
}
