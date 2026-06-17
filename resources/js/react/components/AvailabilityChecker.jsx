import { useState } from 'react';
import api, { parseError } from '../api';
import Select from '../ui/Select';
import { toast } from '../ui/notify';

function todayStr() {
    return new Date().toISOString().slice(0, 10);
}

export default function AvailabilityChecker({ doctors = [] }) {
    const [doctorId, setDoctorId] = useState('');
    const [date, setDate] = useState('');
    const [slots, setSlots] = useState(null); // null = idle, [] = none, [...] = results
    const [loading, setLoading] = useState(false);

    const check = async () => {
        if (!doctorId) return toast('warning', 'Please select doctor');
        if (!date) return toast('warning', 'Please select date');

        setLoading(true);
        setSlots(null);
        try {
            const { data } = await api.get(`/api/doctors/${doctorId}/available-slots`, {
                params: { date },
            });
            setSlots(data.success ? data.data : []);
        } catch (error) {
            toast('error', parseError(error).message || 'Something went wrong');
            setSlots([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header">
                    <h4>Check Doctor Availability</h4>
                </div>
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Select Doctor</label>
                            <Select
                                value={doctorId}
                                onChange={setDoctorId}
                                options={doctors.map((d) => ({
                                    value: d.id,
                                    label: d.department ? `${d.name} (${d.department})` : d.name,
                                }))}
                                placeholder="Select Doctor"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Select Date</label>
                            <input
                                type="date"
                                className="form-control"
                                min={todayStr()}
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>

                        <div className="col-12">
                            <button className="btn btn-primary" onClick={check} disabled={loading}>
                                {loading ? 'Loading slots...' : 'Check Available Slots'}
                            </button>
                        </div>
                    </div>

                    <hr />
                    <h5>Available Slots</h5>
                    <div className="d-flex flex-wrap gap-2 mt-3">
                        {loading && <span className="text-muted">Loading slots...</span>}
                        {!loading && slots === null && (
                            <span className="text-muted">Select doctor and date</span>
                        )}
                        {!loading && slots !== null && slots.length === 0 && (
                            <span className="text-danger">No available slots</span>
                        )}
                        {!loading &&
                            slots?.map((slot) => (
                                <button key={slot} className="btn btn-outline-success btn-sm">
                                    {slot}
                                </button>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
