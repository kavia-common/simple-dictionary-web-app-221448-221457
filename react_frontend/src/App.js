import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './index.css';
import { fetchDefinitions } from './api/client';
import SearchBar from './components/SearchBar';
import DefinitionsView from './components/DefinitionsView';
import RecentSearches from './components/RecentSearches';

// PUBLIC_INTERFACE
function App() {
  /**
   * App shell for the Dictionary application.
   * - Manages search state, API calls, loading/error/empty states.
   * - Hosts the SearchBar, DefinitionsView, and RecentSearches sidebar.
   * - Applies Ocean Professional theme styles via CSS variables.
   */
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [recent, setRecent] = useState(() => {
    try {
      const stored = localStorage.getItem('recent-searches');
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // Theme: Ocean Professional via CSS variables
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty('--ocn-bg', '#f9fafb');
    r.style.setProperty('--ocn-surface', '#ffffff');
    r.style.setProperty('--ocn-text', '#111827');
    r.style.setProperty('--ocn-primary', '#2563EB');
    r.style.setProperty('--ocn-secondary', '#F59E0B');
    r.style.setProperty('--ocn-error', '#EF4444');
    r.style.setProperty('--ocn-border', '#e5e7eb');
    r.style.setProperty('--ocn-shadow', '0 10px 25px rgba(0,0,0,0.06)');
    r.style.setProperty('--ocn-radius', '14px');
    r.style.setProperty('--ocn-radius-sm', '10px');
  }, []);

  // Persist recent searches
  useEffect(() => {
    try {
      localStorage.setItem('recent-searches', JSON.stringify(recent));
    } catch {
      // ignore storage errors
    }
  }, [recent]);

  const onSearch = async (term) => {
    const trimmed = (term || '').trim();
    setQuery(trimmed);
    setErrorMsg('');
    setResults(null);

    if (!trimmed) {
      setErrorMsg('Please enter a word to search.');
      return;
    }

    setLoading(true);
    try {
      const defs = await fetchDefinitions(trimmed);
      setResults(defs);

      // Manage recent list: unique, latest first, limit 10
      setRecent((prev) => {
        const next = [trimmed, ...prev.filter((w) => w.toLowerCase() !== trimmed.toLowerCase())];
        return next.slice(0, 10);
      });
    } catch (err) {
      const friendly = err?.message || 'Unable to load definitions.';
      setErrorMsg(friendly);
    } finally {
      setLoading(false);
    }
  };

  const onRecentClick = (term) => {
    onSearch(term);
  };

  const emptyState = useMemo(() => {
    return !loading && !errorMsg && !results;
  }, [loading, errorMsg, results]);

  return (
    <div className="app-root" style={{ background: 'linear-gradient(180deg, rgba(37,99,235,0.06), #f9fafb 120%)', minHeight: '100vh' }}>
      <header className="app-header" role="banner" aria-label="Dictionary Header">
        <div className="app-brand">
          <div aria-hidden="true" className="brand-dot" />
          <h1 className="brand-title">LexiSearch</h1>
        </div>
        <p className="brand-subtitle">Find precise definitions with a clean, modern interface.</p>
      </header>

      <main className="app-main" role="main">
        <aside className="app-sidebar" aria-label="Recent searches">
          <RecentSearches items={recent} onSelect={onRecentClick} />
        </aside>
        <section className="app-content" aria-live="polite">
          <div className="search-card" role="search" aria-label="Word search">
            <SearchBar onSearch={onSearch} initialValue={query} />
          </div>

          {loading && (
            <div className="loading-card" aria-busy="true" aria-label="Loading definitions">
              <div className="spinner" aria-hidden="true" />
              <div className="skeleton" />
              <div className="skeleton" />
              <div className="skeleton short" />
            </div>
          )}

          {errorMsg && !loading && (
            <div className="alert error" role="alert">
              <strong>Oops:</strong> {errorMsg}
            </div>
          )}

          {emptyState && (
            <div className="empty-card" aria-label="Empty state">
              <p>Try searching for a word like <button className="chip" onClick={() => onSearch('ocean')}>ocean</button>, <button className="chip" onClick={() => onSearch('professional')}>professional</button>, or <button className="chip" onClick={() => onSearch('serendipity')}>serendipity</button>.</p>
            </div>
          )}

          {!loading && !errorMsg && results && (
            <DefinitionsView query={query} entries={results} />
          )}
        </section>
      </main>

      <footer className="app-footer" role="contentinfo">
        <span>Powered by Public Dictionary API</span>
      </footer>
    </div>
  );
}

export default App;
