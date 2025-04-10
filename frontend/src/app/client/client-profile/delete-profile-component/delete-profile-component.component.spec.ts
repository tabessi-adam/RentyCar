import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteProfileComponentComponent } from './delete-profile-component.component';

describe('DeleteProfileComponentComponent', () => {
  let component: DeleteProfileComponentComponent;
  let fixture: ComponentFixture<DeleteProfileComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteProfileComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteProfileComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
