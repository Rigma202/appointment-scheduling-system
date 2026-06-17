import { useMemo, useState } from 'react';

// Reusable searchable, paginated responsive card grid.
// - items: array of records
// - searchText: (item) => string used for filtering
// - renderCard: (item) => JSX for a single card body
// - cols: bootstrap row-cols class suffixes per breakpoint
export default function CardGrid({
    items,
    searchText,
    renderCard,
    pageSize = 9,
    emptyText = 'No records found',
    cols = 'row-cols-1 row-cols-md-2 row-cols-xl-3',
}) {
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return items;
        return items.filter((it) => String(searchText(it) ?? '').toLowerCase().includes(q));
    }, [items, query, searchText]);

    const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
    const current = Math.min(page, pageCount);
    const pageItems = filtered.slice((current - 1) * pageSize, current * pageSize);

    return (
        <div>
            <div className="mb-3">
                <div className="input-group" style={{ maxWidth: 320 }}>
                    <span className="input-group-text bg-white">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="7" cy="7" r="5" />
                            <line x1="11" y1="11" x2="15" y2="15" />
                        </svg>
                    </span>
                    <input
                        type="search"
                        className="form-control"
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
            </div>

            {pageItems.length === 0 ? (
                <div className="text-center text-muted py-5 border rounded bg-light">
                    {emptyText}
                </div>
            ) : (
                <div className={`row ${cols} g-3`}>
                    {pageItems.map((it, i) => (
                        <div className="col" key={it.id ?? i}>
                            {renderCard(it)}
                        </div>
                    ))}
                </div>
            )}

            {pageCount > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <small className="text-muted">
                        Showing {(current - 1) * pageSize + 1}–
                        {Math.min(current * pageSize, filtered.length)} of {filtered.length}
                    </small>
                    <ul className="pagination mb-0">
                        <li className={`page-item ${current === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPage(current - 1)}>
                                Prev
                            </button>
                        </li>
                        {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
                            <li key={p} className={`page-item ${p === current ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => setPage(p)}>
                                    {p}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${current === pageCount ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPage(current + 1)}>
                                Next
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}
