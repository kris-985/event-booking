import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './events-list.html',
  styleUrl: './events-list.scss'
})
export class EventsList {
  protected readonly events = [
    {
      id: 1,
      title: 'Angular Connect Sofia',
      date: '2026-06-12',
      location: 'Sofia Tech Park'
    },
    {
      id: 2,
      title: 'Product Design Forum',
      date: '2026-07-04',
      location: 'National Palace of Culture'
    },
    {
      id: 3,
      title: 'Startup Demo Night',
      date: '2026-08-18',
      location: 'Inter Expo Center'
    }
  ];
}
