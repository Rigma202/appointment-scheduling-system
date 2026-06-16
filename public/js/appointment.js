$(document).ready(function () {

    $('#appointmentModal').on('shown.bs.modal', function () {

        $('.select2-dropdown').select2({
            width: '100%',
            placeholder: 'Select Option',
            allowClear: true,
            dropdownParent: $('#appointmentModal')
        });

    });

    $('#appointmentsTable').DataTable();

    $(document).on('submit', '#appointmentForm', function (e) {

        e.preventDefault();

        $('.text-danger').html('');
        $('.is-invalid').removeClass('is-invalid');

        let form = $(this);

        let formData = {

            doctor_id: $('#doctor_id').val(),

            patient_id: $('#patient_id').val(),

            appointment_date: $('#appointment_date').val(),

            appointment_time: $('#appointment_time').val(),

            duration: $('#duration').val(),

            _token: $('input[name="_token"]').val()
        };

        $.ajax({

            url: form.attr('action'),

            method: 'POST',

            data: formData,

            success: function (response) {

                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.message
                });

                $('#appointmentModal').modal('hide');

                setTimeout(function () {

                    location.reload();

                }, 1000);
            },

    error: function (xhr) {

        if (xhr.status === 422) {

            let errors = xhr.responseJSON.errors;

            $.each(errors, function (field, messages) {

                $('#' + field).addClass('is-invalid');

                $('.error-' + field)
                    .html(messages[0]);
            });

            return;
        }

        if (xhr.status === 409) {

            let response = xhr.responseJSON;

            if (response.type === 'doctor_conflict') {

                let bookingHtml = '';

                response.bookings.forEach(function (booking) {

                    bookingHtml += `
                        <tr>
                            <td>${booking.time}</td>
                            <td>${booking.duration}</td>
                        </tr>
                    `;
                });

                Swal.fire({
                    icon: 'warning',
                    title: 'Doctor Schedule Conflict',
                    html: `
                        <p>${response.message}</p>

                        <table class="table table-bordered mt-3">
                            <thead>
                                <tr>
                                    <th>Appointment Time</th>
                                    <th>Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${bookingHtml}
                            </tbody>
                        </table>
                    `,
                    width: 700
                });

                return;
            }

            Swal.fire({
                icon: 'warning',
                title: 'Conflict',
                text: response.message
            });

            return;
        }

        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Something went wrong.'
        });
    }
        });
    });

});
$(document).ready(function () {

    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    let year = tomorrow.getFullYear();
    let month = String(
        tomorrow.getMonth() + 1
    ).padStart(2, '0');

    let day = String(
        tomorrow.getDate()
    ).padStart(2, '0');

    let minDate = `${year}-${month}-${day}`;

    $('#appointment_date').attr(
        'min',
        minDate
    );

$('#appointmentModal').on('shown.bs.modal', function () {

    $('#appointmentForm')[0].reset();
    $('.text-danger').html('');
    $('.is-invalid').removeClass('is-invalid');
    $('#doctor_id').val(null).trigger('change');
    $('#patient_id').val(null).trigger('change');
    $('#duration').val(null).trigger('change');
    $('#appointment_date').val('');
    $('#appointment_time').val('');
});

});
$(document).on('click', '.deleteBtn', function () {

    let id = $(this).data('id');
    let status = $(this).data('status');

    let message =
        'Are you sure you want to delete this appointment?';

    if (status === 'scheduled') {
        message =
            'This appointment is currently scheduled. Do you want to delete it? This action cannot be undone.';
    }

    Swal.fire({
        title: 'Delete Appointment?',
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Delete',
        cancelButtonText: 'Cancel',
        reverseButtons: true
    }).then((result) => {

        if (!result.isConfirmed) {
            return;
        }

        $.ajax({

            url: '/appointments/' + id,

            type: 'DELETE',

            data: {
                _token: $('meta[name="csrf-token"]').attr('content')
            },

            success: function (response) {

                Swal.fire({
                    icon: 'success',
                    title: 'Deleted',
                    text: response.message
                }).then(() => {

                    location.reload();

                });

            },

            error: function () {

                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Unable to delete appointment.'
                });

            }

        });

    });

});
