import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Event } from '../../../../core/models';
import { EventsService } from '../../../../core/services/events.service';

interface Stat {
  value: string;
  label: string;
}

interface Step {
  title: string;
  description: string;
}

interface Category {
  title: string;
  description: string;
  meta: string;
  imageUrl: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  protected featuredEvents: Event[] = [];
  protected isLoadingEvents = true;

  protected readonly stats: Stat[] = [
    { value: '10k+', label: 'bookings' },
    { value: '500+', label: 'events' },
    { value: '30+', label: 'cities' },
  ];

  protected readonly categories: Category[] = [
    {
      title: 'Technology',
      description: 'Conferences, demos, product talks, and hands-on engineering sessions.',
      meta: '12 upcoming events',
      imageUrl:
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Music',
      description: 'Live concerts, club nights, festivals, and intimate acoustic sets.',
      meta: '9 upcoming events',
      imageUrl:
        'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Business',
      description: 'Founder meetups, leadership forums, startup sessions, and networking.',
      meta: '7 upcoming events',
      imageUrl:
        'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Sports',
      description: 'Active community events, tournaments, races, and team experiences.',
      meta: '6 upcoming events',
      imageUrl:
        'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Art',
      description: 'Gallery openings, creative workshops, installations, and artist talks.',
      meta: '5 upcoming events',
      imageUrl:
        'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=80',
    },
  ];

  protected readonly steps: Step[] = [
    {
      title: 'Discover events',
      description: 'Explore curated experiences by category, city, date, and price.',
    },
    {
      title: 'Book your seat',
      description: 'Reserve a spot in seconds with a clear event page and availability.',
    },
    {
      title: 'Manage your bookings',
      description: 'Keep upcoming reservations organized from your dashboard.',
    },
  ];

  protected readonly fallbackFeaturedEvents: Event[] = [
    {
      id: 'technology-preview',
      title: 'Angular Connect Sofia',
      description: 'A full-day conference for Angular developers and product teams.',
      location: 'Sofia Tech Park',
      date: '2026-06-12T00:00:00.000Z',
      price: 89,
      availableSeats: 350,
      imageUrl:
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      category: 'Technology',
    },
    {
      id: 'music-preview',
      title: 'Summer Sound Sessions',
      description: 'An outdoor evening with live sets, food vendors, and city views.',
      location: 'Borisova Garden',
      date: '2026-07-03T00:00:00.000Z',
      price: 45,
      availableSeats: 180,
      imageUrl:
        'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80',
      category: 'Music',
    },
    {
      id: 'business-preview',
      title: 'Founders Growth Forum',
      description: 'A focused day for operators, startup teams, and growth leaders.',
      location: 'Sofia Event Center',
      date: '2026-08-18T00:00:00.000Z',
      price: 120,
      availableSeats: 96,
      imageUrl:
        'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=80',
      category: 'Business',
    },
  ];

  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly eventsService = inject(EventsService);

  ngOnInit(): void {
    this.eventsService.getEvents().subscribe({
      next: (events) => {
        this.featuredEvents = events.slice(0, 3);
        this.isLoadingEvents = false;
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.featuredEvents = [];
        this.isLoadingEvents = false;
        this.changeDetectorRef.markForCheck();
      },
    });
  }
}
