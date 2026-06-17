import { useEffect } from 'react';

// Controlled Bootstrap-styled modal that does not depend on Bootstrap's JS
// (and therefore not on jQuery). Visibility is driven purely by the `open` prop.
export default function Modal({ open, title, onClose, children, size = 'lg' }) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === 'Escape' && onClose?.();
        document.addEventListener('keydown', onKey);
        document.body.classList.add('modal-open');
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.classList.remove('modal-open');
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <>
            <div
                className="modal fade show d-block"
                tabIndex="-1"
                onClick={() => onClose?.()}
            >
                <div
                    className={`modal-dialog modal-${size}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => onClose?.()}
                            />
                        </div>
                        <div className="modal-body">{children}</div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show" />
        </>
    );
}
