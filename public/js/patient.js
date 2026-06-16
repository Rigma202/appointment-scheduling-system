let patientTable;

$(document).ready(function () {


    patientTable = $('#patientsTable').DataTable();

    $('#patientForm').on('submit', function (e) {
        e.preventDefault();

        $.ajax({
            url: "/patients",
            type: "POST",
            data: $(this).serialize(),
            success: function (res) {

                Swal.fire('Success', res.message, 'success');

                $('#createPatient').modal('hide');

                location.reload();
            },
            error: function () {
                Swal.fire('Error', 'Validation failed', 'error');
            }
        });
    });


    $(document).on('click', '.deletePatient', function () {

        let id = $(this).data('id');

        Swal.fire({
            title: "Delete patient?",
            text: "All related appointments will also be deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes"
        }).then((result) => {

            if (result.isConfirmed) {

                $.ajax({
                    url: "/patients/" + id,
                    type: "DELETE",
                    data: {
                        _token: $('meta[name="csrf-token"]').attr('content')
                    },
                    success: function (res) {
                        Swal.fire('Deleted', res.message, 'success');
                        $('#row-' + id).remove();
                    }
                });

            }
        });

    });

});
