import React from 'react';

interface Order {
  _id: string;
  customerName: string;
  deliveryAddress: string;
  latitude?: number;
  longitude?: number;
  status: string;
}

interface UserStatisticsProps {
  orders?: Order[];
}

const UserStatistics: React.FC<UserStatisticsProps> = ({ orders = [] }) => {
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const inProgressOrders = orders.filter(order => order.status === 'in_progress').length;
  const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
  const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;

  return (
    <div style={{ 
      width: '100%', 
      padding: '30px', 
      boxSizing: 'border-box',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      borderRadius: '15px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      margin: '20px 0'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ 
          fontSize: '2.2rem', 
          color: '#2c3e50', 
          marginBottom: '10px',
          fontWeight: '700',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3V21H21" stroke="#2c3e50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18 9L13 14L9 10L3 16" stroke="#2c3e50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Order Statistics
        </h2>
        <p style={{ 
          color: '#5a6c7d', 
          fontSize: '1.1rem', 
          maxWidth: '600px', 
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Real-time overview of your order management system
        </p>
      </div>

      {/* Statistics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          textAlign: 'center',
          border: '2px solid #667eea'
        }}>
          <div style={{ marginBottom: '10px' }}>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#667eea', marginBottom: '5px' }}>
            {totalOrders}
          </div>
          <div style={{ color: '#5a6c7d', fontSize: '1rem', fontWeight: '600' }}>
            Total Orders
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          textAlign: 'center',
          border: '2px solid #ffeaa7'
        }}>
          <div style={{ marginBottom: '10px' }}>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#d63031" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 6V12L16 14" stroke="#d63031" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#d63031', marginBottom: '5px' }}>
            {pendingOrders}
          </div>
          <div style={{ color: '#5a6c7d', fontSize: '1rem', fontWeight: '600' }}>
            Pending
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          textAlign: 'center',
          border: '2px solid #e3f2fd'
        }}>
          <div style={{ marginBottom: '10px' }}>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 3H1V16H16V3Z" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 8H20L23 11V16H16V8Z" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5.5 21C6.88071 21 8 19.8807 8 18.5C8 17.1193 6.88071 16 5.5 16C4.11929 16 3 17.1193 3 18.5C3 19.8807 4.11929 21 5.5 21Z" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 21C19.8807 21 21 19.8807 21 18.5C21 17.1193 19.8807 16 18.5 16C17.1193 16 16 17.1193 16 18.5C16 19.8807 17.1193 21 18.5 21Z" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1976d2', marginBottom: '5px' }}>
            {inProgressOrders}
          </div>
          <div style={{ color: '#5a6c7d', fontSize: '1rem', fontWeight: '600' }}>
            In Progress
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          textAlign: 'center',
          border: '2px solid #d1f2eb'
        }}>
          <div style={{ marginBottom: '10px' }}>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.76489 14.1003 1.98232 16.07 2.86" stroke="#00b894" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 4L12 14.01L9 11.01" stroke="#00b894" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#00b894', marginBottom: '5px' }}>
            {deliveredOrders}
          </div>
          <div style={{ color: '#5a6c7d', fontSize: '1rem', fontWeight: '600' }}>
            Delivered
          </div>
        </div>
      </div>

      {/* Additional Info */}
      {cancelledOrders > 0 && (
        <div style={{
          backgroundColor: 'rgba(248, 215, 218, 0.3)',
          padding: '15px',
          borderRadius: '10px',
          border: '1px solid #f5c6cb',
          textAlign: 'center'
        }}>
          <span style={{ color: '#721c24', fontSize: '1rem', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.29 3.86L1.82 18C1.64537 18.3024 1.55296 18.6453 1.55199 18.9945C1.55101 19.3437 1.64151 19.6871 1.81445 19.9905C1.98738 20.2939 2.23675 20.5467 2.53773 20.7239C2.83871 20.9011 3.18082 20.9962 3.53 21H20.47C20.8192 20.9962 21.1613 20.9011 21.4623 20.7239C21.7633 20.5467 22.0126 20.2939 22.1856 19.9905C22.3585 19.6871 22.449 19.3437 22.448 18.9945C22.447 18.6453 22.3546 18.3024 22.18 18L13.71 3.86C13.5317 3.56611 13.2807 3.32312 12.9812 3.15448C12.6817 2.98585 12.3437 2.89725 12 2.89725C11.6563 2.89725 11.3183 2.98585 11.0188 3.15448C10.7193 3.32312 10.4683 3.56611 10.29 3.86Z" stroke="#721c24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 9V13" stroke="#721c24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 17H12.01" stroke="#721c24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {cancelledOrders} cancelled order{cancelledOrders > 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
};

export default UserStatistics;
