import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Vehicle } from '../../../core/models/vehicle.model';

@Component({
  selector: 'app-edit-vehicle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-vehicle.component.html',
  styleUrls: ['./edit-vehicle.component.scss']
})
export class EditVehicleComponent {
  @Output() vehicleUpdated = new EventEmitter<Vehicle>();
  @Input() set vehicle(value: Vehicle) {
    if (value) {
      this.vehicleForm.patchValue({
        brand: value.brand,
        model: value.model,
        year: value.year,
        fuelType: value.fuelType,
        transmission: value.transmission,
        pricePerDay: value.pricePerDay,
        hasGPS: value.hasGPS,
        hasBluetooth: value.hasBluetooth,
        hasAirConditioning: value.hasAirConditioning,
        hasUSBCable: value.hasUSBCable,
        officeId: value.officeId,
        status: value.status
      });
      this._vehicle = value;
    }
  }
  
  private _vehicle: Vehicle | null = null;
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

  open(vehicle: Vehicle) {
    this.vehicle = vehicle;
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
    if (this.vehicleForm.valid && this._vehicle) {
      const updatedVehicle: Vehicle = {
        ...this._vehicle,
        ...this.vehicleForm.value
      };
      this.vehicleUpdated.emit(updatedVehicle);
      this.close();
    }
  }
} 