import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

import { MovieService } from '../../services/movie';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SearchPage {
  termoBusca = this.servicoFilmes.termoBusca;
  filmes: any[] = this.servicoFilmes.filmes;

  constructor(
    private servicoFilmes: MovieService,
    private localizacao: Location,
    private roteador: Router
  ) {}

  voltar() {
    this.localizacao.back();
  }

  buscarFilmes() {
    this.servicoFilmes.termoBusca = this.termoBusca;

    if (!this.termoBusca.trim()) {
      this.filmes = [];
      this.servicoFilmes.filmes = [];
      return;
    }

    this.servicoFilmes.searchMovies(this.termoBusca).subscribe((resposta: any) => {
      this.filmes = resposta.results;
      this.servicoFilmes.filmes = resposta.results;
    });
  }

  estaMarcadoParaAssistir(filme: any) {
    return this.servicoFilmes.estaMarcadoParaAssistir(filme);
  }

  abrirDetalhes(filme: any) {
    this.roteador.navigate(['/movie-details'], {
      state: { filme }
    });
  }
}
