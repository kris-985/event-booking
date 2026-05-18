import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { distinctUntilChanged, map, of, switchMap, tap } from 'rxjs';

import { Event } from '../../../../core/models';
import { AuthService } from '../../../../core/services/auth.service';
import { BookingsService } from '../../../../core/services/bookings.service';
import { EventsService } from '../../../../core/services/events.service';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    RouterLink,
  ],
  templateUrl: './event-details.html',
  styleUrl: './event-details.scss',
})
export class EventDetails implements OnInit {
  protected event: Event | undefined;
  protected isLoading = true;
  protected errorMessage = '';
  protected isBooking = false;
  protected bookingMessage = '';
  protected bookingError = '';

  private readonly authService = inject(AuthService);
  private readonly bookingsService = inject(BookingsService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly eventsService = inject(EventsService);

  private readonly categoryDetails: Record<
    string,
    { audience: string; highlights: string[]; agenda: string[] }
  > = {
    Technology: {
      audience: 'Developers, engineering leads, product builders, and technical founders.',
      highlights: ['Expert talks', 'Hands-on demos', 'Networking with technical teams'],
      agenda: [
        'Registration and coffee',
        'Keynotes and technical sessions',
        'Panel discussion and networking',
      ],
    },
    Design: {
      audience: 'Product designers, UX researchers, design leads, and product managers.',
      highlights: ['Design critiques', 'Research methods', 'Design systems practice'],
      agenda: ['Welcome session', 'Workshops and case studies', 'Portfolio and team networking'],
    },
    Business: {
      audience: 'Founders, operators, investors, managers, and growth teams.',
      highlights: ['Strategy sessions', 'Founder stories', 'Practical growth frameworks'],
      agenda: ['Opening remarks', 'Talks and roundtables', 'Networking reception'],
    },
    Music: {
      audience: 'Music fans, performers, creators, and people looking for a memorable night out.',
      highlights: ['Live performances', 'Curated atmosphere', 'Food and drinks nearby'],
      agenda: ['Doors open', 'Main performances', 'After-show social time'],
    },
    Sports: {
      audience: 'Active people, teams, clubs, and anyone looking for a high-energy experience.',
      highlights: ['Organized routes or sessions', 'Support on site', 'Community atmosphere'],
      agenda: ['Check-in and warm-up', 'Main activity', 'Awards and social gathering'],
    },
    Art: {
      audience: 'Artists, collectors, culture lovers, and curious visitors.',
      highlights: ['Curated exhibits', 'Artist conversations', 'Immersive visual experience'],
      agenda: ['Gallery opening', 'Guided experience', 'Artist Q&A'],
    },
    Food: {
      audience: 'Food lovers, chefs, local producers, and anyone exploring new tastes.',
      highlights: ['Tastings', 'Chef demos', 'Local producers'],
      agenda: ['Welcome tasting', 'Workshops and demos', 'Open market experience'],
    },
    Wellness: {
      audience: 'People looking for rest, movement, mindfulness, and healthier routines.',
      highlights: ['Guided sessions', 'Small-group format', 'Wellness-focused environment'],
      agenda: ['Arrival and intention setting', 'Guided practice', 'Reflection and closing'],
    },
  };

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id')),
        distinctUntilChanged(),
        tap((eventId) => {
          this.event = undefined;
          this.errorMessage = '';
          this.bookingMessage = '';
          this.bookingError = '';
          this.isLoading = Boolean(eventId);
          this.changeDetectorRef.markForCheck();
        }),
        switchMap((eventId) =>
          eventId ? this.eventsService.getEventById(eventId) : of(undefined),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (event) => {
          this.event = event;
          this.isLoading = false;
          this.changeDetectorRef.markForCheck();
        },
        error: () => {
          this.errorMessage = 'Unable to load event details. Please try again.';
          this.isLoading = false;
          this.changeDetectorRef.markForCheck();
        },
      });
  }

  protected bookEvent(event: Event): void {
    this.bookingMessage = '';
    this.bookingError = '';

    if (!this.authService.isAuthenticated()) {
      void this.router.navigate(['/login']);
      return;
    }

    if (event.availableSeats <= 0) {
      this.bookingError = 'No seats are available for this event.';
      return;
    }

    this.isBooking = true;

    this.bookingsService.createBooking(event.id).subscribe({
      next: () => {
        event.availableSeats -= 1;
        this.bookingMessage = 'Your ticket is booked. You can view it in My Bookings.';
        this.isBooking = false;
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.bookingError = 'Unable to book this event. Please try again.';
        this.isBooking = false;
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  protected getAudience(event: Event): string {
    return this.getCategoryDetail(event).audience;
  }

  protected getHighlights(event: Event): string[] {
    return this.getCategoryDetail(event).highlights;
  }

  protected getAgenda(event: Event): string[] {
    return this.getCategoryDetail(event).agenda;
  }

  private getCategoryDetail(event: Event): {
    audience: string;
    highlights: string[];
    agenda: string[];
  } {
    return (
      this.categoryDetails[event.category] ?? {
        audience: 'Attendees interested in curated local experiences and community events.',
        highlights: ['Curated program', 'Useful event details', 'Community networking'],
        agenda: ['Arrival and check-in', 'Main event program', 'Closing and networking'],
      }
    );
  }
}
