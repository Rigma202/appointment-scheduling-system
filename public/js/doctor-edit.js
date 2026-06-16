$(document).ready(function () {

    $('.select2').select2({
        width: '100%'
    });

    $('#doctorEditForm').submit(function(e){

        e.preventDefault();

        $('.text-danger').text('');
        $('.form-control').removeClass('is-invalid');

        $.ajax({
            url: $(this).attr('action'),
            type: 'POST',
            data: $(this).serialize(),

            success: function(response){

                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.message
                }).then(() => {
                    window.location.href = "{{ route('doctors.index') }}";
                });

            },

            error: function(xhr){

                if(xhr.status === 422){

                    $.each(xhr.responseJSON.errors, function(field, messages){

                        $('#' + field).addClass('is-invalid');
                        $('.error-' + field).text(messages[0]);

                    });

                }else{

                    Swal.fire(
                        'Error',
                        'Something went wrong',
                        'error'
                    );

                }
            }
        });

    });

});

