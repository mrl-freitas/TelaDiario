import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FolderDetailsPage } from './folder-details.page';

describe('FolderDetailsPage', () => {
  let component: FolderDetailsPage;
  let fixture: ComponentFixture<FolderDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
