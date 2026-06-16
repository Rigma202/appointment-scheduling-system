@extends('layouts.app')

@section('content')

<div class="container">

    <div class="card">

        <div class="card-header">
            <h4>Edit Appointment</h4>
        </div>

        <div class="card-body">

            <form id="editAppointmentForm"
                  action="{{ route('appointments.update',$appointment->id) }}"
                  method="POST">

                @csrf
                @method('PUT')

                <div class="row g-3">

                    <div class="col-md-6">

                        <label class="form-label">
                            Doctor
                        </label>

                        <select name="doctor_id"
                                id="doctor_id"
                                class="form-select select2">

                            @foreach($doctors as $doctor)

                                <option value="{{ $doctor->id }}"
                                    @selected($appointment->doctor_id == $doctor->id)>
                                    {{ $doctor->name }}
                                </option>

                            @endforeach

                        </select>

                        <span class="text-danger error-doctor_id"></span>

                    </div>

                    <div class="col-md-6">

                        <label class="form-label">
                            Patient
                        </label>

                        <select name="patient_id"
                                id="patient_id"
                                class="form-select select2">

                            @foreach($patients as $patient)

                                <option value="{{ $patient->id }}"
                                    @selected($appointment->patient_id == $patient->id)>
                                    {{ $patient->name }}
                                </option>

                            @endforeach

                        </select>

                        <span class="text-danger error-patient_id"></span>

                    </div>

                    <div class="col-md-6">

                        <label class="form-label">
                            Appointment Date
                        </label>

                        <input type="date"
                               id="appointment_date"
                               name="appointment_date"
                               class="form-control"
                               value="{{ \Carbon\Carbon::parse($appointment->appointment_time)->format('Y-m-d') }}">

                        <span class="text-danger error-appointment_date"></span>

                    </div>

                    <div class="col-md-6">

                        <label class="form-label">
                            Appointment Time
                        </label>

                        <input type="time"
                               id="appointment_time"
                               name="appointment_time"
                               class="form-control"
                               value="{{ \Carbon\Carbon::parse($appointment->appointment_time)->format('H:i') }}">

                        <span class="text-danger error-appointment_time"></span>

                    </div>

                    <div class="col-md-6">

                        <label class="form-label">
                            Duration
                        </label>

                        <select id="duration"
                                name="duration"
                                class="form-select select2">

                            @foreach([15,30,45,60] as $duration)

                                <option value="{{ $duration }}"
                                    @selected($appointment->duration == $duration)>
                                    {{ $duration }} Minutes
                                </option>

                            @endforeach

                        </select>

                        <span class="text-danger error-duration"></span>

                    </div>

                    <div class="col-12">

                        <button type="submit"
                                class="btn btn-primary">
                            Update Appointment
                        </button>

                        <a href="{{ route('appointments.index') }}"
                           class="btn btn-secondary">
                            Back
                        </a>

                    </div>

                </div>

            </form>

        </div>

    </div>

</div>

@endsection

@push('scripts')
<script>
    $(document).ready(function () {

        $('.select2').select2({
            width: '100%'
        });

    });
</script>

<script src="{{ asset('js/appointment-edit.js') }}"></script>
@endpush
