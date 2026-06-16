@extends('layouts.app')

@section('content')
<div class="container">

    <h3>Edit Patient</h3>

    <form id="patientEditForm"
          data-id="{{ $patient->id }}">

        @csrf
        @method('PUT')

        <div class="mb-2">
            <label>Name</label>
            <input type="text"
                   name="name"
                   class="form-control"
                   value="{{ $patient->name }}"
                   required>
        </div>

        <div class="mb-2">
            <label>Phone</label>
            <input type="text"
                   name="phone"
                   class="form-control"
                   value="{{ $patient->phone }}"
                   required>
        </div>

        <div class="mb-2">
            <label>Email</label>
            <input type="email"
                   name="email"
                   class="form-control"
                   value="{{ $patient->email }}"
                   required>
        </div>

        <button type="submit" class="btn btn-primary">
            Update Patient
        </button>

        <a href="{{ route('patients.index') }}" class="btn btn-secondary">
            Back
        </a>

    </form>

</div>
@endsection

@push('scripts')
<script src="{{ asset('js/patient-edit.js') }}"></script>
@endpush
