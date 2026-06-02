import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { SeriesGenres } from '../../services/series-genres/series-genres';

@Component({
  selector: 'app-series-genres',
  templateUrl: './series-genres.page.html',
  styleUrls: ['./series-genres.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, RouterModule],
})
export class SeriesGenresPage implements OnInit {
  private SeriesGenres = inject(SeriesGenres);
  constructor() {}

  genres: any[] = [];

  ngOnInit() {
    this.SeriesGenres.getTvGenres().subscribe((response: any) => {
      this.genres = response.genres;
    });
  }
}
