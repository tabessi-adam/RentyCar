import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgenciesDashboardComponent } from './agencies-dashboard.component';

describe('AgenciesDashboardComponent', () => {
  let component: AgenciesDashboardComponent;
  let fixture: ComponentFixture<AgenciesDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgenciesDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgenciesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
