export interface EventItem {
  _id: string;
  title: string;
  description: string;
  type: string;
  thumbnail: string;
  location: string;
  date: string;
  createdBy: string;
  creatorName?: string;
  createdAt?: string;
  joinedCount?: number;
  joinedAt?: string;
}

export interface EventPayload {
  title: string;
  description: string;
  type: string;
  thumbnail: string;
  location: string;
  date: string;
}
