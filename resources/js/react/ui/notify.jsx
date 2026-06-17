import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';

// Imperative toast + confirm API that replaces SweetAlert2 / alert().
// A single host component is mounted lazily on <body> and driven through
// a tiny module-level store.

let listeners = [];
let state = { toasts: [], confirm: null };
let seq = 0;

function emit() {
    listeners.forEach((l) => l(state));
}

function setState(next) {
    state = next;
    emit();
}

function subscribe(listener) {
    listeners.push(listener);
    return () => {
        listeners = listeners.filter((l) => l !== listener);
    };
}

export function toast(type, message, title) {
    const id = ++seq;
    setState({
        ...state,
        toasts: [...state.toasts, { id, type, message, title }],
    });
    setTimeout(() => dismissToast(id), 4000);
}

function dismissToast(id) {
    setState({ ...state, toasts: state.toasts.filter((t) => t.id !== id) });
}

export function confirm(options) {
    return new Promise((resolve) => {
        setState({
            ...state,
            confirm: {
                title: 'Are you sure?',
                text: '',
                confirmText: 'Yes',
                cancelText: 'Cancel',
                ...options,
                resolve,
            },
        });
    });
}

function closeConfirm(result) {
    const current = state.confirm;
    setState({ ...state, confirm: null });
    current?.resolve(result);
}

const TONE = {
    success: { bg: 'bg-success', icon: '✓' },
    error: { bg: 'bg-danger', icon: '✕' },
    warning: { bg: 'bg-warning text-dark', icon: '!' },
    info: { bg: 'bg-primary', icon: 'i' },
};

function NotificationHost() {
    const [s, setS] = useState(state);
    useEffect(() => subscribe(setS), []);

    return (
        <>
            <div
                className="toast-container position-fixed top-0 end-0 p-3"
                style={{ zIndex: 1090 }}
            >
                {s.toasts.map((t) => {
                    const tone = TONE[t.type] ?? TONE.info;
                    return (
                        <div
                            key={t.id}
                            className={`toast show align-items-center text-white ${tone.bg} border-0 mb-2`}
                            role="alert"
                        >
                            <div className="d-flex">
                                <div className="toast-body">
                                    {t.title && <strong className="d-block">{t.title}</strong>}
                                    {t.message}
                                </div>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white me-2 m-auto"
                                    onClick={() => dismissToast(t.id)}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {s.confirm && (
                <>
                    <div
                        className="modal fade show d-block"
                        tabIndex="-1"
                        style={{ zIndex: 1080 }}
                        onClick={() => closeConfirm(false)}
                    >
                        <div
                            className="modal-dialog modal-dialog-centered"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{s.confirm.title}</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => closeConfirm(false)}
                                    />
                                </div>
                                <div className="modal-body">
                                    <p className="mb-0">{s.confirm.text}</p>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => closeConfirm(false)}
                                    >
                                        {s.confirm.cancelText}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => closeConfirm(true)}
                                    >
                                        {s.confirm.confirmText}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show" style={{ zIndex: 1070 }} />
                </>
            )}
        </>
    );
}

let mounted = false;
export function ensureNotifyHost() {
    if (mounted) return;
    mounted = true;
    const el = document.createElement('div');
    document.body.appendChild(el);
    createRoot(el).render(<NotificationHost />);
}
