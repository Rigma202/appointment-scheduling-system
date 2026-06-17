// Circular initials avatar with a deterministic colour derived from the name.
const COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

function initials(name = '') {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Avatar({ name, size = 48 }) {
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    const bg = COLORS[Math.abs(hash) % COLORS.length];

    return (
        <div
            className="d-flex align-items-center justify-content-center text-white fw-semibold flex-shrink-0"
            style={{
                width: size,
                height: size,
                borderRadius: '50%',
                background: bg,
                fontSize: size * 0.38,
            }}
        >
            {initials(name)}
        </div>
    );
}
