import React from 'react';

/**
 * The shape of entries from dictionaryapi.dev:
 * [
 *   {
 *     word: "hello",
 *     phonetic: "/həˈləʊ/",
 *     phonetics: [{ text, audio }],
 *     meanings: [
 *       {
 *         partOfSpeech: "exclamation",
 *         definitions: [{ definition, example, synonyms:[], antonyms:[] }]
 *       }
 *     ]
 *   }
 * ]
 */

// PUBLIC_INTERFACE
export default function DefinitionsView({ query, entries }) {
  /** Renders results list for a query. */
  if (!entries || !Array.isArray(entries) || entries.length === 0) {
    return (
      <div className="empty-card">
        <p>No definitions found for “{query}”.</p>
      </div>
    );
  }

  return (
    <article className="defs-card" aria-label={`Definitions for ${query}`}>
      <header className="defs-header">
        <h2 className="defs-title">{entries[0]?.word || query}</h2>
        <Phonetics phonetics={entries[0]?.phonetics} fallback={entries[0]?.phonetic} />
      </header>

      <div className="defs-body">
        {entries.map((entry, idx) => (
          <Entry key={`${entry.word}-${idx}`} entry={entry} />
        ))}
      </div>

      <style>{`
        .defs-card {
          background: var(--ocn-surface);
          border: 1px solid var(--ocn-border);
          border-radius: var(--ocn-radius);
          box-shadow: var(--ocn-shadow);
          padding: 18px;
        }
        .defs-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 10px;
          border-bottom: 1px dashed var(--ocn-border);
          padding-bottom: 8px;
          margin-bottom: 8px;
        }
        .defs-title {
          margin: 0;
          font-size: 22px;
          color: #0f172a;
        }
        .defs-body { display: grid; gap: 16px; }
        .entry {
          border-left: 3px solid rgba(37,99,235,0.25);
          padding-left: 12px;
        }
        .pos {
          display: inline-block;
          background: #ecfeff;
          border: 1px solid #bae6fd;
          color: #0c4a6e;
          padding: 2px 10px;
          border-radius: 999px;
          font-size: 12px;
          margin-bottom: 8px;
        }
        .def {
          margin: 8px 0;
          line-height: 1.6;
        }
        .example {
          background: #f9fafb;
          border-left: 3px solid #e5e7eb;
          padding: 8px 10px;
          border-radius: 8px;
          color: #374151;
          font-style: italic;
        }
        .badge {
          display: inline-block;
          background: #fef3c7;
          border: 1px solid #fde68a;
          color: #7c2d12;
          padding: 2px 8px;
          border-radius: 999px;
          font-size: 12px;
          margin: 2px 6px 2px 0;
        }
        .group { margin-top: 6px; }
        .group-title {
          font-size: 12px;
          color: #374151;
          margin: 0 0 4px 0;
        }
      `}</style>
    </article>
  );
}

function Entry({ entry }) {
  const meanings = Array.isArray(entry?.meanings) ? entry.meanings : [];
  return (
    <section className="entry" aria-label={`Entry for ${entry?.word || ''}`}>
      {meanings.map((m, i) => (
        <Meaning key={`${m.partOfSpeech}-${i}`} meaning={m} />
      ))}
    </section>
  );
}

function Meaning({ meaning }) {
  const defs = Array.isArray(meaning?.definitions) ? meaning.definitions : [];
  const synonyms = uniq((meaning?.synonyms || []).concat(...defs.map(d => d.synonyms || [])));
  const antonyms = uniq((meaning?.antonyms || []).concat(...defs.map(d => d.antonyms || [])));

  return (
    <div className="meaning">
      {meaning?.partOfSpeech && <span className="pos">{meaning.partOfSpeech}</span>}
      <ol>
        {defs.map((d, idx) => (
          <li key={idx} className="def">
            <div>{d.definition}</div>
            {d.example && <div className="example" aria-label="Example usage">“{d.example}”</div>}
          </li>
        ))}
      </ol>
      {synonyms.length > 0 && (
        <div className="group" aria-label="Synonyms">
          <div className="group-title">Synonyms</div>
          <div>
            {synonyms.map((s) => <span key={`syn-${s}`} className="badge">{s}</span>)}
          </div>
        </div>
      )}
      {antonyms.length > 0 && (
        <div className="group" aria-label="Antonyms">
          <div className="group-title">Antonyms</div>
          <div>
            {antonyms.map((a) => <span key={`ant-${a}`} className="badge">{a}</span>)}
          </div>
        </div>
      )}
    </div>
  );
}

function Phonetics({ phonetics, fallback }) {
  const arr = Array.isArray(phonetics) ? phonetics : [];
  const text = arr.find(p => p.text)?.text || fallback || '';
  const audio = arr.find(p => p.audio)?.audio;

  return (
    <div aria-label="Phonetics">
      {text && <span style={{ color: '#1f2937' }}>{text}</span>}
      {audio && (
        <audio controls style={{ marginLeft: 10 }}>
          <source src={audio} />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}

function uniq(list) {
  return Array.from(new Set((list || []).filter(Boolean)));
}
