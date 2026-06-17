import { useState } from 'react';
import api, { parseError } from '../api';
import CardGrid from '../ui/CardGrid';
import Avatar from '../ui/Avatar';
import Modal from '../ui/Modal';
import DoctorForm from './DoctorForm';
import { confirm, toast } from '../ui/notify';

export default function DoctorsApp({
    doctors: initial = [],
    departments = [],
    storeAction,
    baseUrl = '/doctors',
}) {
    const [rows, setRows] = useState(initial);
    const [showCreate, setShowCreate] = useState(false);
    const [editDoctor, setEditDoctor] = useState(null);

    const onDelete = async (row) => {
        const ok = await confirm({
            title: 'Are you sure?',
            text: 'Doctor and all related appointments will be deleted!',
            confirmText: 'Yes, delete it!',
        });
        if (!ok) return;

        try {
            const { data } = await api.delete(`${baseUrl}/${row.id}`);
            setRows((r) => r.filter((x) => x.id !== row.id));
            toast('success', data.message ?? 'Doctor deleted', 'Deleted');
        } catch (error) {
            toast('error', parseError(error).message, 'Error');
        }
    };

    const renderCard = (d) => (
        <div className="card entity-card card-doctor h-100 shadow-sm">
            <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                    <Avatar name={d.name} />
                    <div className="ms-3 overflow-hidden">
                        <h6 className="mb-0 text-truncate">{d.name}</h6>
                        <span className="badge rounded-pill bg-info-subtle text-info-emphasis mt-1">
                            {d.department || 'No department'}
                        </span>
                    </div>
                </div>
                <ul className="list-unstyled small text-muted mb-0">
                    <li className="d-flex align-items-center mb-1">
                        <span className="me-2">📞</span>
                        <span className="text-truncate">{d.phone || '—'}</span>
                    </li>
                    <li className="d-flex align-items-center">
                        <span className="me-2">✉️</span>
                        <span className="text-truncate">{d.email || '—'}</span>
                    </li>
                </ul>
            </div>
            <div className="card-footer border-0 d-flex justify-content-end gap-2 pt-0">
                <button className="btn btn-edit btn-sm" onClick={() => setEditDoctor(d)}>
                    Edit
                </button>
                <button className="btn btn-delete btn-sm" onClick={() => onDelete(d)}>
                    Delete
                </button>
            </div>
        </div>
    );

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="mb-0">Doctors</h3>
                <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
                    + Add Doctor
                </button>
            </div>

            <CardGrid
                items={rows}
                searchText={(d) => `${d.name} ${d.department} ${d.phone} ${d.email}`}
                renderCard={renderCard}
                pageSize={6}
                emptyText="No doctors found"
            />

            <Modal open={showCreate} title="Create Doctor" onClose={() => setShowCreate(false)}>
                <DoctorForm
                    mode="create"
                    action={storeAction}
                    departments={departments}
                    onSuccess={() => {
                        setShowCreate(false);
                        window.location.reload();
                    }}
                />
            </Modal>

            <Modal
                open={!!editDoctor}
                title="Edit Doctor"
                onClose={() => setEditDoctor(null)}
            >
                {editDoctor && (
                    <DoctorForm
                        mode="edit"
                        action={`${baseUrl}/${editDoctor.id}`}
                        departments={departments}
                        doctor={editDoctor}
                        submitLabel="Update"
                        onSuccess={() => {
                            setEditDoctor(null);
                            window.location.reload();
                        }}
                    />
                )}
            </Modal>
        </div>
    );
}
