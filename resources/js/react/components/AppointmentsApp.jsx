import { useState } from 'react';
import api, { parseError } from '../api';
import DataTable from '../ui/DataTable';
import Select from '../ui/Select';
import Modal from '../ui/Modal';
import AppointmentForm from './AppointmentForm';
import { confirm, toast } from '../ui/notify';

const EMPTY_FILTERS = { doctor_id: '', department_id: '', status: '', date: '' };

const STATUS_OPTIONS = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
];

// Coloured text (no background) per status.
const STATUS_TEXT = {
    scheduled: 'text-primary',
    completed: 'text-success',
    cancelled: 'text-danger',
    pending: 'text-warning',
};

export default function AppointmentsApp({
    appointments: initial = [],
    doctors = [],
    patients = [],
    departments = [],
    storeAction,
    filterUrl,
    baseUrl = '/appointments',
}) {
    const [rows, setRows] = useState(initial);
    const [showCreate, setShowCreate] = useState(false);
    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [filtering, setFiltering] = useState(false);

    const setFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value }));

    const applyFilters = async () => {
        if (!filterUrl) return;
        setFiltering(true);
        try {
            const params = Object.fromEntries(
                Object.entries(filters).filter(([, v]) => v !== '' && v != null)
            );
            const { data } = await api.get(filterUrl, { params });
            setRows(data.data ?? []);
        } catch (error) {
            toast('error', parseError(error).message || 'Could not filter appointments.', 'Error');
        } finally {
            setFiltering(false);
        }
    };

    const resetFilters = () => {
        setFilters({ ...EMPTY_FILTERS });
        setRows(initial);
    };

    const onDelete = async (row) => {
        const message =
            row.status === 'scheduled'
                ? 'This appointment is currently scheduled. Do you want to delete it? This action cannot be undone.'
                : 'Are you sure you want to delete this appointment?';

        const ok = await confirm({
            title: 'Delete Appointment?',
            text: message,
            confirmText: 'Yes, Delete',
        });
        if (!ok) return;

        try {
            const { data } = await api.delete(`${baseUrl}/${row.id}`);
            setRows((r) => r.filter((x) => x.id !== row.id));
            toast('success', data.message ?? 'Appointment deleted.', 'Deleted');
        } catch (error) {
            toast('error', parseError(error).message || 'Unable to delete appointment.', 'Error');
        }
    };

    const columns = [
        { key: 'id', label: '#', width: 60 },
        { key: 'doctor_name', label: 'Doctor' },
        { key: 'patient_name', label: 'Patient' },
        { key: 'department', label: 'Department' },
        { key: 'datetime', label: 'Date & Time' },
        { key: 'duration', label: 'Duration', render: (r) => `${r.duration} min` },
        {
            key: 'status',
            label: 'Status',
            render: (r) => {
                const status = (r.status || '').toLowerCase();
                return (
                    <span className={`fw-semibold ${STATUS_TEXT[status] || 'text-secondary'}`}>
                        {r.status ? r.status[0].toUpperCase() + r.status.slice(1) : '—'}
                    </span>
                );
            },
        },
        {
            key: 'action',
            label: 'Action',
            sortable: false,
            width: 200,
            render: (r) => (
                <div className="d-flex gap-1">
                    <a href={`${baseUrl}/${r.id}`} className="btn btn-view btn-sm">
                        View
                    </a>
                    <a href={`${baseUrl}/${r.id}/edit`} className="btn btn-edit btn-sm">
                        Edit
                    </a>
                    <button className="btn btn-delete btn-sm" onClick={() => onDelete(r)}>
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="mb-0">Appointments</h3>
                <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
                    + Create Appointment
                </button>
            </div>

            <div className="card border-0 shadow-sm mb-3 appt-filter">
                <div className="card-body">
                    <div className="row g-3 align-items-end">
                        <div className="col-md-3">
                            <label className="form-label small">Doctor</label>
                            <Select
                                value={filters.doctor_id}
                                onChange={(v) => setFilter('doctor_id', v)}
                                options={doctors.map((d) => ({
                                    value: d.id,
                                    label: d.department ? `${d.name} (${d.department})` : d.name,
                                }))}
                                placeholder="All Doctors"
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small">Department</label>
                            <Select
                                value={filters.department_id}
                                onChange={(v) => setFilter('department_id', v)}
                                options={departments.map((d) => ({ value: d.id, label: d.name }))}
                                placeholder="All Departments"
                            />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label small">Status</label>
                            <Select
                                value={filters.status}
                                onChange={(v) => setFilter('status', v)}
                                options={STATUS_OPTIONS}
                                placeholder="All Status"
                            />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label small">Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={filters.date}
                                onChange={(e) => setFilter('date', e.target.value)}
                            />
                        </div>
                        <div className="col-md-2 d-flex gap-2">
                            <button className="btn btn-primary flex-grow-1" onClick={applyFilters} disabled={filtering}>
                                {filtering ? '...' : 'Filter'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={resetFilters}
                                disabled={filtering}
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm appt-table">
                <div className="card-body">
                    <DataTable
                        columns={columns}
                        rows={rows}
                        pageSize={7}
                        emptyText="No appointments found"
                    />
                </div>
            </div>

            <Modal open={showCreate} title="Create Appointment" onClose={() => setShowCreate(false)}>
                <AppointmentForm
                    mode="create"
                    action={storeAction}
                    doctors={doctors}
                    patients={patients}
                    onSuccess={() => {
                        setShowCreate(false);
                        window.location.reload();
                    }}
                />
            </Modal>
        </div>
    );
}
