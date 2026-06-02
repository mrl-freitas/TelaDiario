import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeriesGenresPage } from './series-genres.page';

describe('SeriesGenresPage', () => {
  let component: SeriesGenresPage;
  let fixture: ComponentFixture<SeriesGenresPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesGenresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
