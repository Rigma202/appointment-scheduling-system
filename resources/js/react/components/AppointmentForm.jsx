import { useState } from 'react';
import api, { parseError } from '../api';
import Select from '../ui/Select';
import Modal from '../ui/Modal';
import { toast } from '../ui/notify';

function timeOptions() {
    const out = [];
    let h = 9;
    let m = 15;
    while (h < 16 || (h === 16 && m === 0)) {
        const value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        const hour12 = ((h + 11) % 12) + 1;
        const ampm = h < 12 ? 'AM' : 'PM';
        out.push({ value, label: `${String(hour12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}` });
        m += 15;
        if (m >= 60) {
            m = 0;
            h += 1;
        }
    }
    return out;
}

const TIME_OPTIONS = timeOptions();
const DURATION_OPTIONS = [15, 30, 45, 60].map((d) => ({ value: d, label: `${d} Minutes` }));

function tomorrowStr() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
}

export default function AppointmentForm({
    mode = 'create',
    action,
    doctors = [],
    patients = [],
    appointment = null,
    onSuccess,
    redirectTo,
}) {
    const [form, setForm] = useState({
        doctor_id: appointment?.doctor_id ?? '',
        patient_id: appointment?.patient_id ?? '',
        appointment_date: appointment?.appointment_date ?? '',
        appointment_time: appointment?.appointment_time ?? '',
        duration: appointment?.duration ?? '',
    });
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);
    const [conflict, setConflict] = useState(null);

    const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

    const submit = async (e) => {
        e.preventDefault();
        setErrors({});
        setBusy(true);
        try {
            const request = mode === 'edit' ? api.put(action, form) : api.post(action, form);
            const { data } = await request;
            toast('success', data.message ?? 'Saved successfully', 'Success');
            onSuccess?.(data);
            if (redirectTo) setTimeout(() => (window.location.href = redirectTo), 800);
        } catch (error) {
            const e2 = parseError(error);
            if (e2.status === 422) {
                setErrors(e2.errors);
            } else if (e2.status === 409) {
                if (e2.data.type === 'doctor_conflict') {
                    setConflict({ message: e2.message, bookings: e2.data.bookings ?? [] });
                } else {
                    toast('warning', e2.message, 'Conflict');
                }
            } else {
                toast('error', 'Something went wrong.', 'Error');
            }
        } finally {
            setBusy(false);
        }
    };

    const err = (field) => errors[field]?.[0];

    return (
        <>
            <form onSubmit={submit} className="appointment-form-card">
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Doctor</label>
                        <Select
                            value={form.doctor_id}
                            onChange={(v) => set('doctor_id', v)}
                            options={doctors.map((d) => ({
                                value: d.id,
                                label: d.department ? `${d.name} (${d.department})` : d.name,
                            }))}
                            placeholder="Select Doctor"
                            invalid={!!err('doctor_id')}
                        />
                        {err('doctor_id') && <span className="text-danger">{err('doctor_id')}</span>}
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Patient</label>
                        <Select
                            value={form.patient_id}
                            onChange={(v) => set('patient_id', v)}
                            options={patients.map((p) => ({ value: p.id, label: p.name }))}
                            placeholder="Select Patient"
                            invalid={!!err('patient_id')}
                        />
                        {err('patient_id') && <span className="text-danger">{err('patient_id')}</span>}
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Appointment Date</label>
                        <input
                            type="date"
                            className={`form-control ${err('appointment_date') ? 'is-invalid' : ''}`}
                            min={tomorrowStr()}
                            value={form.appointment_date}
                            onChange={(e) => set('appointment_date', e.target.value)}
                        />
                        {err('appointment_date') && (
                            <span className="text-danger">{err('appointment_date')}</span>
                        )}
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Appointment Time</label>
                        <Select
                            value={form.appointment_time}
                            onChange={(v) => set('appointment_time', v)}
                            options={TIME_OPTIONS}
                            placeholder="Select Time"
                            allowClear={false}
                            invalid={!!err('appointment_time')}
                        />
                        {err('appointment_time') && (
                            <span className="text-danger">{err('appointment_time')}</span>
                        )}
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Duration (Minutes)</label>
                        <Select
                            value={form.duration}
                            onChange={(v) => set('duration', v)}
                            options={DURATION_OPTIONS}
                            placeholder="Select Duration"
                            invalid={!!err('duration')}
                        />
                        {err('duration') && <span className="text-danger">{err('duration')}</span>}
                    </div>

                    <div className="col-12 text-end mt-3">
                        <button type="submit" className="btn btn-primary" disabled={busy}>
                            {busy ? 'Saving...' : mode === 'edit' ? 'Update Appointment' : 'Save Appointment'}
                        </button>
                    </div>
                </div>
            </form>

            <Modal
                open={!!conflict}
                title="Doctor Schedule Conflict"
                onClose={() => setConflict(null)}
            >
                <p>{conflict?.message}</p>
                <table className="table table-bordered mt-3">
                    <thead>
                        <tr>
                            <th>Appointment Time</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        {conflict?.bookings?.map((b, i) => (
                            <tr key={i}>
                                <td>{b.time}</td>
                                <td>{b.duration}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Modal>
        </>
    );
}
