@extends('layouts.app')

@section('content')

<div class="container">

<div class="card">
    <div class="card-header">
        <h4>Edit Doctor</h4>
    </div>

    <div class="card-body">

        <form id="doctorEditForm"
              method="POST"
              action="{{ route('doctors.update', $doctor->id) }}">

            @csrf
            @method('PUT')

            <div class="mb-2">
                <label>Name</label>
                <input
                    id="name"
                    type="text"
                    name="name"
                    class="form-control"
                    value="{{ $doctor->name }}">

                <small class="text-danger error-name"></small>
            </div>

            <div class="mb-3">
                <label>Department</label>

                <select
                    id="department_id"
                    name="department_id"
                    class="form-control select2">

                    <option value="">Select</option>

                    @foreach($departments as $dept)
                        <option value="{{ $dept->id }}"
                            {{ $doctor->department_id == $dept->id ? 'selected' : '' }}>
                            {{ $dept->name }}
                        </option>
                    @endforeach

                </select>

                <small class="text-danger error-department_id"></small>
            </div>

            <div class="mb-3">
                <label>Phone</label>

                <input
                    id="phone"
                    type="text"
                    name="phone"
                    class="form-control"
                    value="{{ $doctor->phone }}">

                <small class="text-danger error-phone"></small>
            </div>

            <div class="mb-3">
                <label>Email</label>

                <input
                    id="email"
                    type="email"
                    name="email"
                    class="form-control"
                    value="{{ $doctor->email }}">

                <small class="text-danger error-email"></small>
            </div>

            <div class="text-end">
                <a href="{{ route('doctors.index') }}"
                   class="btn btn-secondary">
                    Back
                </a>

                <button type="submit"
                        class="btn btn-primary">
                    Update
                </button>
            </div>

        </form>

    </div>
</div>


</div>
@endsection
@push('scripts')
<script src="{{ asset('js/doctor-edit.js') }}"></script>
@endpush

