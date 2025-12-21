import React, { useState } from 'react';
import { searchOrders } from '../services/api';

interface SearchResult {
  _id: string;
  _source: {
    customerName: string;
    deliveryAddress: string;
    latitude?: number;
    longitude?: number;
    status?: string;
  };
}

interface SearchOrdersProps {
  showNotification?: (message: string, type: 'success' | 'error' | 'info') => void;
}

const SearchOrders: React.FC<SearchOrdersProps> = ({ showNotification }) => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a search term');
      if (showNotification) {
        showNotification('Please enter a search term', 'error'); // Trigger error notification
      }
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      const { data } = await searchOrders(query);
      setResults(data);
      if (data.length > 0) {
        if (showNotification) {
          showNotification(`${data.length} orders found!`, 'success'); // Trigger success notification
        }
      } else {
        if (showNotification) {
          showNotification(`No results found for "${query}".`, 'info'); // Trigger info notification
        }
      }
    } catch (error) {
      console.error('Error searching orders', error);
      setError(error instanceof Error ? error.message : 'Failed to search orders. Please try again later.');
      setResults([]);
      if (showNotification) {
        showNotification('Failed to search orders.', 'error'); // Trigger error notification
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setError(null);
    setHasSearched(false);
    if (showNotification) {
      showNotification('Search results cleared.', 'info'); // Trigger info notification
    }
  };

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
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          🔍 Search Orders
        </h2>
        <p style={{ 
          color: '#5a6c7d', 
          fontSize: '1.1rem', 
          maxWidth: '600px', 
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Find orders by customer name or delivery address
        </p>
      </div>

      {/* Search Input */}
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '30px', 
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by customer name or address..."
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          style={{
            flex: '1',
            minWidth: '300px',
            padding: '15px 20px',
            fontSize: '16px',
            border: '2px solid #e1e5e9',
            borderRadius: '25px',
            outline: 'none',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#667eea';
            e.target.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e1e5e9';
            e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
          }}
        />
        <button 
          onClick={handleSearch}
          disabled={loading}
          style={{
            padding: '15px 30px',
            fontSize: '16px',
            fontWeight: '600',
            background: loading 
              ? 'linear-gradient(45deg, #bdc3c7, #95a5a6)' 
              : 'linear-gradient(45deg, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            minWidth: '120px'
          }}
        >
          {loading ? '⏳ Searching...' : '🔍 Search'}
        </button>
        {hasSearched && (
          <button 
            onClick={handleClear}
            style={{
              padding: '15px 30px',
              fontSize: '16px',
              fontWeight: '600',
              background: 'linear-gradient(45deg, #ff6b6b, #ee5a52)',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              minWidth: '120px'
            }}
          >
            🗑️ Clear
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ 
          color: '#d63031', 
          backgroundColor: '#ffeaa7', 
          padding: '20px', 
          borderRadius: '12px',
          marginBottom: '25px',
          border: '2px solid #fdcb6e',
          boxShadow: '0 4px 12px rgba(214, 48, 49, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <div>
            <strong style={{ fontSize: '16px' }}>Error:</strong> {error}
          </div>
        </div>
      )}

      {/* Results */}
      {hasSearched && !loading && (
        <div>
          {results.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '15px',
              border: '2px dashed #bdc3c7'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
              <p style={{ 
                color: '#5a6c7d', 
                fontSize: '1.2rem',
                fontWeight: '500',
                margin: '0'
              }}>
                No results found for "{query}". Try a different search term.
              </p>
            </div>
          ) : (
            <div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '15px', 
                marginBottom: '25px',
                justifyContent: 'center'
              }}>
                <h3 style={{ 
                  fontSize: '1.8rem', 
                  color: '#2c3e50', 
                  margin: '0',
                  fontWeight: '600'
                }}>
                  📋 Search Results
                </h3>
                <span style={{
                  backgroundColor: '#667eea',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {results.length} found
                </span>
              </div>
              <div style={{
                border: 'none',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                backgroundColor: 'white',
                maxHeight: '500px', // Set a max height for scrolling
                overflowY: 'auto' // Enable vertical scrolling
              }}>
                {results.map((result, index) => (
                  <div
                    key={result._id}
                    style={{
                      padding: '20px',
                      borderBottom: index < results.length - 1 ? '1px solid #f1f2f6' : 'none',
                      backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                      transition: 'all 0.3s ease',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#e3f2fd';
                      e.currentTarget.style.transform = 'translateX(5px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#f8f9fa' : 'white';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{
                          backgroundColor: '#667eea',
                          color: 'white',
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}>
                          {index + 1}
                        </div>
                        <div>
                          <strong style={{ fontSize: '16px', color: '#2c3e50' }}>
                            {result._source.customerName}
                          </strong>
                        </div>
                      </div>
                      {result._source.status && (
                        <span style={{
                          padding: '6px 12px',
                          borderRadius: '15px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor: result._source.status === 'pending' ? '#ffeaa7' : 
                                         result._source.status === 'completed' ? '#d1f2eb' :
                                         result._source.status === 'in_progress' ? '#e3f2fd' : '#f8f9fa',
                          color: result._source.status === 'pending' ? '#d63031' : 
                                 result._source.status === 'completed' ? '#00b894' :
                                 result._source.status === 'in_progress' ? '#1976d2' : '#6c757d',
                          border: `1px solid ${result._source.status === 'pending' ? '#fdcb6e' : 
                                              result._source.status === 'completed' ? '#00b894' :
                                              result._source.status === 'in_progress' ? '#1976d2' : '#dee2e6'}`
                        }}>
                          {result._source.status === 'pending' ? '⏳ Pending' : 
                           result._source.status === 'completed' ? '✅ Completed' :
                           result._source.status === 'in_progress' ? '🚚 In Progress' :
                           result._source.status === 'delivered' ? '📦 Delivered' :
                           result._source.status === 'cancelled' ? '❌ Cancelled' :
                           `📋 ${result._source.status.charAt(0).toUpperCase() + result._source.status.slice(1)}`}
                        </span>
                      )}
                    </div>
                    <div style={{ 
                      color: '#5a6c7d', 
                      marginLeft: '45px',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span>📍</span>
                      <span>{result._source.deliveryAddress}</span>
                    </div>
                    {result._source.latitude && result._source.longitude && (
                      <div style={{ 
                        color: '#95a5a6', 
                        fontSize: '12px', 
                        marginLeft: '45px',
                        marginTop: '5px',
                        fontFamily: 'monospace'
                      }}>
                        📊 Coordinates: {result._source.latitude.toFixed(4)}, {result._source.longitude.toFixed(4)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchOrders;
