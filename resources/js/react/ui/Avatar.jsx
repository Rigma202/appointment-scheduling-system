// Circular initials avatar. A single brand colour is used for everyone;
// pass `color` to override for a specific avatar.
const DEFAULT_COLOR = '#5d4037';

function initials(name = '') {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Avatar({ name, size = 48, color }) {
    const bg = color || DEFAULT_COLOR;

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
