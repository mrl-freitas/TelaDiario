import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-folder-details',
  templateUrl: './folder-details.page.html',
  styleUrls: ['./folder-details.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule],
})
export class FolderDetailsPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
