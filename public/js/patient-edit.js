$(document).ready(function () {

    $('#patientEditForm').on('submit', function (e) {
        e.preventDefault();

        let id = $(this).data('id');

        $.ajax({
            url: "/patients/" + id,
            type: "POST",
            data: $(this).serialize(),

            success: function (res) {

                Swal.fire({
                    icon: 'success',
                    title: 'Updated',
                    text: res.message ?? 'Patient updated successfully'
                }).then(() => {
                    window.location.href = "/patients";
                });

            },

            error: function (xhr) {

                let msg = "Something went wrong";

                if (xhr.responseJSON?.errors) {
                    msg = Object.values(xhr.responseJSON.errors).flat().join("\n");
                }

                Swal.fire('Error', msg, 'error');
            }
        });

    });

});
