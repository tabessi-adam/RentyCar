import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSidebarComponentComponent } from './profile-sidebar-component.component';

describe('ProfileSidebarComponentComponent', () => {
  let component: ProfileSidebarComponentComponent;
  let fixture: ComponentFixture<ProfileSidebarComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileSidebarComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileSidebarComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
