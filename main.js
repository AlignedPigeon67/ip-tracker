const ipInputForm = document.querySelector('[data-ip-submit-form]');
const ipInputElement = document.querySelector('[data-ip-submit-input');

let defaultPos = [51.505, -0.09];

const api = {
  base: 'https://geo.ipify.org/api/v1',
  key: 'at_MNhCpJqYqt5IvXtASlsh2COfqyrBp',
};

let mymap = L.map('mapid', { zoomControl: false }).setView(defaultPos, 13);

L.tileLayer(
  'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      'pk.eyJ1IjoiYWxpZ25lZHBpZ2VvbjY3IiwiYSI6ImNrcWMwdmthZDAwNGsydnBhMndueWV5ZGcifQ.sa-3aL9uYsqMmMfvekr9Lw',
  }
).addTo(mymap);

let icon = L.icon({
  iconUrl: './images/icon-location.svg',
  iconSize: [46, 56],
  iconAnchor: [23, 55],
});

let marker = L.marker(defaultPos, { icon }).addTo(mymap);

const relocate = (pos, zoom = 13) => {
  mymap.panTo(pos);
  mymap.setView(pos, zoom);
  marker.setLatLng(pos);
};

const populateInfo = ipData => {
  const infoIp = document.querySelector('[data-info-ip]');
  const infoLocation = document.querySelector('[data-info-location]');
  const infoTimezone = document.querySelector('[data-info-timezone]');
  const infoIsp = document.querySelector('[data-info-isp]');

  const loc = ipData.location;

  infoIp.innerText = ipData.ip;
  infoLocation.innerText = `${loc.city}, ${loc.region} ${loc.postalCode}`;
  infoTimezone.innerText = `UTC ${loc.timezone}`;
  infoIsp.innerText = ipData.isp;
};

const fetchIpLocation = async (query = '') => {
  try {
    const res = await fetch(`${api.base}?apiKey=${api.key}&ipAddress=${query}`);
    const data = await res.json();
    relocate([data.location.lat, data.location.lng]);
    populateInfo(data);
  } catch (err) {
    console.error(err);
  }

  try {
    const res = await fetch(`${api.base}?apiKey=${api.key}&domain=${query}`);
    const data = await res.json();
    relocate([data.location.lat, data.location.lng]);
    populateInfo(data);
  } catch (err) {
    console.error(err);
  }
};

ipInputForm.addEventListener('submit', e => {
  e.preventDefault();
  fetchIpLocation(ipInputElement.value);
  ipInputElement.value = '';
});

fetchIpLocation();
