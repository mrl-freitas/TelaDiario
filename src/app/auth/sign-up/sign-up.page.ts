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
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
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
export class SignUpPage implements OnInit {
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
