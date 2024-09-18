document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('fir-form');
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const firData = {
            complainantName: document.getElementById('complainant-name').value,
            complainantPhone: document.getElementById('complainant-phone').value,
            incidentLocation: document.getElementById('incident-location').value,
            incidentDate: document.getElementById('incident-date').value,
            incidentTime: document.getElementById('incident-time').value,
            incidentType: document.getElementById('incident-type').value,
            incidentDescription: document.getElementById('incident-description').value,
            witnesses: document.getElementById('witnesses').value
        };


        simulateSubmission(firData);
    });

    function simulateSubmission(data) {

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

        setTimeout(() => {

            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Submit FIR';

            const firNumber = generateFIRNumber();


            document.getElementById('fir-number').textContent = firNumber;
            successModal.show();

            const firForDashboard = {
                id: firNumber,
                status: 'New',
                type: data.incidentType,
                date: data.incidentDate
            };
            localStorage.setItem('latestFIR', JSON.stringify(firForDashboard));

            form.reset();
        }, 2000);
    }

    function generateFIRNumber() {

        return 'FIR' + Math.floor(100000 + Math.random() * 900000);
    }

    document.getElementById('goto-dashboard').addEventListener('click', function() {
        window.location.href = 'police.html'; 
    });
});