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
  const getNotificationStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#d4edda',
          color: '#155724',
          border: '1px solid #c3e6cb',
        };
      case 'error':
        return {
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
        };
      case 'info':
        return {
          backgroundColor: '#d1ecf1',
          color: '#0c5460',
          border: '1px solid #bee5eb',
        };
      default:
        return {};
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    }}>
      {notifications.map((notification) => (
        <div 
          key={notification.id}
          style={{
            padding: '15px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '350px',
            wordBreak: 'break-word',
            ...getNotificationStyles(notification.type)
          }}
        >
          <span>{notification.message}</span>
          <button 
            onClick={() => onDismiss(notification.id)}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              fontSize: '18px',
              cursor: 'pointer',
              marginLeft: '15px',
            }}
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
