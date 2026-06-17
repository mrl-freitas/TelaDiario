import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth';
import {
  settingsOutline,
  starOutline,
  chevronForwardOutline,
  logOutOutline,
  peopleOutline,
} from 'ionicons/icons';
import { IonContent, IonIcon, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    IonContent,
    IonIcon,
    IonButton,
    RouterLink,
  ],
})
export class ProfilePage implements OnInit {
  isModalOpen = false;
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    addIcons({
      'people-outline': peopleOutline,
      'settings-outline': settingsOutline,
      'star-outline': starOutline,
      'chevron-forward-outline': chevronForwardOutline,
      'log-out-outline': logOutOutline,
    });
  }

  async sair() {
    await this.authService.logout();

    this.router.navigateByUrl('/login', {
      replaceUrl: true,
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
  ngOnInit() {}
}
