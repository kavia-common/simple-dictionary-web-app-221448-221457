/* SearchBar component: debounced input with submit button */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// PUBLIC_INTERFACE
export default function SearchBar({ onSearch, initialValue = '' }) {
  /** SearchBar with debounce typing and explicit submit.
   * Props:
   * - onSearch: (term: string) => void
   * - initialValue: prefill value
   */
  const [value, setValue] = useState(initialValue);
  const [typing, setTyping] = useState(false);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const clearDebounce = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  }, []);

  const debouncedSearch = useCallback(
    (term) => {
      clearDebounce();
      setTyping(true);
      debounceRef.current = setTimeout(() => {
        setTyping(false);
        if (term && term.trim()) {
          onSearch(term);
        }
      }, 600); // debounce 600ms
    },
    [onSearch, clearDebounce]
  );

  const onChange = (e) => {
    const val = e.target.value;
    setValue(val);
    if (!val.trim()) {
      // don't auto-search on empty
      clearDebounce();
      setTyping(false);
      return;
    }
    debouncedSearch(val);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    clearDebounce();
    setTyping(false);
    onSearch(value);
  };

  const placeholder = useMemo(
    () => 'Search an English word (e.g., "ocean", "professional")',
    []
  );

  return (
    <form onSubmit={onSubmit} className="searchbar" role="search">
      <label htmlFor="word-search" className="sr-only">Search word</label>
      <div className="searchbar-row">
        <input
          id="word-search"
          ref={inputRef}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-label="Search word"
          className="searchbar-input"
        />
        <button
          type="submit"
          className="searchbar-btn"
          aria-label="Search"
          title="Search"
        >
          Search
        </button>
      </div>
      {typing && <div className="typing-hint" aria-live="polite">Searching…</div>}
      <style>{`
        .searchbar { display: grid; gap: 8px; }
        .searchbar-row { display: grid; grid-template-columns: 1fr auto; gap: 10px; }
        .searchbar-input {
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid var(--ocn-border);
          outline: none;
          font-size: 16px;
          background: var(--ocn-surface);
          color: var(--ocn-text);
          transition: box-shadow .2s ease, border-color .2s ease, transform .06s ease;
        }
        .searchbar-input:focus {
          border-color: rgba(37,99,235,0.55);
          box-shadow: 0 0 0 4px rgba(37,99,235,0.15);
        }
        .searchbar-btn {
          padding: 12px 16px;
          background: linear-gradient(180deg, #3b82f6, #2563EB);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: transform .06s ease, box-shadow .2s ease, filter .2s ease;
          box-shadow: 0 10px 18px rgba(37,99,235,0.28);
        }
        .searchbar-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 16px 26px rgba(37,99,235,0.36);
        }
        .searchbar-btn:active { transform: translateY(0); filter: brightness(.96); }
        .typing-hint { font-size: 12px; color: #4b5563; }
        .sr-only {
          position: absolute;
          width: 1px; height: 1px;
          padding: 0; margin: -1px;
          overflow: hidden; clip: rect(0, 0, 0, 0);
          border: 0;
        }
      `}</style>
    </form>
  );
}
