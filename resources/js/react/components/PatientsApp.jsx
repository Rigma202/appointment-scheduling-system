import { useState } from 'react';
import api, { parseError } from '../api';
import DataTable from '../ui/DataTable';
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

    const columns = [
        { key: 'name', label: 'Name' },
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
            <h3>Patients</h3>
            <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
                    + Create Patient
                </button>
            </div>

            <DataTable columns={columns} rows={rows} emptyText="No patients found" />

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
        </div>
    );
}
