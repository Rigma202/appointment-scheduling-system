@extends('layouts.app')

@section('content')
<div class="container">

    <h3>Patients</h3>
    <div class="d-flex justify-content-end mb-3">
        <button class="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#createPatient">
            + Create Patient
        </button>
    </div>
    <table class="table table-bordered" id="patientsTable">
        <thead>
            <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Action</th>
            </tr>
        </thead>

        <tbody>
            @foreach($patients as $patient)
            <tr>
                <td>{{ $patient->name }}</td>
                <td>{{ $patient->phone }}</td>
                <td>{{ $patient->email }}</td>
                <td>
                    <a href="{{ route('patients.edit', $patient->id) }}" class="btn btn-warning btn-sm">Edit</a>

                    <form method="POST" action="{{ route('patients.destroy', $patient->id) }}" style="display:inline;">
                        @csrf @method('DELETE')
                        <button class="btn btn-danger btn-sm">Delete</button>
                    </form>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

</div>
@include('patient.partials.create')
@endsection
@push('scripts')

<script src="{{ asset('js/patient.js') }}"></script>
@endpush
