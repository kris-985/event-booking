import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Booking, Event } from '../../../../core/models';
import { BookingsService } from '../../../../core/services/bookings.service';
import { EventsService } from '../../../../core/services/events.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard implements OnInit {
  protected events: Event[] = [];
  protected bookings: Booking[] = [];
  protected isLoading = true;
  protected errorMessage = '';
  protected successMessage = '';
  protected editingEventId = '';
  protected savingEvent = false;
  protected deletingEventId = '';
  protected cancellingBookingId = '';

  private readonly bookingsService = inject(BookingsService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly eventsService = inject(EventsService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly eventForm = this.formBuilder.nonNullable.group({
    title: ['', Validators.required],
    category: ['', Validators.required],
    location: ['', Validators.required],
    date: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    availableSeats: [0, [Validators.required, Validators.min(0)]],
    imageUrl: ['', Validators.required],
    description: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadDashboard();
  }

  protected get activeBookingsCount(): number {
    return this.bookings.filter((booking) => booking.status === 'active').length;
  }

  protected get cancelledBookingsCount(): number {
    return this.bookings.filter((booking) => booking.status === 'cancelled').length;
  }

  protected get totalRevenue(): number {
    return this.bookings
      .filter((booking) => booking.status === 'active')
      .reduce((total, booking) => total + booking.totalPrice, 0);
  }

  protected get totalSeats(): number {
    return this.events.reduce((total, event) => total + event.availableSeats, 0);
  }

  protected loadDashboard(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.eventsService.getEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.loadBookings();
      },
      error: () => {
        this.errorMessage = 'Unable to load events.';
        this.isLoading = false;
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  protected submitEvent(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    this.savingEvent = true;
    const formValue = this.eventForm.getRawValue();
    const payload = {
      ...formValue,
      date: new Date(formValue.date).toISOString()
    };
    const request = this.editingEventId
      ? this.eventsService.updateEvent(this.editingEventId, payload)
      : this.eventsService.createEvent(payload);

    request.subscribe({
      next: (event) => {
        if (!event) {
          this.errorMessage = 'Unable to save this event.';
          this.savingEvent = false;
          this.changeDetectorRef.markForCheck();
          return;
        }

        if (this.editingEventId) {
          this.events = this.events.map((item) => (item.id === event.id ? event : item));
          this.successMessage = 'Event updated successfully.';
        } else {
          this.events = [...this.events, event].sort(
            (first, second) => new Date(first.date).getTime() - new Date(second.date).getTime()
          );
          this.successMessage = 'Event created successfully.';
        }

        this.resetForm();
        this.savingEvent = false;
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Unable to save this event. Check the fields and try again.';
        this.savingEvent = false;
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  protected editEvent(event: Event): void {
    this.editingEventId = event.id;
    this.successMessage = '';
    this.errorMessage = '';
    this.eventForm.setValue({
      title: event.title,
      category: event.category,
      location: event.location,
      date: this.toDateTimeInputValue(event.date),
      price: event.price,
      availableSeats: event.availableSeats,
      imageUrl: event.imageUrl,
      description: event.description
    });
  }

  protected deleteEvent(event: Event): void {
    const shouldDelete = window.confirm(`Delete "${event.title}"? This cannot be undone.`);

    if (!shouldDelete) {
      return;
    }

    this.deletingEventId = event.id;
    this.errorMessage = '';
    this.successMessage = '';

    this.eventsService.deleteEvent(event.id).subscribe({
      next: (deleted) => {
        if (deleted) {
          this.events = this.events.filter((item) => item.id !== event.id);
          this.successMessage = 'Event deleted successfully.';
        } else {
          this.errorMessage = 'Unable to delete this event.';
        }

        this.deletingEventId = '';
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Unable to delete this event.';
        this.deletingEventId = '';
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  protected cancelBooking(booking: Booking): void {
    this.cancellingBookingId = booking.id;
    this.errorMessage = '';
    this.successMessage = '';

    this.bookingsService.cancelBooking(booking.id).subscribe({
      next: (updatedBooking) => {
        this.bookings = this.bookings.map((item) =>
          item.id === updatedBooking.id ? updatedBooking : item
        );
        this.events = this.events.map((event) =>
          event.id === updatedBooking.eventId
            ? { ...event, availableSeats: event.availableSeats + 1 }
            : event
        );
        this.successMessage = 'Booking cancelled successfully.';
        this.cancellingBookingId = '';
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Unable to cancel this booking.';
        this.cancellingBookingId = '';
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  protected resetForm(): void {
    this.editingEventId = '';
    this.eventForm.reset({
      title: '',
      category: '',
      location: '',
      date: '',
      price: 0,
      availableSeats: 0,
      imageUrl: '',
      description: ''
    });
  }

  protected hasError(controlName: keyof typeof this.eventForm.controls, error: string): boolean {
    const control = this.eventForm.controls[controlName];

    return control.hasError(error) && (control.dirty || control.touched);
  }

  private loadBookings(): void {
    this.bookingsService.getAllBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.isLoading = false;
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Unable to load bookings.';
        this.isLoading = false;
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  private toDateTimeInputValue(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  }
}
