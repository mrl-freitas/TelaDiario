import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.page.html',
  styleUrls: ['./genres.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule],
})
export class GenresPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
