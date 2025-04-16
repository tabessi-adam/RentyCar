import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class AddVehicleComponent {
  @Output() vehicleAdded = new EventEmitter<any>();
  isOpen = false;
  vehicleForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.vehicleForm = this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      fuelType: ['PETROL', Validators.required],
      transmission: ['MANUAL', Validators.required],
      pricePerDay: ['', [Validators.required, Validators.min(0)]],
      hasGPS: [true],
      hasBluetooth: [true],
      hasAirConditioning: [true],
      hasUSBCable: [true],
      officeId: ['', Validators.required],
      status: ['AVAILABLE', Validators.required]
    });
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.vehicleForm.reset({
      fuelType: 'PETROL',
      transmission: 'MANUAL',
      hasGPS: true,
      hasBluetooth: true,
      hasAirConditioning: true,
      hasUSBCable: true,
      status: 'AVAILABLE'
    });
  }

  onSubmit() {
    if (this.vehicleForm.valid) {
      this.vehicleAdded.emit(this.vehicleForm.value);
      this.close();
    }
  }
} 