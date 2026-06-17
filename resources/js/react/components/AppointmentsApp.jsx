import { useState } from 'react';
import api, { parseError } from '../api';
import DataTable from '../ui/DataTable';
import Modal from '../ui/Modal';
import AppointmentForm from './AppointmentForm';
import { confirm, toast } from '../ui/notify';

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
        { key: 'id', label: 'ID', width: 70 },
        { key: 'doctor_name', label: 'Doctor' },
        { key: 'patient_name', label: 'Patient' },
        { key: 'department', label: 'Department' },
        { key: 'datetime', label: 'Date Time' },
        { key: 'duration', label: 'Duration' },
        { key: 'status', label: 'Status', render: (r) => (r.status ? r.status[0].toUpperCase() + r.status.slice(1) : '') },
        {
            key: 'action',
            label: 'Action',
            sortable: false,
            width: 180,
            render: (r) => (
                <>
                    <a href={`${baseUrl}/${r.id}`} className="btn btn-info btn-sm me-1">
                        View
                    </a>
                    <a href={`${baseUrl}/${r.id}/edit`} className="btn btn-warning btn-sm me-1">
                        Edit
                    </a>
                    <button className="btn btn-danger btn-sm" onClick={() => onDelete(r)}>
                        Delete
                    </button>
                </>
            ),
        },
    ];

    return (
        <div className="container">
            <div className="d-flex justify-content-end mb-2">
                <button className="btn btn-warning" onClick={() => setShowCreate(true)}>
                    Create Appointment
                </button>
            </div>

            <DataTable columns={columns} rows={rows} emptyText="No appointments found" />

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
