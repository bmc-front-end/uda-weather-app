/* Gobal variables */

// Personal API Key for OpenWeatherMap API use
const API_KEY = "b2b37670103f0597a30b93e57096f7f1&units=metric";
const API_BASE_URL = `https://api.openweathermap.org/data/2.5/weather?`;
let API_url = "";
let API_urlParams = "";
let zipCode = 0;
let countryCode = "BE";

// Create a new date reference
let d = new Date();
let newDate = d.getMonth() + 1 + "." + d.getDate() + "." + d.getFullYear();

/* Callback functions */
function updateWeaterApp(e) {
  e.preventDefault();

  // Create variables with user input
  userZipcode = document.getElementById("zip").value;
  const userFeelings = document.getElementById("feelings").value;

  if (userZipcode.length == 0 || isNaN(userZipcode)) {
    alert("enter a valid zipcode number first");
    document.getElementById("zip").select();
    return false;
  }

  // Create full url to fetch API data
  API_urlParams = `zip=${userZipcode},${countryCode}&appid=${API_KEY}`;
  API_url = API_BASE_URL + API_urlParams;

  //Get data from API
  get_API_Data(API_url)
    .then(function (received_API_data) {
      // viewing data receveived from API
      /*console.log('received API data:',received_API_data);*/

      if (received_API_data.cod === "404") {
        alert("No city found with that zipcode");
        document.getElementById("date").innerHTML = '<span class="entryHeader">Date:</span> ' + "...";
        document.getElementById("city").innerHTML = '<span class="entryHeader">city:</span> ' + received_API_data.message;
        document.getElementById("zipcode").innerHTML = '<span class="entryHeader">Zipcode:</span> ' + "zip code not found";
        document.getElementById("temp").innerHTML = '<span class="entryHeader">Current Temperature:</span> ' + "..." + " degrees";
        document.getElementById("feedback").innerHTML = '<span class="entryHeader">Current Feeling:</span> ' + userFeelings;

        throw "cancel";
      }

      postDataToServer("/add", {
        date: newDate,
        city: received_API_data.name,
        zipcode: userZipcode,
        temperature: received_API_data.main.temp,
        feedback: userFeelings,
      });

      // updates user interface
      updateUI();
    })
    .catch(function (error_msg) {
      console.log("an error occured. You may contact the site administrator at admin@weatherapp.com", error_msg);
    });
} // end function

// Defines async GET request to retrieve OpenWeatherMap API data
const get_API_Data = async (url) => {
  const response = await fetch(url);
  //Call API
  try {
    const received_API_data = await response.json();
    return received_API_data;
  } catch (error) {
    console.log("an error occured", error);
  }
};

// Defines POST request to app web server with API data
const postDataToServer = async (url = "", data = {}) => {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  try {
    const updatedServerContent = await response.json();
    return updatedServerContent;
  } catch (error) {
    console.log("error", error);
  }
};

// Defines GET request to app web server to fetch all entries and display them on app page
const updateUI = async () => {
  const request = await fetch("/all");

  try {
    const allData = await request.json();
    document.getElementById("date").innerHTML = '<span class="entryHeader">Date:</span> ' + allData.date;
    document.getElementById("city").innerHTML = '<span class="entryHeader">city:</span> ' + allData.city;
    document.getElementById("zipcode").innerHTML = '<span class="entryHeader">Zipcode:</span> ' + allData.zipcode;
    document.getElementById("temp").innerHTML = '<span class="entryHeader">Current Temperature:</span> ' + Math.round(allData.temperature) + " degrees";
    document.getElementById("feedback").innerHTML = '<span class="entryHeader">Current Feeling:</span> ' + allData.feedback;
  } catch (error) {
    console.log("error", error);
  }
};

// Selects text of input element
function selectText(e) {
  this.select();
}

// Listening in on events on the app's page
document.getElementById("generate").addEventListener("click", updateWeaterApp);
document.getElementById("zip").addEventListener("click", selectText);


