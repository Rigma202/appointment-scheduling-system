import { useState } from 'react';
import api, { parseError } from '../api';
import Select from '../ui/Select';
import { toast } from '../ui/notify';

const STATUS_STYLE = {
    scheduled: 'text-bg-primary',
    completed: 'text-bg-success',
    cancelled: 'text-bg-danger',
    pending: 'text-bg-warning',
};

function StatCard({ label, value, sub, accent, icon, big = true }) {
    return (
        <div className="col">
            <div className="card border-0 shadow-sm h-100">
                <div className="card-body d-flex align-items-start">
                    <div
                        className="d-flex align-items-center justify-content-center flex-shrink-0 me-3"
                        style={{ width: 52, height: 52, borderRadius: 14, background: accent + '22', color: accent }}
                    >
                        {icon}
                    </div>
                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                        <div
                            className="text-muted small text-uppercase fw-semibold"
                            style={{ letterSpacing: '.05em' }}
                        >
                            {label}
                        </div>
                        <div
                            className={`fw-bold ${big ? 'fs-3' : 'fs-6'}`}
                            style={{ lineHeight: 1.2, wordBreak: 'break-word' }}
                        >
                            {value}
                        </div>
                        {sub && <div className="small text-muted fw-semibold">{sub}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}

function todayStr() {
    return new Date().toISOString().slice(0, 10);
}

export default function Dashboard({ stats = {}, doctors = [], searchUrl }) {
    const [doctorId, setDoctorId] = useState('');
    const [date, setDate] = useState(todayStr());
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const search = async () => {
        if (!doctorId) return toast('warning', 'Please select a doctor');
        if (!date) return toast('warning', 'Please select a date');

        setLoading(true);
        setResults(null);
        try {
            const { data } = await api.get(searchUrl, { params: { doctor_id: doctorId, date } });
            setResults(data.data ?? []);
        } catch (error) {
            toast('error', parseError(error).message || 'Search failed');
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid">
            <h3 className="mb-4">Dashboard</h3>

            <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-5 g-3 mb-4">
                <StatCard
                    label="This Week"
                    value={stats.week ?? 0}
                    sub="Appointments"
                    accent="#6366f1"
                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>}
                />
                <StatCard
                    label="Scheduled"
                    value={stats.scheduled ?? 0}
                    sub="Total"
                    accent="#0ea5e9"
                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>}
                />
                <StatCard
                    label="Cancelled"
                    value={stats.cancelled ?? 0}
                    sub="Total"
                    accent="#ef4444"
                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/></svg>}
                />
                <StatCard
                    label="Most Active"
                    big={false}
                    value={stats.most?.name ?? '—'}
                    sub={stats.most ? `${stats.most.count} appointments` : 'No data'}
                    accent="#10b981"
                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l6-6 4 4 7-7"/><path d="M14 7h7v7"/></svg>}
                />
                <StatCard
                    label="Least Active"
                    big={false}
                    value={stats.least?.name ?? '—'}
                    sub={stats.least ? `${stats.least.count} appointments` : 'No data'}
                    accent="#f59e0b"
                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7l6 6 4-4 7 7"/><path d="M14 17h7v-7"/></svg>}
                />
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 pt-3">
                    <h5 className="mb-0">Find Appointments</h5>
                </div>
                <div className="card-body">
                    <div className="row g-3 align-items-end">
                        <div className="col-md-5">
                            <Select
                                value={doctorId}
                                onChange={setDoctorId}
                                options={doctors.map((d) => ({
                                    value: d.id,
                                    label: d.department ? `${d.name} (${d.department})` : d.name,
                                }))}
                                placeholder="Select Doctor"
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <button className="btn btn-primary w-100" onClick={search} disabled={loading}>
                                {loading ? 'Searching...' : 'Search'}
                            </button>
                        </div>
                    </div>

                    {results !== null && (
                        <div className="mt-4">
                            {results.length === 0 ? (
                                <div className="text-center text-muted py-4 border rounded bg-light">
                                    No appointments found for this doctor on the selected date.
                                </div>
                            ) : (
                                <table className="table table-bordered align-middle mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th style={{ width: 70 }}>#</th>
                                            <th>Time</th>
                                            <th>Patient</th>
                                            <th>Duration</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.map((r) => (
                                            <tr key={r.id}>
                                                <td>{r.id}</td>
                                                <td>{r.time}</td>
                                                <td>{r.patient}</td>
                                                <td>{r.duration} min</td>
                                                <td>
                                                    <span className={`badge rounded-pill ${STATUS_STYLE[r.status] || 'text-bg-secondary'}`}>
                                                        {r.status ? r.status[0].toUpperCase() + r.status.slice(1) : '—'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
