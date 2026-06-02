import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnimeGenresPage } from './animes-genres.page';

describe('AnimeGenresPage', () => {
  let component: AnimeGenresPage;
  let fixture: ComponentFixture<AnimeGenresPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimeGenresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
