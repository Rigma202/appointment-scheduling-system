<form id="doctorForm" method="POST" action="{{ route('doctors.store') }}">
    @csrf

    <div class="modal-body">
        <div class="mb-2">
            <label>Name</label>
            <input id="name" type="text" name="name" class="form-control">
            <small class="text-danger error-name"></small>
        </div>

        <div class="mb-2">
            <label>Department</label>
            <select id="department_id" name="department_id" class="form-control select2">
                <option value="">Select</option>
                @foreach($departments as $dept)
                <option value="{{ $dept->id }}">{{ $dept->name }}</option>
                @endforeach
            </select>
            <small class="text-danger error-department_id"></small>
        </div>

        <div class="mb-2">
            <label>Phone</label>
            <input id="phone" type="text" name="phone" class="form-control">
            <small class="text-danger error-phone"></small>
        </div>

        <div class="mb-2">
            <label>Email</label>
            <input id="email" type="email" name="email" class="form-control">
            <small class="text-danger error-email"></small>
        </div>

    </div>

    <div class="modal-footer">
        <button class="btn btn-primary">Save</button>
    </div>

</form>
