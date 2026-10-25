
import React, { useState , useEffect} from 'react';
import './SearchUtils.css';

export default function SearchUtils() {
    const [search, setSearch] = useState('');
    const [load, setLoad] = useState(false);
    const [err, setErr] = useState(null);
    const [data, setData] = useState([]);
const [suggestions, setSuggestions] = useState([]);
const [activeIndex, setActiveIndex] = useState(-1);
const [showSuggestions, setShowSuggestions] = useState(false);
    async function GetTheData() {
        if (!search.trim()) {
            setErr('Please enter something to search!');
            setData([]);
            return;
        }

        setLoad(true);
        setErr(null);
        setData([]);

        try {
            const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(search)}&format=json&origin=*`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Something Bad happend(ERROR:PLATINUM)');
            }

            const result = await response.json();
            setData(result.query.search);
        } catch (error) {
            setErr(error.message);
        } finally {
            setLoad(false);
        }
    }
useEffect(() => {
    if (!search.trim()) {
        setSuggestions([]);
        return;
    }

    const timer = setTimeout(async () => {
        try {
            const params = new URLSearchParams({
                action: 'query',
                list: 'search',
                srsearch: search,
                srlimit: '6',
                format: 'json',
                origin: '*',
            });

            const response = await fetch(
                `https://en.wikipedia.org/w/api.php?${params}`
            );

            if (!response.ok) {
                throw new Error('Suggestions unavailable');
            }

            const result = await response.json();

            setSuggestions(result.query.search);
            setShowSuggestions(true);
        } catch (error) {
            setSuggestions([]);
        }
    }, 350);

    return () => clearTimeout(timer);
}, [search]);
    return (
        <main className="search-page">
            <header className="search-header">
                <div className="brand">
                    <span className="brand-icon">✦</span>
                    <span>Wiki<span className="brand-highlight">Explore</span></span>
                </div>
                <span className="header-tag">Knowledge Engine</span>
            </header>

            <section className="hero">
                <span className="eyebrow">YOUR KNOWLEDGE STARTS HERE</span>

                <h1>
                    Explore the <span>internet.</span>
                </h1>

                <p className="hero-description">
                    Search Wikipedia and discover ideas, people,
                    places and stories worth knowing.
                </p>

                <div className="search-box">
                    <span className="search-icon">⌕</span>

                    <input
                        className="search-input"
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') GetTheData();
                        }}
                        placeholder="What do you want to discover?"
                        aria-label="Search Wikipedia"
                    />
                    {showSuggestions && suggestions.length > 0 && (
                        <ul className="suggestions-list">
                            {suggestions.map((item, index) => (
                                <li key={item.pageid}>
                                    <button
                                        type="button"
                                        className={`suggestion-item ${index === activeIndex ? 'active' : ''
                                            }`}
                                        onClick={() => {
                                            setSearch(item.title);
                                            setShowSuggestions(false);
                                        }}
                                    >
                                        <span>{item.title}</span>
                                        <span className="suggestion-arrow">↗</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                    <button
                        className="search-button"
                        onClick={GetTheData}
                        disabled={load}
                    >
                        {load ? 'Searching...' : 'Search ↗'}
                    </button>

                </div>
                    <div className="Settings">
                        <button className="setting-button">Settings</button>
                    </div>
                <p className="search-hint">
                    POWERED BY WIKIPEDIA API
                </p>
            </section>

            <section className="results-section">
                <div className="results-heading">
                    <div>
                        <span className="section-label">DISCOVER</span>
                        <h2>
                            {search.trim() ? 'Search results' : 'Ready to explore?'}
                        </h2>
                    </div>

                    {data.length > 0 && (
                        <span className="result-count">
                            {data.length} results
                        </span>
                    )}
                </div>

                {load && (
                    <div className="status-message">
                        <span className="loader"></span>
                        <p>Finding something interesting...</p>
                    </div>
                )}

                {!load && err && (
                    <div className="error-message">
                        <span>!</span>
                        <p>{err}</p>
                    </div>
                )}

                {!load && !err && data.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">⌕</div>
                        <h3>Your next discovery awaits.</h3>
                        <p>Enter a keyword above to explore Wikipedia.</p>
                    </div>
                )}

                {!load && !err && data.length > 0 && (
                    <div className="results-grid">
                        {data.map((item) => (
                            <article
                                className="result-card"
                                key={item.pageid}
                            >
                                <div className="card-top">
                                    <span className="card-icon">↗</span>
                                    <span className="card-label">
                                        WIKIPEDIA ARTICLE
                                    </span>
                                </div>

                                <h3>{item.title}</h3>
                                <p className="result-snippet">
                                    {item.snippet.replace(/<[^>]*>/g, '')}
                                </p>
                                <a
                                    className="read-more"
                                    href={`https://en.wikipedia.org/?curid=${item.pageid}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Read article <span>→</span>
                                </a>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <footer className="search-footer">
                <span>BUILT FOR THE CURIOUS.</span>
                <span>Explore. Learn. Repeat. ✦</span>
            </footer>
        </main>
    );
}
