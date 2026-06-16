<div class="modal fade" id="createPatient" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">

            <form id="patientForm" method="POST" action="{{ route('patients.store') }}">
                @csrf

                <div class="modal-header">
                    <h5 class="modal-title">Create Patient</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">

                    <div class="mb-2">
                        <label>Name</label>
                        <input type="text" name="name" class="form-control" required>
                    </div>

                    <div class="mb-2">
                        <label>Phone</label>
                        <input type="text" name="phone" class="form-control" required>
                    </div>

                    <div class="mb-2">
                        <label>Email</label>
                        <input type="email" name="email" class="form-control" required>
                    </div>

                </div>

                <div class="modal-footer">
                    <button type="submit" class="btn btn-success">
                        Save
                    </button>
                </div>

            </form>

        </div>
    </div>
</div>
