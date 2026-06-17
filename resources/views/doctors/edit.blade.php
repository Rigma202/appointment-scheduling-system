@extends('layouts.app')

@section('content')

@php
    $reactProps = [
        'mode' => 'edit',
        'action' => route('doctors.update', $doctor->id),
        'redirectTo' => route('doctors.index'),
        'departments' => collect($departments)->map(fn ($d) => ['id' => $d->id, 'name' => $d->name])->values(),
        'doctor' => [
            'name' => $doctor->name,
            'department_id' => $doctor->department_id,
            'phone' => $doctor->phone,
            'email' => $doctor->email,
        ],
    ];
@endphp

<div class="container">
    <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
            <h4 class="mb-0">Edit Doctor</h4>
            <a href="{{ route('doctors.index') }}" class="btn btn-secondary btn-sm">Back</a>
        </div>
        <div class="card-body">
            <div data-react="doctor-form" data-props="{{ json_encode($reactProps) }}"></div>
        </div>
    </div>
</div>

@endsection
