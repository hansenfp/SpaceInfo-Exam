const allLaunchesURL = 'https://api.spacexdata.com/v2/launches/all';

const getLaunchData = async (url) => {
  let response = await fetch(url);

  if(!response.ok) {
    throw Error(`Error fetching API, response status:  ${response.statusText}`);
  }

  let data = await response.json();
  data = data.slice(-10);
  displayData(data);
}

getLaunchData(allLaunchesURL);


function displayData(data) {
  const results = document.querySelector('.results');
  data.map(launch => {
    results.innerHTML += `
      <tr>
        <td>${launch.flight_number}</td>
        <td>${formatDate(launch.launch_date_utc)}</td>
        <td>${launch.rocket.rocket_name}</td>
        <td>${checkPastOrFuture(launch.launch_date_utc)}
          ${checkPastOrFuture(launch.launch_date_utc) === 'Launched' ? ' - ' + launchSuccess(launch) : ''}
        </td>
        <td>
          <button></button>
        </td>
      </tr>
    `
  })
}

function checkPastOrFuture(date) {
  let currentDate = new Date();
  let dateToCheck = new Date(date);
  return currentDate < dateToCheck ? 'Upcoming' : 'Launched';
}

function launchSuccess(flight) {
  return flight.launch_success ? '🚀Successful' : '💥Failure';
} 

function formatDate(date) {
  const d = new Date(date);
  return d.toUTCString();
}

const flightURL = 'https://api.spacexdata.com/v2/launches?flight_number=';

const rocketURL = 'https://api.spacexdata.com/v2/rockets/';

async function getFlightDetails(ele) {

  let response = await fetch(`${flightURL}${ele.id}`);

  if(!response.ok) {
    throw Error(`Error fetching flight details, response status: ${response.statusText}`);
  }

  let data = await response.json();
  displayFlightData(data[0]);

  let rocketResponse = await fetch(`${rocketURL}${ele.dataset.rocket}`);

  if(!response.ok) {
    throw Error(`Error fetching rocket details, response status: ${response.statusText}`);
  }

  let rocketData = await rocketResponse.json();
  displayRocketInfo(rocketData);
}

function displayFlightData(flight) {
  const flightDiv = document.querySelector('.flightDetails');
  if(!flight) {
    flightDiv.innerHTML = `
    <h4>Flight details</h4>  
    <p>Sorry, this flight has no further details</p>
    `;
    return;
  }

  flightDiv.innerHTML = `
    <h4>Flight details</h4>
    <p>${flight.details}</p>
    <p><strong>Launch site:</strong> ${flight.launch_site.site_name_long}</p>
    <figure>
      <img src="${flight.links.mission_patch}" alt="Flight ${flight.flight_number} Mission Patch" title="Flight ${flight.flight_number} Mission Patch">
      <figcaption>Flight ${flight.flight_number} Mission Patch</figcaption>
    </figure>
    <br>
  `
}

function displayRocketInfo(rocket) {
  const rocketDiv = document.querySelector('.rocketInfo');
  if(!rocketDiv) {
    rocketDiv.innerHTML = `
      <h4>Rocket Details</h4>
      <p>Sorry, this flight has no further details</p>
    `
    ;
    return;
  }
  rocketDiv.innerHTML = `
    <h4>Rocket Details</h4>
    <p><strong>Name:</strong> ${rocket.name}, <strong>ID:</strong> ${rocket.id}</p>
    <p><strong>Description:</strong> ${rocket.description}</p>
    <p><strong>Height:</strong> ${rocket.height.meters} metres</p>
    <p><strong>Mass:</strong> ${rocket.mass.kg} kg</p>
    <p><strong>Number of stages:</strong> ${rocket.stages}</p>

  `
}