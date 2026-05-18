import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Booking } from '../../../../core/models';
import { BookingsService } from '../../../../core/services/bookings.service';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.scss',
})
export class MyBookings implements OnInit {
  protected bookings: Booking[] = [];
  protected isLoading = true;
  protected errorMessage = '';
  protected cancellingBookingId = '';

  private readonly bookingsService = inject(BookingsService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadBookings();
  }

  protected loadBookings(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.bookingsService.getMyBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.isLoading = false;
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Unable to load your bookings. Please try again.';
        this.isLoading = false;
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  protected cancelBooking(booking: Booking): void {
    this.cancellingBookingId = booking.id;

    this.bookingsService.cancelBooking(booking.id).subscribe({
      next: (updatedBooking) => {
        this.bookings = this.bookings.map((item) =>
          item.id === updatedBooking.id ? updatedBooking : item,
        );
        this.cancellingBookingId = '';
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Unable to cancel this booking. Please try again.';
        this.cancellingBookingId = '';
        this.changeDetectorRef.markForCheck();
      },
    });
  }
}
