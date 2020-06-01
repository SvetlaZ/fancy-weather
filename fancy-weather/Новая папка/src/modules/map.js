function getMap(lat, lon) {
  mapboxgl.accessToken = 'pk.eyJ1Ijoic3ZldGxheiIsImEiOiJjazN5OHVkOG8wMjloM2dydTF6djc3cXFpIn0.6RG4Mu4nW3FO_IjkHX9j-g';
  const map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [lon, lat], // starting position
    zoom: 9, // starting zoom
  });

  // Add geolocate control to the map.
  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    }),
  );
  const marker = new mapboxgl.Marker()
    .setLngLat([lon, lat])
    .addTo(map);
}

export default getMap;
