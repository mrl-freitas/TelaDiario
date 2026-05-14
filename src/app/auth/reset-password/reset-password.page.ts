import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonInput,
  IonButton,
  IonItem,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    IonInput,
    IonButton,
    IonItem,
  ],
})
export class ResetPasswordPage implements OnInit {
  constructor() {}
  isPasswordVisibleA = false;
  togglePasswordA() {
    this.isPasswordVisibleA = !this.isPasswordVisibleA;
  }

  isPasswordVisibleB = false;
  togglePasswordB() {
    this.isPasswordVisibleB = !this.isPasswordVisibleB;
  }

  ngOnInit() {}
}
