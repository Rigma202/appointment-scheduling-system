import { useMemo, useState } from 'react';

// Minimal client-side table: search, column sort and pagination.
// Replaces the jQuery DataTables plugin.
export default function DataTable({ columns, rows, pageSize = 10, emptyText = 'No records found' }) {
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState({ key: null, dir: 'asc' });
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return rows;
        return rows.filter((row) =>
            columns.some((c) => {
                const v = c.value ? c.value(row) : row[c.key];
                return String(v ?? '').toLowerCase().includes(q);
            })
        );
    }, [rows, columns, query]);

    const sorted = useMemo(() => {
        if (!sort.key) return filtered;
        const col = columns.find((c) => c.key === sort.key);
        const data = [...filtered].sort((a, b) => {
            const av = col.value ? col.value(a) : a[sort.key];
            const bv = col.value ? col.value(b) : b[sort.key];
            if (av == null) return 1;
            if (bv == null) return -1;
            return String(av).localeCompare(String(bv), undefined, { numeric: true });
        });
        return sort.dir === 'asc' ? data : data.reverse();
    }, [filtered, sort, columns]);

    const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
    const current = Math.min(page, pageCount);
    const pageRows = sorted.slice((current - 1) * pageSize, current * pageSize);

    const toggleSort = (key, sortable) => {
        if (sortable === false) return;
        setSort((s) =>
            s.key === key
                ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' }
                : { key, dir: 'asc' }
        );
    };

    return (
        <div>
            <div className="d-flex justify-content-end mb-2">
                <input
                    type="search"
                    className="form-control"
                    style={{ maxWidth: 240 }}
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setPage(1);
                    }}
                />
            </div>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        {columns.map((c) => (
                            <th
                                key={c.key}
                                style={{
                                    cursor: c.sortable === false ? 'default' : 'pointer',
                                    width: c.width,
                                }}
                                onClick={() => toggleSort(c.key, c.sortable)}
                            >
                                {c.label}
                                {sort.key === c.key && (sort.dir === 'asc' ? ' ▲' : ' ▼')}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {pageRows.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="text-center text-muted">
                                {emptyText}
                            </td>
                        </tr>
                    ) : (
                        pageRows.map((row, i) => (
                            <tr key={row.id ?? i}>
                                {columns.map((c) => (
                                    <td key={c.key}>
                                        {c.render ? c.render(row) : row[c.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {pageCount > 1 && (
                <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                        Showing {(current - 1) * pageSize + 1}–
                        {Math.min(current * pageSize, sorted.length)} of {sorted.length}
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
