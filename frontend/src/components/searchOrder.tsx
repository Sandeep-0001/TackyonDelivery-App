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

  const statusBadgeClass = (status?: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'pending') return 'badge badge-warning';
    if (s === 'in_progress' || s === 'processing') return 'badge badge-info';
    if (s === 'delivered' || s === 'completed') return 'badge badge-success';
    if (s === 'cancelled') return 'badge badge-danger';
    return 'badge border-slate-200 bg-slate-50 text-slate-700';
  };

  const statusLabel = (status?: string) => {
    if (!status) return '';
    const s = status.toLowerCase();
    if (s === 'in_progress') return 'In progress';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Search orders</h2>
            <p className="mt-1 text-sm text-slate-600">Find orders by customer name or delivery address.</p>
          </div>
          {hasSearched && <div className="badge badge-info">{results.length} result{results.length !== 1 ? 's' : ''}</div>}
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by customer name or address…"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="input"
          />
          <div className="flex gap-2">
            <button onClick={handleSearch} disabled={loading} className="btn btn-primary w-full sm:w-auto">
              {loading ? 'Searching…' : 'Search'}
            </button>
            {hasSearched && (
              <button onClick={handleClear} className="btn btn-outline w-full sm:w-auto">
                Clear
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <span className="font-semibold">Error:</span> {error}
          </div>
        )}

        {hasSearched && !loading && (
          <div className="mt-5">
            {results.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                <div className="text-sm font-semibold text-slate-900">No results</div>
                <div className="mt-1 text-sm text-slate-600">No results found for “{query}”. Try a different term.</div>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="max-h-[32rem] overflow-y-auto divide-y divide-slate-100">
                  {results.map((result, index) => (
                    <div key={result._id} className="px-4 py-3 hover:bg-slate-50">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary-600 text-xs font-semibold text-white">
                            {index + 1}
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-slate-900">{result._source.customerName}</div>
                            <div className="mt-0.5 text-sm text-slate-600 break-words">{result._source.deliveryAddress}</div>
                            {result._source.latitude && result._source.longitude && (
                              <div className="mt-1 text-xs text-slate-500">
                                Coordinates: {result._source.latitude.toFixed(4)}, {result._source.longitude.toFixed(4)}
                              </div>
                            )}
                          </div>
                        </div>

                        {result._source.status && (
                          <span className={statusBadgeClass(result._source.status)}>{statusLabel(result._source.status)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchOrders;
