import { useState } from 'react';
import api, { parseError } from '../api';
import Select from '../ui/Select';
import { toast } from '../ui/notify';

export default function DoctorForm({
    mode = 'create',
    action,
    departments = [],
    doctor = null,
    onSuccess,
    submitLabel,
    redirectTo,
}) {
    const [form, setForm] = useState({
        name: doctor?.name ?? '',
        department_id: doctor?.department_id ?? '',
        phone: doctor?.phone ?? '',
        email: doctor?.email ?? '',
    });
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);

    const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
    const err = (field) => errors[field]?.[0];

    const submit = async (e) => {
        e.preventDefault();
        setErrors({});
        setBusy(true);
        try {
            const request = mode === 'edit' ? api.put(action, form) : api.post(action, form);
            const { data } = await request;
            toast('success', data.message ?? 'Doctor saved successfully', 'Success');
            onSuccess?.(data);
            if (redirectTo) setTimeout(() => (window.location.href = redirectTo), 800);
        } catch (error) {
            const e2 = parseError(error);
            if (e2.status === 422) setErrors(e2.errors);
            else toast('error', 'Something went wrong', 'Error');
        } finally {
            setBusy(false);
        }
    };

    return (
        <form onSubmit={submit}>
            <div className="mb-2">
                <label>Name</label>
                <input
                    type="text"
                    className={`form-control ${err('name') ? 'is-invalid' : ''}`}
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                />
                {err('name') && <small className="text-danger">{err('name')}</small>}
            </div>

            <div className="mb-2">
                <label>Department</label>
                <Select
                    value={form.department_id}
                    onChange={(v) => set('department_id', v)}
                    options={departments.map((d) => ({ value: d.id, label: d.name }))}
                    placeholder="Select"
                    invalid={!!err('department_id')}
                />
                {err('department_id') && (
                    <small className="text-danger">{err('department_id')}</small>
                )}
            </div>

            <div className="mb-2">
                <label>Phone</label>
                <input
                    type="text"
                    className={`form-control ${err('phone') ? 'is-invalid' : ''}`}
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                />
                {err('phone') && <small className="text-danger">{err('phone')}</small>}
            </div>

            <div className="mb-2">
                <label>Email</label>
                <input
                    type="email"
                    className={`form-control ${err('email') ? 'is-invalid' : ''}`}
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                />
                {err('email') && <small className="text-danger">{err('email')}</small>}
            </div>

            <div className="text-end mt-3">
                <button type="submit" className="btn btn-primary" disabled={busy}>
                    {busy ? 'Saving...' : submitLabel ?? (mode === 'edit' ? 'Update' : 'Save')}
                </button>
            </div>
        </form>
    );
}
