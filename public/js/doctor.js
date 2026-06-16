let doctorTable;

$(document).ready(function () {
    $('#createDoctor').on('shown.bs.modal', function () {
        $('.select2').select2({
            dropdownParent: $('#createDoctor'),
            width: '100%'
        });
    });
    doctorTable = $('#doctorsTable').DataTable();
    $(document).on('click', '.deleteDoctor', function () {

        let id = $(this).data('id');

        Swal.fire({
            title: "Are you sure?",
            text: "Doctor and all related appointments will be deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {

            if (result.isConfirmed) {

                $.ajax({
                    url: "/doctors/" + id,
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

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $('#doctorForm').on('submit', function (e) {

        e.preventDefault();
        $('.text-danger').text('');
        $('.form-control').removeClass('is-invalid');

        let formData = {
            name: $('#name').val(),
            department_id: $('#department_id').val(),
            phone: $('#phone').val(),
            email: $('#email').val()
        };

        $.ajax({
            url: $(this).attr('action'),
            type: 'POST',
            data: formData,

            success: function (response) {

                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.message ?? 'Doctor created successfully'
                }).then(() => {

                    window.location.href =
                        '/doctors';
                });

                $('#doctorForm')[0].reset();
                $('#department_id').val(null).trigger('change');
                $('#createDoctor').modal('hide');
            },

            error: function (xhr) {

                if (xhr.status === 422) {

                    let errors = xhr.responseJSON.errors;

                    $.each(errors, function (field, messages) {

                        $('#' + field).addClass('is-invalid');

                        $('.error-' + field).text(messages[0]);

                    });

                } else {

                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Something went wrong'
                    });

                }
            }
        });

    });

});
