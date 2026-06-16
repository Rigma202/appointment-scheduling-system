@extends('layouts.app')

@section('content')

<div class="card">

    <div class="card-body">

        <h4>Appointment #{{ $appointment->id }}</h4>

        <p>Doctor : {{ $appointment->doctor->name }}</p>

        <p>Patient : {{ $appointment->patient->name }}</p>

        <p>Status : {{ $appointment->status }}</p>

        <p>Date : {{ $appointment->appointment_time }}</p>

    </div>

</div>

@endsection
