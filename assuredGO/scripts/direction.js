let map;
let directionsService;
let directionsRenderer;

// Initialize and add the map
function initMap() {
    // Default map center (can be adjusted)
    const defaultLocation = { lat: 37.7749, lng: -122.4194 }; // San Francisco
    
    // Create a new map centered on the default location
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: defaultLocation,
    });
    
    // Initialize Directions Service and Renderer
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
}

// Fetch directions from the backend and display them on the map
function fetchDirections() {
    const originLat = document.getElementById('originLat').value;
    const originLng = document.getElementById('originLng').value;
    const destinationLat = document.getElementById('destinationLat').value;
    const destinationLng = document.getElementById('destinationLng').value;
    
    // Fetch the route from the backend
    fetch(`http://localhost:5001/compute-routes?originLat=${originLat}&originLng=${originLng}&destinationLat=${destinationLat}&destinationLng=${destinationLng}`)
        .then(response => response.json())
        .then(data => {
            console.log('Received data:', data);
            if (data.routes && data.routes.length > 0) {
                const route = data.routes[0]; // Assume the first route is the desired one
                
                // Extract the route legs and waypoints (if any)
                const legs = route.legs.map(leg => ({
                    start_location: new google.maps.LatLng(leg.start_location.latitude, leg.start_location.longitude),
                    end_location: new google.maps.LatLng(leg.end_location.latitude, leg.end_location.longitude),
                    steps: leg.steps.map(step => ({
                        start_location: new google.maps.LatLng(step.start_location.latitude, step.start_location.longitude),
                        end_location: new google.maps.LatLng(step.end_location.latitude, step.end_location.longitude),
                        polyline: step.polyline.points
                    }))
                }));
                
                // Create a path from all steps
                const path = legs.flatMap(leg => 
                    leg.steps.flatMap(step => 
                        google.maps.geometry.encoding.decodePath(step.polyline)
                    )
                );
                
                // Create and set the polyline
                const routePolyline = new google.maps.Polyline({
                    path: path,
                    geodesic: true,
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                });
                
                // Clear previous routes
                directionsRenderer.setDirections({routes: []});
                
                // Set the new polyline on the map
                routePolyline.setMap(map);
                
                // Fit the map to the route bounds
                const bounds = new google.maps.LatLngBounds();
                path.forEach(point => bounds.extend(point));
                map.fitBounds(bounds);
                
                console.log('Route displayed on map');
            } else {
                console.error('No routes found');
            }
        })
        .catch(error => console.error('Error fetching directions:', error));
}

// Initialize the map when the window loads
window.onload = initMap;