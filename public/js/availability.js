
$(document).ready(function () {

    $('#checkSlots').on('click', function () {

        let doctorId = $('#doctor_id').val();
        let date = $('#date').val();

        if (!doctorId) {
            alert('Please select doctor');
            return;
        }

        if (!date) {
            alert('Please select date');
            return;
        }

        $('#slotsContainer').html('Loading slots...');

        $.ajax({
            url: `/api/doctors/${doctorId}/available-slots`,
            type: 'GET',
            data: {
                date: date
            },
            success: function (response) {

                if (!response.success) {
                    $('#slotsContainer').html(
                        '<span class="text-danger">No slots found</span>'
                    );
                    return;
                }

                let html = '';

                if (response.data.length === 0) {
                    html = '<span class="text-danger">No available slots</span>';
                } else {

                    response.data.forEach(function (slot) {
                        html += `
                            <button class="btn btn-outline-success btn-sm">
                                ${slot}
                            </button>
                        `;
                    });
                }

                $('#slotsContainer').html(html);
            },

            error: function () {
                $('#slotsContainer').html(
                    '<span class="text-danger">Something went wrong</span>'
                );
            }
        });

    });

    $('#doctor_id').select2({
        placeholder: 'Select Doctor',
        allowClear: true,
        width: '100%'
    });



});

