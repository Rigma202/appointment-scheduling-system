import { useEffect, useRef, useState } from 'react';

// Searchable single-select, replacing select2. `options` is [{value, label}].
export default function Select({
    value,
    onChange,
    options,
    placeholder = 'Select Option',
    id,
    invalid = false,
    allowClear = true,
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const ref = useRef(null);

    useEffect(() => {
        const onDoc = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, []);

    const selected = options.find((o) => String(o.value) === String(value));
    const filtered = options.filter((o) =>
        o.label.toLowerCase().includes(query.trim().toLowerCase())
    );

    return (
        <div className="position-relative" ref={ref}>
            <div
                id={id}
                className={`form-select d-flex justify-content-between align-items-center ${
                    invalid ? 'is-invalid' : ''
                }`}
                style={{ cursor: 'pointer' }}
                onClick={() => setOpen((o) => !o)}
                role="button"
            >
                <span className={selected ? '' : 'text-muted'}>
                    {selected ? selected.label : placeholder}
                </span>
                {allowClear && selected && (
                    <span
                        className="text-muted ms-2"
                        onClick={(e) => {
                            e.stopPropagation();
                            onChange('');
                        }}
                        aria-label="Clear"
                    >
                        ×
                    </span>
                )}
            </div>

            {open && (
                <div
                    className="border rounded bg-white shadow-sm position-absolute w-100"
                    style={{ zIndex: 1060, maxHeight: 260, overflowY: 'auto' }}
                >
                    <div className="p-2">
                        <input
                            autoFocus
                            className="form-control form-control-sm"
                            placeholder="Search..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <ul className="list-unstyled mb-0">
                        {filtered.length === 0 && (
                            <li className="px-3 py-2 text-muted">No results</li>
                        )}
                        {filtered.map((o) => (
                            <li
                                key={o.value}
                                className={`px-3 py-2 ${
                                    String(o.value) === String(value)
                                        ? 'bg-primary text-white'
                                        : ''
                                }`}
                                style={{ cursor: 'pointer' }}
                                onMouseDown={() => {
                                    onChange(o.value);
                                    setOpen(false);
                                    setQuery('');
                                }}
                            >
                                {o.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
