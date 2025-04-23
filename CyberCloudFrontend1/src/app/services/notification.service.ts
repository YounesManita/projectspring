import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BlogPost } from '../interfaces/BlogPost';

export interface Notification {
  id: number;
  message: string;
  postId: number;
  read: boolean;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  private unreadCount = new BehaviorSubject<number>(0);

  constructor() {}

  getNotifications(): Observable<Notification[]> {
    return this.notifications.asObservable();
  }

  getUnreadCount(): Observable<number> {
    return this.unreadCount.asObservable();
  }

  addNotification(post: BlogPost): void {
    const newNotification: Notification = {
      id: Date.now(),
      message: `Un utilisateur a publié "${post.title}"`,
      postId: post.postId,
      read: false,
      createdAt: new Date()
    };

    const currentNotifications = this.notifications.getValue();
    const updatedNotifications = [newNotification, ...currentNotifications];
    
    this.notifications.next(updatedNotifications);
    this.updateUnreadCount();
  }

  markAsRead(notificationId: number): void {
    const currentNotifications = this.notifications.getValue();
    const updatedNotifications = currentNotifications.map(notification => {
      if (notification.id === notificationId) {
        return { ...notification, read: true };
      }
      return notification;
    });
    
    this.notifications.next(updatedNotifications);
    this.updateUnreadCount();
  }

  markAllAsRead(): void {
    const currentNotifications = this.notifications.getValue();
    const updatedNotifications = currentNotifications.map(notification => {
      return { ...notification, read: true };
    });
    
    this.notifications.next(updatedNotifications);
    this.updateUnreadCount();
  }

  private updateUnreadCount(): void {
    const currentNotifications = this.notifications.getValue();
    const unreadCount = currentNotifications.filter(notification => !notification.read).length;
    this.unreadCount.next(unreadCount);
  }
}