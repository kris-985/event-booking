import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';

import { Event } from '../../../../core/models';
import { EventsService } from '../../../../core/services/events.service';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    RouterLink,
  ],
  templateUrl: './events-list.html',
  styleUrl: './events-list.scss',
})
export class EventsList implements OnInit {
  protected events: Event[] = [];
  protected isLoading = true;
  protected errorMessage = '';
  protected searchTerm = '';
  protected selectedCategory = 'all';

  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly eventsService = inject(EventsService);

  ngOnInit(): void {
    this.loadEvents();
  }

  protected get categories(): string[] {
    return Array.from(new Set(this.events.map((event) => event.category))).sort();
  }

  protected get filteredEvents(): Event[] {
    const normalizedSearchTerm = this.searchTerm.trim().toLowerCase();

    return this.events.filter((event) => {
      const matchesCategory =
        this.selectedCategory === 'all' || event.category === this.selectedCategory;
      const matchesSearch =
        normalizedSearchTerm.length === 0 ||
        event.title.toLowerCase().includes(normalizedSearchTerm) ||
        event.location.toLowerCase().includes(normalizedSearchTerm) ||
        event.category.toLowerCase().includes(normalizedSearchTerm);

      return matchesCategory && matchesSearch;
    });
  }

  protected loadEvents(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.eventsService.getEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.isLoading = false;
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Unable to load events. Please try again.';
        this.isLoading = false;
        this.changeDetectorRef.markForCheck();
      },
    });
  }
}
