@extends('layouts.app')

@section('content')

<div class="container">

    <div class="d-flex justify-content-end mb-2">
        <button class="btn btn-warning"
                data-bs-toggle="modal"
                data-bs-target="#appointmentModal">
            Create Appointment
        </button>
    </div>

    <table id="appointmentsTable"
           class="table table-bordered">
        <thead>
            <tr>
                <th>ID</th>
                <th>Doctor</th>
                <th>Patient</th>
                <th>Department</th>
                <th>Date Time</th>
                <th>Duration</th>
                <th>Status</th>
                <th width="180">Action</th>
            </tr>
        </thead>

        <tbody>

        @foreach($appointments as $appointment)

            <tr>

                <td>{{ $appointment->id }}</td>

                <td>{{ $appointment->doctor->name }}</td>

                <td>{{ $appointment->patient->name }}</td>

                <td>{{ $appointment->doctor->department->name }}</td>

                <td>{{ $appointment->appointment_time }}</td>

                <td>{{ $appointment->duration }}</td>

                <td>{{ ucfirst($appointment->status) }}</td>

                <td>

                    <a href="{{ route('appointments.show',$appointment->id) }}"
                       class="btn btn-info btn-sm">
                        View
                    </a>

                    <a href="{{ route('appointments.edit',$appointment->id) }}"
                       class="btn btn-warning btn-sm">
                        Edit
                    </a>

                    <button
                        class="btn btn-danger btn-sm deleteBtn"
                        data-id="{{ $appointment->id }}"
                        data-status="{{ $appointment->status }}">
                        Delete
                    </button>

                </td>

            </tr>

        @endforeach

        </tbody>

    </table>

</div>
<div class="modal fade" id="appointmentModal">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title">
                    Create Appointment
                </h5>

                <button type="button"
                        class="btn-close"
                        data-bs-dismiss="modal">
                </button>
            </div>

            <div class="modal-body">
                @include('appointment.partials.createform')
            </div>

        </div>
    </div>
</div>
@endsection
@push('scripts')
<script src="{{ asset('js/appointment.js') }}"></script>
@endpush('scripts')
