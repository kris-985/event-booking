export interface Booking {
  id: string;
  userId: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  quantity: number;
  totalPrice: number;
  createdAt: string;
}
