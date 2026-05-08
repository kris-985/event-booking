import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './event-details.html',
  styleUrl: './event-details.scss'
})
export class EventDetails {
  private readonly route = inject(ActivatedRoute);

  protected readonly eventId = this.route.snapshot.paramMap.get('id');
}
