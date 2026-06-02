import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { AnimesGenres } from '../../services/animes-genres/animes-genres';

@Component({
  selector: 'app-anime-genres',
  templateUrl: './animes-genres.page.html',
  styleUrls: ['./animes-genres.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, RouterModule],
})
export class AnimeGenresPage implements OnInit {
  private AnimesGenres = inject(AnimesGenres);
  constructor() {}
  genres: any[] = [];

  ngOnInit() {
    this.AnimesGenres.getGenres().subscribe((res: any) => {
      this.genres = res.genres;
    });
  }
}
