import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteOfficeComponent } from './delete-office.component';

describe('DeleteOfficeComponent', () => {
  let component: DeleteOfficeComponent;
  let fixture: ComponentFixture<DeleteOfficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteOfficeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
