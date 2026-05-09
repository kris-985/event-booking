import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Event } from '../models';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private events: Event[] = [
    {
      id: 'evt-001',
      title: 'Angular Connect Sofia',
      description: 'A full-day conference for Angular developers covering signals, performance, testing, and scalable application architecture.',
      location: 'Sofia Tech Park, Sofia',
      date: '2026-06-12',
      price: 89,
      capacity: 350,
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
      category: 'Technology'
    },
    {
      id: 'evt-002',
      title: 'Product Design Forum',
      description: 'Design leaders and product teams share practical sessions on research, prototyping, design systems, and product strategy.',
      location: 'National Palace of Culture, Sofia',
      date: '2026-07-04',
      price: 65,
      capacity: 220,
      imageUrl: 'https://images.unsplash.com/photo-1558403194-611308249627',
      category: 'Design'
    },
    {
      id: 'evt-003',
      title: 'Startup Demo Night',
      description: 'Early-stage founders pitch new products to investors, operators, and the local startup community.',
      location: 'Inter Expo Center, Sofia',
      date: '2026-08-18',
      price: 25,
      capacity: 500,
      imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865',
      category: 'Business'
    },
    {
      id: 'evt-004',
      title: 'Jazz Under the Stars',
      description: 'An open-air evening concert featuring contemporary jazz ensembles, local food vendors, and summer cocktails.',
      location: 'Borisova Gradina, Sofia',
      date: '2026-06-27',
      price: 35,
      capacity: 800,
      imageUrl: 'https://images.unsplash.com/photo-1501612780327-45045538702b',
      category: 'Music'
    },
    {
      id: 'evt-005',
      title: 'Balkan Food Festival',
      description: 'A weekend tasting event with regional chefs, artisan producers, cooking workshops, and live demonstrations.',
      location: 'Plovdiv Old Town, Plovdiv',
      date: '2026-09-05',
      price: 18,
      capacity: 1200,
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
      category: 'Food'
    },
    {
      id: 'evt-006',
      title: 'Mountain Trail Challenge',
      description: 'A guided trail running event with 10K and 25K routes through marked mountain paths and support stations.',
      location: 'Vitosha Mountain, Sofia',
      date: '2026-10-11',
      price: 42,
      capacity: 300,
      imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306',
      category: 'Sports'
    }
  ];

  getEvents(): Observable<Event[]> {
    return of([...this.events]);
  }

  getEventById(id: string): Observable<Event | undefined> {
    return of(this.events.find((event) => event.id === id));
  }

  createEvent(payload: Omit<Event, 'id'>): Observable<Event> {
    const event: Event = {
      ...payload,
      id: crypto.randomUUID()
    };

    this.events = [...this.events, event];

    return of(event);
  }

  updateEvent(id: string, payload: Partial<Event>): Observable<Event | undefined> {
    const eventIndex = this.events.findIndex((event) => event.id === id);

    if (eventIndex === -1) {
      return of(undefined);
    }

    const updatedEvent: Event = {
      ...this.events[eventIndex],
      ...payload,
      id
    };

    this.events = this.events.map((event) => (event.id === id ? updatedEvent : event));

    return of(updatedEvent);
  }

  deleteEvent(id: string): Observable<boolean> {
    const initialLength = this.events.length;

    this.events = this.events.filter((event) => event.id !== id);

    return of(this.events.length < initialLength);
  }
}
