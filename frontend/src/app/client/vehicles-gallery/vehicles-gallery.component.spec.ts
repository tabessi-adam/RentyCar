import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclesGalleryComponent } from './vehicles-gallery.component';

describe('VehiclesGalleryComponent', () => {
  let component: VehiclesGalleryComponent;
  let fixture: ComponentFixture<VehiclesGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiclesGalleryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiclesGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
