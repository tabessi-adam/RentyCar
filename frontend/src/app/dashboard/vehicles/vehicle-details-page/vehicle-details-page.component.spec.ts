import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDetailsPageComponent } from './vehicle-details-page.component';

describe('VehicleDetailsPageComponent', () => {
  let component: VehicleDetailsPageComponent;
  let fixture: ComponentFixture<VehicleDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleDetailsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
