import { useState } from 'react';
import api, { parseError } from '../api';
import DataTable from '../ui/DataTable';
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

    const columns = [
        { key: 'id', label: 'Sl no.', width: 80 },
        { key: 'name', label: 'Name' },
        { key: 'department', label: 'Department' },
        { key: 'phone', label: 'Phone' },
        { key: 'email', label: 'Email' },
        {
            key: 'action',
            label: 'Action',
            sortable: false,
            width: 150,
            render: (r) => (
                <>
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
            <h3>Doctors</h3>
            <div className="d-flex justify-content-end mb-2">
                <button className="btn btn-primary mb-3" onClick={() => setShowCreate(true)}>
                    Add Doctor
                </button>
            </div>

            <DataTable columns={columns} rows={rows} emptyText="No doctors found" />

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
        </div>
    );
}
