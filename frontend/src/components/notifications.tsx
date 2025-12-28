import React from 'react';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  timestamp?: number;
}

interface NotificationsProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ notifications, onDismiss }) => {
  const getNotificationClass = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-emerald-200 bg-emerald-50 text-emerald-900';
      case 'error':
        return 'border-rose-200 bg-rose-50 text-rose-900';
      case 'info':
        return 'border-sky-200 bg-sky-50 text-sky-900';
      default:
        return 'border-slate-200 bg-white text-slate-900';
    }
  };

  return (
    <div className="fixed top-5 right-5 z-[1000] flex max-w-sm flex-col gap-3">
      {notifications.map((notification) => (
        <div 
          key={notification.id}
          className={
            'flex items-start justify-between gap-3 rounded-xl border px-4 py-3 shadow-sm ring-1 ring-black/5 ' +
            getNotificationClass(notification.type)
          }
        >
          <span className="text-sm leading-5 break-words">{notification.message}</span>
          <button 
            onClick={() => onDismiss(notification.id)}
            className="-mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-lg text-current/70 hover:text-current hover:bg-black/5"
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
