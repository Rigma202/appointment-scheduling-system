@extends('layouts.app')

@section('content')

@php
    $appointmentRows = collect($appointments)->map(fn ($a) => [
        'id' => $a->id,
        'doctor_name' => $a->doctor->name ?? '',
        'patient_name' => $a->patient->name ?? '',
        'department' => $a->doctor->department->name ?? '',
        'datetime' => \Carbon\Carbon::parse($a->appointment_time)->format('d-m-Y g:i A'),
        'duration' => $a->duration,
        'status' => $a->status,
    ])->values();

    $reactProps = [
        'appointments' => $appointmentRows,
        'doctors' => collect($doctors)->map(fn ($d) => ['id' => $d->id, 'name' => $d->name])->values(),
        'patients' => collect($patients)->map(fn ($p) => ['id' => $p->id, 'name' => $p->name])->values(),
        'storeAction' => route('appointments.store'),
        'baseUrl' => url('appointments'),
    ];
@endphp

<div data-react="appointments" data-props="{{ json_encode($reactProps) }}"></div>

@endsection
