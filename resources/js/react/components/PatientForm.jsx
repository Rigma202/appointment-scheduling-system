import { useState } from 'react';
import api, { parseError } from '../api';
import { toast } from '../ui/notify';

export default function PatientForm({
    mode = 'create',
    action,
    patient = null,
    onSuccess,
    submitLabel,
    redirectTo,
}) {
    const [form, setForm] = useState({
        name: patient?.name ?? '',
        phone: patient?.phone ?? '',
        email: patient?.email ?? '',
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
            toast('success', data.message ?? 'Patient saved successfully', mode === 'edit' ? 'Updated' : 'Success');
            onSuccess?.(data);
            if (redirectTo) setTimeout(() => (window.location.href = redirectTo), 800);
        } catch (error) {
            const e2 = parseError(error);
            if (e2.status === 422) {
                setErrors(e2.errors);
            } else {
                const msg = Object.values(e2.errors).flat().join('\n') || e2.message;
                toast('error', msg, 'Error');
            }
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

            <div className="mt-3">
                <button type="submit" className="btn btn-primary" disabled={busy}>
                    {busy ? 'Saving...' : submitLabel ?? (mode === 'edit' ? 'Update Patient' : 'Save')}
                </button>
            </div>
        </form>
    );
}
