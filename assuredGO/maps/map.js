// Initialize and add the map
function initMap() {
    // Default map center (You can set it to any default location)
    const defaultLocation = { lat: 30.7512, lng: 76.637 }; // Example: New York City
  
    // Create a new map centered on the default location
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: defaultLocation,
    });
  
    // Fetch accident-prone areas and place markers
    fetchAccidentProneAreas(map);
  }
  
  // Fetch accident-prone areas from the backend
  function fetchAccidentProneAreas(map) {
    fetch('http://localhost:5001/accident-prone-areas') // Assuming your backend is running at the same domain
      .then(response => response.json())
      .then(areas => {
        areas.forEach(area => {
          // Create a marker for each accident-prone area
          const marker = new google.maps.Marker({
            position: { lat: area.latitude, lng: area.longitude },
            map: map,
            title: area.name,
            icon:{ 
            url: 'accident-marker.png', // Your custom icon URL
            scaledSize: new google.maps.Size(60, 60), // Adjust the size
            }
          });
  
          // Add an info window to display details when the marker is clicked
          const infoWindow = new google.maps.InfoWindow({
            content: `<h3>${area.name}</h3><p>${area.description || 'Accident Prone Area'}</p><p>Severity: ${area.severityLevel}</p>`,
          });
  
          // Show the info window on marker click
          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
        });
      })
      .catch(error => console.error('Error fetching accident-prone areas:', error));
  }
  
  // Initialize the map when the window loads
  window.onload = initMap;
  