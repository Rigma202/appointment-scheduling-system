$(document).ready(function () {

    $('#editAppointmentForm').submit(function (e) {

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

            _token: $('input[name="_token"]').val(),

            _method: 'PUT'
        };

        $.ajax({

            url: form.attr('action'),

            type: 'POST',

            data: formData,

            success: function (response) {

                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.message
                }).then(() => {

                    window.location.href =
                        '/appointments';
                });
            },

            error: function (xhr) {

                if (xhr.status === 422) {

                    let errors =
                        xhr.responseJSON.errors;

                    $.each(errors, function (field, messages) {

                        $('#' + field)
                            .addClass('is-invalid');

                        $('.error-' + field)
                            .html(messages[0]);
                    });

                    return;
                }

                if (xhr.status === 409) {

                    let response =
                        xhr.responseJSON;

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
