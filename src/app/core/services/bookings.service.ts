import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Booking } from '../models';

type ApiBooking = Omit<Booking, 'id' | 'userId' | 'eventId'> & {
  _id: string;
  id?: string;
  userId: string | { _id?: string; id?: string };
  eventId: string | { _id?: string; id?: string };
};

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  private readonly http = inject(HttpClient);
  private readonly bookingsUrl = `${environment.apiUrl}/bookings`;

  createBooking(eventId: string): Observable<Booking> {
    return this.http
      .post<ApiBooking>(this.bookingsUrl, { eventId })
      .pipe(map((booking) => this.toBooking(booking)));
  }

  getMyBookings(): Observable<Booking[]> {
    return this.http
      .get<ApiBooking[]>(`${this.bookingsUrl}/my`)
      .pipe(map((bookings) => bookings.map((booking) => this.toBooking(booking))));
  }

  getAllBookings(): Observable<Booking[]> {
    return this.http
      .get<ApiBooking[]>(this.bookingsUrl)
      .pipe(map((bookings) => bookings.map((booking) => this.toBooking(booking))));
  }

  cancelBooking(id: string): Observable<Booking> {
    return this.http
      .patch<ApiBooking>(`${this.bookingsUrl}/${id}/cancel`, {})
      .pipe(map((booking) => this.toBooking(booking)));
  }

  private toBooking(booking: ApiBooking): Booking {
    return {
      id: booking.id ?? booking._id,
      userId: this.toId(booking.userId),
      eventId: this.toId(booking.eventId),
      eventTitle: booking.eventTitle,
      eventDate: booking.eventDate,
      quantity: booking.quantity,
      totalPrice: booking.totalPrice,
      status: booking.status,
      createdAt: booking.createdAt,
    };
  }

  private toId(value: string | { _id?: string; id?: string }): string {
    return typeof value === 'string' ? value : (value.id ?? value._id ?? '');
  }
}
