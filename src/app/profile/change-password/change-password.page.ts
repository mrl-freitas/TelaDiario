import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonItem,
  IonInput,
  IonButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    IonItem,
    IonInput,
    IonButton,
    RouterLink,
  ],
})
export class ChangePasswordPage implements OnInit {
  isCurrentPasswordVisible = false;
  isNewPasswordVisible = false;
  isConfirmPasswordVisible = false;

  toggleCurrentPassword(): void {
    this.isCurrentPasswordVisible = !this.isCurrentPasswordVisible;
  }

  toggleNewPassword(): void {
    this.isNewPasswordVisible = !this.isNewPasswordVisible;
  }

  toggleConfirmPassword(): void {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }

  constructor() {}

  ngOnInit() {}
}
