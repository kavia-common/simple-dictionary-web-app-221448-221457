import React from 'react';

// PUBLIC_INTERFACE
export default function RecentSearches({ items = [], onSelect }) {
  /** Renders a list of recent search terms (up to 10).
   * Props:
   * - items: string[]
   * - onSelect: (term) => void
   */
  return (
    <div>
      <h3 style={{ marginTop: 0, marginBottom: 8, fontSize: 16 }}>Recent searches</h3>
      {(!items || items.length === 0) && (
        <p style={{ color: '#6b7280', fontSize: 14 }}>No recent searches yet.</p>
      )}
      <ul className="recent-list">
        {items.map((term) => (
          <li key={term}>
            <button
              className="recent-item"
              onClick={() => onSelect(term)}
              aria-label={`Search for ${term}`}
              title={`Search "${term}"`}
            >
              <span className="dot" aria-hidden="true" />
              {term}
            </button>
          </li>
        ))}
      </ul>

      <style>{`
        .recent-list {
          list-style: none;
          padding: 0; margin: 0;
          display: grid; gap: 6px;
        }
        .recent-item {
          width: 100%;
          text-align: left;
          background: linear-gradient(180deg, #ffffff, #fafafa);
          border: 1px solid var(--ocn-border);
          color: var(--ocn-text);
          padding: 10px 12px;
          border-radius: var(--ocn-radius-sm);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: transform .06s ease, box-shadow .2s ease, border-color .2s ease;
        }
        .recent-item:hover {
          transform: translateY(-1px);
          border-color: rgba(37,99,235,0.45);
          box-shadow: 0 10px 20px rgba(37,99,235,0.14);
        }
        .dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #60a5fa;
          box-shadow: 0 0 0 3px rgba(96,165,250,0.2);
        }
      `}</style>
    </div>
  );
}
