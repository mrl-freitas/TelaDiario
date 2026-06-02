import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { MovieGenres } from '../../services/movie-genres/movie-genres';

@Component({
  selector: 'app-genres',
  templateUrl: './movie-genres.page.html',
  styleUrls: ['./movie-genres.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, RouterModule],
})
export class GenresPage implements OnInit {
  private MovieGenres = inject(MovieGenres);

  genres: any[] = [];

  constructor() {}

  ngOnInit() {
    this.MovieGenres.getMovieGenres().subscribe((response: any) => {
      this.genres = response.genres;
    });
  }
}
