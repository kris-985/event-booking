import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Event } from '../models';

type ApiEvent = Omit<Event, 'id'> & {
  _id: string;
  id?: string;
};

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private readonly http = inject(HttpClient);
  private readonly eventsUrl = `${environment.apiUrl}/events`;

  getEvents(): Observable<Event[]> {
    return this.http.get<ApiEvent[]>(this.eventsUrl).pipe(
      map((events) => events.map((event) => this.toEvent(event)))
    );
  }

  getEventById(id: string): Observable<Event | undefined> {
    return this.http.get<ApiEvent>(`${this.eventsUrl}/${id}`).pipe(
      map((event) => this.toEvent(event)),
      catchError(() => of(undefined))
    );
  }

  createEvent(payload: Omit<Event, 'id'>): Observable<Event> {
    return this.http
      .post<ApiEvent>(this.eventsUrl, payload, {
        headers: this.getAuthHeaders()
      })
      .pipe(map((event) => this.toEvent(event)));
  }

  updateEvent(id: string, payload: Partial<Event>): Observable<Event | undefined> {
    return this.http
      .put<ApiEvent>(`${this.eventsUrl}/${id}`, payload, {
        headers: this.getAuthHeaders()
      })
      .pipe(
        map((event) => this.toEvent(event)),
        catchError(() => of(undefined))
      );
  }

  deleteEvent(id: string): Observable<boolean> {
    return this.http
      .delete<{ message: string }>(`${this.eventsUrl}/${id}`, {
        headers: this.getAuthHeaders()
      })
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }

  private toEvent(event: ApiEvent): Event {
    return {
      id: event.id ?? event._id,
      title: event.title,
      description: event.description,
      location: event.location,
      date: event.date,
      price: event.price,
      availableSeats: event.availableSeats,
      imageUrl: event.imageUrl,
      category: event.category
    };
  }

  private getAuthHeaders(): HttpHeaders {
    if (typeof localStorage === 'undefined') {
      return new HttpHeaders();
    }

    const token = localStorage.getItem('token');

    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }
}
