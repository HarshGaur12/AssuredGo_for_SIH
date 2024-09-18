        document.addEventListener('DOMContentLoaded', function() {
            var map = L.map('map', {
                scrollWheelZoom: false,
                touchZoom: true
            }).setView([30.7688, 76.5754], 13);
        
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);
        
            function updateMap(lat, lon) {
                map.setView([lat, lon], 13);
                L.marker([lat, lon]).addTo(map)
                    .bindPopup('Current Location')
                    .openPopup();
            }
        
            async function fetchLocation() {
                try {
                    let response = await fetch('/location');
                    let data = await response.json();
                    updateMap(data.lat, data.lon);
                } catch (error) {
                    console.error('Error fetching location:', error);
                }
            }
        
            setInterval(fetchLocation, 10000);
        
            map.touchZoom.enable();
            map.scrollWheelZoom.disable();
        });
        

        

        function populateCaseStatusTable() {
            const tbody = document.getElementById('case-status-tbody');
            
            // Clear any existing rows
            tbody.innerHTML = '';
        
            // Fetch data from Firebase API
            fetch('https://sih2024-ac37a-default-rtdb.firebaseio.com/.json')
                .then(response => response.json())
                .then(data => {
                    const cases = [];
        
                    // Process the users and create case objects
                    if (data && data.users) {
                        const users = data.users;
        
                        // Loop through the users and prepare the cases array
                        for (const userId in users) {
                            if (users.hasOwnProperty(userId)) {
                                const userDetails = users[userId].details;
                                const fullName = userDetails.fullname || 'Unknown';
                                const firstTimeStatus = userDetails.firsttime === '0' ? 'Under Investigation' : 'Closed';
        
                                cases.push({
                                    userId, // Store the userId for generating the link
                                    fullname: fullName,
                                    status: firstTimeStatus
                                });
                            }
                        }
                    }
        
                    // Populate the table
                    cases.forEach(caseData => {
                        const row = document.createElement('tr');
                        
                        // Create table cells
                        const fullnameCell = document.createElement('td');
                        const statusCell = document.createElement('td');
                        const actionsCell = document.createElement('td');
        
                        // Set cell contents
                        fullnameCell.textContent = caseData.fullname;
                        statusCell.textContent = caseData.status;
                        
                        // Create link to the details page, using the userId for the dynamic URL
                        const detailsLink = `hospital_view.html?id=${caseData.userId}`;
                        actionsCell.innerHTML = `<a href="${detailsLink}"><button class="btn btn-info btn-sm">Details</button></a>`;
        
                        // Append cells to the row
                        row.appendChild(fullnameCell);
                        row.appendChild(statusCell);
                        row.appendChild(actionsCell);
        
                        // Append row to the table body
                        tbody.appendChild(row);
                    });
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
        
        
document.addEventListener('DOMContentLoaded', function() {
    populateCaseStatusTable();
    // ... (other initialization code)
});