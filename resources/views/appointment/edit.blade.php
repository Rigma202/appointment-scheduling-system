@extends('layouts.app')

@section('content')

@php
    $reactProps = [
        'mode' => 'edit',
        'action' => route('appointments.update', $appointment->id),
        'redirectTo' => route('appointments.index'),
        'doctors' => collect($doctors)->map(fn ($d) => ['id' => $d->id, 'name' => $d->name])->values(),
        'patients' => collect($patients)->map(fn ($p) => ['id' => $p->id, 'name' => $p->name])->values(),
        'appointment' => [
            'doctor_id' => $appointment->doctor_id,
            'patient_id' => $appointment->patient_id,
            'appointment_date' => \Carbon\Carbon::parse($appointment->appointment_time)->format('Y-m-d'),
            'appointment_time' => \Carbon\Carbon::parse($appointment->appointment_time)->format('H:i'),
            'duration' => $appointment->duration,
        ],
    ];
@endphp

<div class="container">
    <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
            <h4 class="mb-0">Edit Appointment</h4>
            <a href="{{ route('appointments.index') }}" class="btn btn-secondary btn-sm">Back</a>
        </div>
        <div class="card-body">
            <div data-react="appointment-form" data-props="{{ json_encode($reactProps) }}"></div>
        </div>
    </div>
</div>

@endsection
