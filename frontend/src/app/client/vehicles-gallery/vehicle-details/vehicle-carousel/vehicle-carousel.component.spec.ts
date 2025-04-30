import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleCarouselComponent } from './vehicle-carousel.component';

describe('VehicleCarouselComponent', () => {
  let component: VehicleCarouselComponent;
  let fixture: ComponentFixture<VehicleCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleCarouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
