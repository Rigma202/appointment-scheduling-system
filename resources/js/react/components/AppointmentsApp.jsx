import { useState } from 'react';
import api, { parseError } from '../api';
import CardGrid from '../ui/CardGrid';
import Modal from '../ui/Modal';
import AppointmentForm from './AppointmentForm';
import { confirm, toast } from '../ui/notify';

const STATUS_STYLE = {
    scheduled: 'text-bg-primary',
    completed: 'text-bg-success',
    cancelled: 'text-bg-danger',
    pending: 'text-bg-warning',
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

    const renderCard = (r) => {
        const status = (r.status || '').toLowerCase();
        return (
            <div className="card h-100 shadow-sm border-0">
                <div className="card-header bg-white d-flex justify-content-between align-items-center border-0">
                    <span className="text-muted small">#{r.id}</span>
                    <span className={`badge rounded-pill ${STATUS_STYLE[status] || 'text-bg-secondary'}`}>
                        {r.status ? r.status[0].toUpperCase() + r.status.slice(1) : '—'}
                    </span>
                </div>
                <div className="card-body pt-0">
                    <div className="d-flex align-items-center mb-2">
                        <span className="me-2 fs-5">🗓️</span>
                        <strong>{r.datetime}</strong>
                    </div>
                    <div className="row g-2 small">
                        <div className="col-12">
                            <span className="text-muted">Doctor:</span> {r.doctor_name}
                            {r.department && <span className="text-muted"> · {r.department}</span>}
                        </div>
                        <div className="col-12">
                            <span className="text-muted">Patient:</span> {r.patient_name}
                        </div>
                        <div className="col-12">
                            <span className="text-muted">Duration:</span> {r.duration} min
                        </div>
                    </div>
                </div>
                <div className="card-footer bg-white border-0 d-flex justify-content-end gap-2 pt-0">
                    <a href={`${baseUrl}/${r.id}`} className="btn btn-outline-info btn-sm">
                        View
                    </a>
                    <a href={`${baseUrl}/${r.id}/edit`} className="btn btn-outline-warning btn-sm">
                        Edit
                    </a>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(r)}>
                        Delete
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="mb-0">Appointments</h3>
                <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
                    + Create Appointment
                </button>
            </div>

            <CardGrid
                items={rows}
                searchText={(r) =>
                    `${r.id} ${r.doctor_name} ${r.patient_name} ${r.department} ${r.datetime} ${r.status}`
                }
                renderCard={renderCard}
                emptyText="No appointments found"
            />

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
