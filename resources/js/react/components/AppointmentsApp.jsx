import { useState } from 'react';
import api, { parseError } from '../api';
import DataTable from '../ui/DataTable';
import Modal from '../ui/Modal';
import AppointmentForm from './AppointmentForm';
import { confirm, toast } from '../ui/notify';

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
    storeAction,
    baseUrl = '/appointments',
}) {
    const [rows, setRows] = useState(initial);
    const [showCreate, setShowCreate] = useState(false);

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
