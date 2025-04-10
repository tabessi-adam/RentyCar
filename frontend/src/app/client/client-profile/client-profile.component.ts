import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ProfileSidebarComponent } from './profile-sidebar-component/profile-sidebar.component';
import { EditProfileComponent } from './edit-profile-component/edit-profile.component';
import { DeleteProfileComponent } from './delete-profile-component/delete-profile.component';
@Component({
  selector: 'app-client-profile',
  imports: [
    NavbarComponent,
    FooterComponent,
    ProfileSidebarComponent,
    EditProfileComponent,
    DeleteProfileComponent
  ],
  templateUrl: './client-profile.component.html',
  styleUrl: './client-profile.component.scss'
})
export class ClientProfileComponent {
  activePage: 'edit' | 'delete' = 'edit';

  onPageChange(page: 'edit' | 'delete') {
    this.activePage = page;
  }
}
