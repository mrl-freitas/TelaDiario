import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonInput,
  IonButton,
  IonItem,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    IonInput,
    IonButton,
    IonItem,
    RouterLink,
  ],
})
export class LoginPage implements OnInit {
  isPasswordVisible = false;
  constructor() {}

  togglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  ngOnInit() {}
}
