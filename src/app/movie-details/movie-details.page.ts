import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

import { MovieService } from '../services/movie';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  styleUrls: ['./movie-details.page.scss'],
  standalone: true,

  imports: [
    IonicModule,
    CommonModule
  ]
})
export class MovieDetailsPage {

  pastas = [
    {
      nome: 'Filmes'
    }
  ];

  buscaPasta = '';
  seletorPastasAberto = false;
  pastaFavoritaSelecionada = '';

  filme: any = {
    title: 'Filme',
    overview: 'Sinopse indisponivel.',
    backdrop_path: '',
    poster_path: '',
    assistir: false,
    favorito: false
  };

  constructor(
    private roteador: Router,
    private localizacao: Location,
    private servicoFilmes: MovieService
  ) {
    const navegacao = this.roteador.getCurrentNavigation();
    const filmeRecebido = navegacao?.extras.state?.['filme'] || history.state?.filme;

    if (filmeRecebido) {
      this.filme = {
        ...filmeRecebido,
        assistir: this.servicoFilmes.estaMarcadoParaAssistir(filmeRecebido),
        favorito: false
      };
    }
  }

  get imagemBanner() {
    const caminhoImagem = this.filme.backdrop_path || this.filme.poster_path;

    if (!caminhoImagem) {
      return 'assets/banners/Duna.webp';
    }

    return `https://image.tmdb.org/t/p/w780${caminhoImagem}`;
  }

  get sinopse() {
    return this.filme.overview || 'Sinopse indisponivel.';
  }

  voltar() {
    this.localizacao.back();
  }

  navegarPara(rota: string) {
    this.roteador.navigate([rota]);
  }

  alternarFavorito() {
    this.seletorPastasAberto = true;
  }

  alternarAssistir() {
    this.filme.assistir = this.servicoFilmes.alternarParaAssistir(this.filme);
  }

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

    if (!busca) {
      return this.pastas;
    }

    return this.pastas.filter((pasta) =>
      pasta.nome.toLowerCase().includes(busca)
    );
  }

  selecionarPasta(nomePasta: string) {
    this.pastaFavoritaSelecionada = nomePasta;
    this.filme.favorito = true;
    this.fecharSeletorPastas();
  }

  criarPasta() {
    const nomeNovaPasta = this.buscaPasta.trim() || 'Nova pasta';
    const pastaExistente = this.pastas.some((pasta) =>
      pasta.nome.toLowerCase() === nomeNovaPasta.toLowerCase()
    );

    if (!pastaExistente) {
      this.pastas.push({
        nome: nomeNovaPasta
      });
    }

    this.selecionarPasta(nomeNovaPasta);
    this.buscaPasta = '';
  }

}
