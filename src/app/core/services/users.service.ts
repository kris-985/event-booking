import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { User } from '../models';

type ApiUser = Omit<User, 'id'> & {
  _id: string;
  id?: string;
};

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly usersUrl = `${environment.apiUrl}/users`;

  getUsers(): Observable<User[]> {
    return this.http
      .get<ApiUser[]>(this.usersUrl)
      .pipe(map((users) => users.map((user) => this.toUser(user))));
  }

  private toUser(user: ApiUser): User {
    return {
      id: user.id ?? user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };
  }
}
