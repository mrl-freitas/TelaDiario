import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

import { MovieService } from '../../services/search/movie';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  styleUrls: ['./movie-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class MovieDetailsPage {
  pastas = [{ nome: 'Filmes' }];

  buscaPasta = '';
  seletorPastasAberto = false;
  pastaFavoritaSelecionada = '';

  filme: any = {
    title: 'Filme',
    overview: 'Sinopse indisponivel.',
    backdrop_path: '',
    poster_path: '',
    favorito: false,
  };

  constructor(
    private roteador: Router,
    private localizacao: Location,
    private servicoFilmes: MovieService,
  ) {
    const navegacao = this.roteador.getCurrentNavigation();
    const filmeRecebido =
      navegacao?.extras.state?.['filme'] || history.state?.filme;

    if (filmeRecebido) {
      this.filme = {
        ...filmeRecebido,
        favorito: false,
      };
    }
  }

  // =====================
  // UI helpers
  // =====================

  get imagemBanner() {
    const caminho = this.filme.backdrop_path || this.filme.poster_path;

    if (!caminho) {
      return 'assets/banners/Duna.webp';
    }

    return `https://image.tmdb.org/t/p/w780${caminho}`;
  }

  get sinopse() {
    return this.filme.overview || 'Sinopse indisponivel.';
  }

  // =====================
  // navegação
  // =====================

  voltar() {
    this.localizacao.back();
  }

  navegarPara(rota: string) {
    this.roteador.navigate([rota]);
  }

  // =====================
  // ✔️ assistido
  // =====================

  alternarAssistir() {
    this.servicoFilmes.alternarAssistido(this.filme);
  }

  estaAssistido(): boolean {
    return this.servicoFilmes.estaAssistido(this.filme);
  }

  // =====================
  // ⭐ favorito (placeholder atual)
  // =====================

  alternarFavorito() {
    this.seletorPastasAberto = true;
  }

  // =====================
  // pastas
  // =====================

  fecharSeletorPastas() {
    this.seletorPastasAberto = false;
    this.buscaPasta = '';
  }

  atualizarBuscaPasta(evento: Event) {
    const campo = evento.target as HTMLInputElement;
    this.buscaPasta = campo.value;
  }

  get pastasFiltradas() {
    const busca = this.buscaPasta.trim().toLowerCase();

    if (!busca) return this.pastas;

    return this.pastas.filter((pasta) =>
      pasta.nome.toLowerCase().includes(busca),
    );
  }

  selecionarPasta(nomePasta: string) {
    this.pastaFavoritaSelecionada = nomePasta;
    this.filme.favorito = true;
    this.fecharSeletorPastas();
  }

  criarPasta() {
    const nomeNovaPasta = this.buscaPasta.trim() || 'Nova pasta';

    const existe = this.pastas.some(
      (pasta) => pasta.nome.toLowerCase() === nomeNovaPasta.toLowerCase(),
    );

    if (!existe) {
      this.pastas.push({ nome: nomeNovaPasta });
    }

    this.selecionarPasta(nomeNovaPasta);
    this.buscaPasta = '';
  }
}
