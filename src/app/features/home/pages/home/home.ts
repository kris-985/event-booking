import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  protected featuredEvents: Event[] = [];
  protected isLoadingEvents = true;

  protected readonly stats: Stat[] = [
    { value: '10k+', label: 'bookings' },
    { value: '500+', label: 'events' },
    { value: '30+', label: 'cities' }
  ];

  protected readonly categories = ['Technology', 'Music', 'Business', 'Sports', 'Art'];

  protected readonly steps: Step[] = [
    {
      title: 'Discover events',
      description: 'Explore curated experiences by category, city, date, and price.'
    },
    {
      title: 'Book your seat',
      description: 'Reserve a spot in seconds with a clear event page and availability.'
    },
    {
      title: 'Manage your bookings',
      description: 'Keep upcoming reservations organized from your dashboard.'
    }
  ];

  private readonly eventsService = inject(EventsService);

  ngOnInit(): void {
    this.eventsService.getEvents().subscribe({
      next: (events) => {
        this.featuredEvents = events.slice(0, 3);
        this.isLoadingEvents = false;
      },
      error: () => {
        this.featuredEvents = [];
        this.isLoadingEvents = false;
      }
    });
  }
}
