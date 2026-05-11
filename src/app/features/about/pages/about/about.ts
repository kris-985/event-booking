import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface AboutCard {
  title: string;
  description: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About {
  protected readonly userActions: AboutCard[] = [
    {
      title: 'Discover curated events',
      description: 'Browse events by category, location, date, price, and availability.'
    },
    {
      title: 'Book seats with confidence',
      description: 'View event details, understand capacity, and reserve a place quickly.'
    },
    {
      title: 'Track every booking',
      description: 'Keep upcoming plans organized from a focused bookings dashboard.'
    }
  ];

  protected readonly adminActions: AboutCard[] = [
    {
      title: 'Manage event inventory',
      description: 'Create, update, and retire event listings from one administrative surface.'
    },
    {
      title: 'Monitor reservations',
      description: 'Review bookings and understand demand across the event catalog.'
    },
    {
      title: 'Control access',
      description: 'Use role-based access to keep management workflows restricted to admins.'
    }
  ];
}
