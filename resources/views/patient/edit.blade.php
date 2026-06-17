@extends('layouts.app')

@section('content')

@php
    $reactProps = [
        'mode' => 'edit',
        'action' => route('patients.update', $patient->id),
        'redirectTo' => route('patients.index'),
        'patient' => [
            'name' => $patient->name,
            'phone' => $patient->phone,
            'email' => $patient->email,
        ],
    ];
@endphp

<div class="container">
    <h3>Edit Patient</h3>
    <div data-react="patient-form" data-props="{{ json_encode($reactProps) }}"></div>
    <a href="{{ route('patients.index') }}" class="btn btn-secondary mt-3">Back</a>
</div>

@endsection
