import { useState } from 'react';
import api, { parseError } from '../api';
import CardGrid from '../ui/CardGrid';
import Avatar from '../ui/Avatar';
import Modal from '../ui/Modal';
import PatientForm from './PatientForm';
import { confirm, toast } from '../ui/notify';

export default function PatientsApp({
    patients: initial = [],
    storeAction,
    baseUrl = '/patients',
}) {
    const [rows, setRows] = useState(initial);
    const [showCreate, setShowCreate] = useState(false);
    const [editPatient, setEditPatient] = useState(null);

    const onDelete = async (row) => {
        const ok = await confirm({
            title: 'Delete patient?',
            text: 'All related appointments will also be deleted!',
            confirmText: 'Yes',
        });
        if (!ok) return;

        try {
            const { data } = await api.delete(`${baseUrl}/${row.id}`);
            setRows((r) => r.filter((x) => x.id !== row.id));
            toast('success', data.message ?? 'Patient deleted', 'Deleted');
        } catch (error) {
            toast('error', parseError(error).message, 'Error');
        }
    };

    const renderCard = (p) => (
        <div className="card entity-card card-patient h-100 shadow-sm">
            <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                    <Avatar name={p.name} />
                    <div className="ms-3 overflow-hidden">
                        <h6 className="mb-0 text-truncate">{p.name}</h6>
                        <small className="text-muted">Patient</small>
                    </div>
                </div>
                <ul className="list-unstyled small text-muted mb-0">
                    <li className="d-flex align-items-center mb-1">
                        <span className="me-2">📞</span>
                        <span className="text-truncate">{p.phone || '—'}</span>
                    </li>
                    <li className="d-flex align-items-center">
                        <span className="me-2">✉️</span>
                        <span className="text-truncate">{p.email || '—'}</span>
                    </li>
                </ul>
            </div>
            <div className="card-footer border-0 d-flex justify-content-end gap-2 pt-0">
                <button className="btn btn-edit btn-sm" onClick={() => setEditPatient(p)}>
                    Edit
                </button>
                <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(p)}>
                    Delete
                </button>
            </div>
        </div>
    );

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="mb-0">Patients</h3>
                <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
                    + Create Patient
                </button>
            </div>

            <CardGrid
                items={rows}
                searchText={(p) => `${p.name} ${p.phone} ${p.email}`}
                renderCard={renderCard}
                pageSize={6}
                emptyText="No patients found"
            />

            <Modal open={showCreate} title="Create Patient" size="md" onClose={() => setShowCreate(false)}>
                <PatientForm
                    mode="create"
                    action={storeAction}
                    onSuccess={() => {
                        setShowCreate(false);
                        window.location.reload();
                    }}
                />
            </Modal>

            <Modal
                open={!!editPatient}
                title="Edit Patient"
                size="md"
                onClose={() => setEditPatient(null)}
            >
                {editPatient && (
                    <PatientForm
                        mode="edit"
                        action={`${baseUrl}/${editPatient.id}`}
                        patient={editPatient}
                        submitLabel="Update"
                        onSuccess={() => {
                            setEditPatient(null);
                            window.location.reload();
                        }}
                    />
                )}
            </Modal>
        </div>
    );
}
