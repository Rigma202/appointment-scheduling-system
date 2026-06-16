@extends('layouts.app')

@section('content')

<div class="container mt-4">

    <div class="card">
        <div class="card-header">
            <h4>Check Doctor Availability</h4>
        </div>

        <div class="card-body">

            <div class="row g-3">

                {{-- Doctor --}}
                <div class="col-md-6">
                    <label class="form-label">Select Doctor</label>

                    <select id="doctor_id" class="form-select select2">
                        <option value="">Select Doctor</option>
                        @foreach($doctors as $doctor)
                            <option value="{{ $doctor->id }}">
                                {{ $doctor->name }} ({{ $doctor->department->name ?? '' }})
                            </option>
                        @endforeach
                    </select>
                </div>


                <div class="col-md-6">
                    <label class="form-label">Select Date</label>

                    <input type="date"
                           id="date"
                           class="form-control"
                           min="{{ date('Y-m-d') }}">
                </div>


                <div class="col-12">
                    <button id="checkSlots"
                            class="btn btn-primary">
                        Check Available Slots
                    </button>
                </div>

            </div>

            <hr>

            <h5>Available Slots</h5>

            <div id="slotsContainer"
                 class="d-flex flex-wrap gap-2 mt-3">

                <span class="text-muted">
                    Select doctor and date
                </span>

            </div>

        </div>
    </div>

</div>

@endsection
@push('scripts')
<script src="{{ asset('js/availability.js') }}"></script>
@endpush
