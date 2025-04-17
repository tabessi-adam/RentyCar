import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Office } from '../../../core/models/office.model';

@Component({
  selector: 'app-view-offices',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './view-offices.component.html',
  styleUrl: './view-offices.component.scss'
})
export class ViewOfficesComponent {
  @Output() closed = new EventEmitter<void>();
  @Input() office: Office | null = null;
  isOpen = false;

  open(office: Office) {
    this.office = office;
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.office = null;
    this.closed.emit();
  }
}
