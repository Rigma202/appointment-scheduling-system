@extends('layouts.app')

@section('content')
<div class="container">

    <h3>Doctors</h3>
<div class="d-flex justify-content-end mb-2">
    <button class="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#createDoctor">
        Add Doctor
    </button>
</div>


    <table class="table table-bordered" id="doctorsTable">
        <thead>
            <tr>
                <th>Sl no.</th>
                <th>Name</th>
                <th>Department</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Action</th>
            </tr>
        </thead>

        <tbody>
            @foreach($doctors as $doctor)
            <tr>
                <td>{{ $doctor->id}}</td>
                <td>{{ $doctor->name }}</td>
                <td>{{ $doctor->department->name }}</td>
                <td>{{ $doctor->phone }}</td>
                <td>{{ $doctor->email }}</td>
                <td>
                    <a href="{{ route('doctors.edit', $doctor->id) }}" class="btn btn-warning btn-sm">Edit</a>

                    <form method="POST" action="{{ route('doctors.destroy', $doctor->id) }}" style="display:inline;">
                        @csrf @method('DELETE')
                        <button class="btn btn-danger btn-sm">Delete</button>
                    </form>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

</div>
<div class="modal fade" id="createDoctor">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title">
                    Create Doctor
                </h5>

                <button type="button"
                        class="btn-close"
                        data-bs-dismiss="modal">
                </button>
            </div>

            <div class="modal-body">
                 @include('doctors.partials.create', ['departments' => $departments])
            </div>

        </div>
    </div>
</div>
@endsection
@push('scripts')

<script src="{{ asset('js/doctor.js') }}"></script>
@endpush
