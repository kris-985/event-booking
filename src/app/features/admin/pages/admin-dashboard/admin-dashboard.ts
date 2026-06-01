import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { Booking, Event, User } from '../../../../core/models';
import { AuthService } from '../../../../core/services/auth.service';
import { BookingsService } from '../../../../core/services/bookings.service';
import { EventsService } from '../../../../core/services/events.service';
import { UsersService } from '../../../../core/services/users.service';

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
  protected users: User[] = [];
  protected isLoading = true;
  protected errorMessage = '';
  protected successMessage = '';
  protected editingEventId = '';
  protected savingEvent = false;
  protected deletingEventId = '';
  protected cancellingBookingId = '';

  private readonly authService = inject(AuthService);
  private readonly bookingsService = inject(BookingsService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly eventsService = inject(EventsService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly usersService = inject(UsersService);

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
    this.authService.getCurrentUser().subscribe({
      next: () => {
        if (!this.isAdmin) {
          this.isLoading = false;
          this.changeDetectorRef.markForCheck();
          return;
        }

        this.loadDashboard();
      },
      error: () => {
        this.errorMessage = 'Unable to verify admin access.';
        this.isLoading = false;
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  protected get isAdmin(): boolean {
    return this.authService.isAdminSignal();
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

  protected get soldTicketsCount(): number {
    return this.bookings
      .filter((booking) => booking.status === 'active')
      .reduce((total, booking) => total + booking.quantity, 0);
  }

  protected get totalSeats(): number {
    return this.events.reduce((total, event) => total + event.availableSeats, 0);
  }

  protected get registeredUsersCount(): number {
    return this.users.length;
  }

  protected get adminUsersCount(): number {
    return this.users.filter((user) => user.role === 'admin').length;
  }

  protected get customerUsersCount(): number {
    return this.users.filter((user) => user.role === 'user').length;
  }

  protected get recentUsers(): User[] {
    return this.users.slice(0, 6);
  }

  protected get topEventsBySales(): Array<{ title: string; tickets: number; revenue: number }> {
    const salesByEvent = new Map<string, { title: string; tickets: number; revenue: number }>();

    for (const booking of this.bookings) {
      if (booking.status !== 'active') {
        continue;
      }

      const current = salesByEvent.get(booking.eventId) ?? {
        title: booking.eventTitle,
        tickets: 0,
        revenue: 0
      };

      current.tickets += booking.quantity;
      current.revenue += booking.totalPrice;
      salesByEvent.set(booking.eventId, current);
    }

    return Array.from(salesByEvent.values())
      .sort((first, second) => second.tickets - first.tickets)
      .slice(0, 5);
  }

  protected loadDashboard(): void {
    if (!this.isAdmin) {
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      events: this.eventsService.getEvents(),
      bookings: this.bookingsService.getAllBookings(),
      users: this.usersService.getUsers()
    }).subscribe({
      next: ({ events, bookings, users }) => {
        this.events = events;
        this.bookings = bookings;
        this.users = users;
        this.isLoading = false;
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Unable to load admin data.';
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

  private toDateTimeInputValue(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  }
}
