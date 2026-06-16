<div class="appointment-form-card">

    <form id="appointmentForm"
        action="{{ route('appointments.store') }}"
        method="POST">

        @csrf

        <div class="row g-3">

            <div class="col-md-6">
                <label class="form-label">Doctor</label>

                <select name="doctor_id" id="doctor_id"
                        class="form-select select2-dropdown">
                    <option value="">Select Doctor</option>

                    @foreach($doctors as $doctor)
                        <option value="{{ $doctor->id }}"
                            {{ old('doctor_id', $appointment->doctor_id ?? '') == $doctor->id ? 'selected' : '' }}>
                            {{ $doctor->name }}
                        </option>
                    @endforeach
                </select>

                <span class="text-danger error-doctor_id"></span>
            </div>


            <div class="col-md-6">
                <label class="form-label">Patient</label>

                <select id="patient_id" name="patient_id"
                        class="form-select select2-dropdown">
                    <option value="">Select Patient</option>

                    @foreach($patients as $patient)
                        <option value="{{ $patient->id }}"
                            {{ old('patient_id', $appointment->patient_id ?? '') == $patient->id ? 'selected' : '' }}>
                            {{ $patient->name }}
                        </option>
                    @endforeach
                </select>

                <span class="text-danger error-patient_id"></span>
            </div>

            <div class="col-md-6">
                <label class="form-label">Appointment Date</label>

                <input id="appointment_date" type="date"
                    name="appointment_date"
                    id="appointment_date"
                    class="form-control"
                    value="{{ old('appointment_date', isset($appointment) ? \Carbon\Carbon::parse($appointment->appointment_time)->format('Y-m-d') : '') }}">

                <span class="text-danger error-appointment_date"></span>
            </div>

            <div class="col-md-6">
                <label class="form-label">Appointment Time</label>

                <input id="appointment_time" type="time"
                    name="appointment_time"
                    id="appointment_time"
                    class="form-control"
                    value="{{ old('appointment_time', isset($appointment) ? \Carbon\Carbon::parse($appointment->appointment_time)->format('H:i') : '') }}">

                <span class="text-danger error-appointment_time"></span>
            </div>

            <div class="col-md-6">
                <label class="form-label">Duration (Minutes)</label>

                <select id="duration" name="duration"
                        class="form-select select2-dropdown">
                    <option value="">Select Duration</option>

                    @foreach([15,30,45,60] as $duration)
                        <option value="{{ $duration }}"
                            @selected(old('duration', $appointment->duration ?? '') == $duration)>
                            {{ $duration }} Minutes
                        </option>
                    @endforeach
                </select>

                <span class="text-danger error-duration"></span>
            </div>

            <div class="col-12 text-end mt-3">
                <button type="submit"
                        class="btn appointment-save-btn">
                    Save Appointment
                </button>
            </div>

        </div>

    </form>

</div>
