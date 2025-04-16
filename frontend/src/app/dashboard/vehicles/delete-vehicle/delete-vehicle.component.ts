import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-vehicle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-vehicle.component.html',
  styleUrls: ['./delete-vehicle.component.scss']
})
export class DeleteVehicleComponent {
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
  
  isOpen = false;
  vehicleName = '';

  open(vehicleName: string) {
    this.vehicleName = vehicleName;
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  onConfirm() {
    this.confirmed.emit();
    this.close();
  }

  onCancel() {
    this.cancelled.emit();
    this.close();
  }
} 