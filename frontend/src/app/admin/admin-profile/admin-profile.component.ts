import { Component } from '@angular/core';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss']
})
export class AdminProfileComponent {

}
