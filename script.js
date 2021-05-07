'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

const renderCountry = function (data, className = '') {
  //Build card component
  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)}</p>
      <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
      <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    </div>
  </article>`;

  //Insert card component into page
  countriesContainer.insertAdjacentHTML('beforeend', html);
};

//Create function that renders an error
const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
};

//Create helper function which wraps up the fetch, the error handling and the conversion to JSON
const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(`${errorMsg}, (${response.status})`);
    }
    return response.json();
  });
};

const getCountryData = function (country) {
  //AJAX call country 1
  getJSON(
    `https://restcountries.eu/rest/v2/name/${country}`,
    'Country not found'
  )
    .then(data => {
      renderCountry(data[0]);

      const neighbour = data[0].borders[0];

      if (!neighbour) return;

      //2º AJAX call country 2
      return getJSON(
        `https://restcountries.eu/rest/v2/alpha/${neighbour}`,
        'Country not found'
      );
    })
    .then(data => renderCountry(data, 'neighbour'))
    .catch(err => {
      console.error(`${err} 💥💥💥`);
      renderError(`Something went wrong 💥💥 ${err.message}. Try again later.`);
    })
    // Fade in the container no matter what kind of promise we get
    .finally(() => {
      countriesContainer.style.opacity = '1';
    });
};

// Call getCountryData when the user clicks on the button.
btn.addEventListener('click', function () {
  getCountryData('spain');
});

getCountryData('jiojef');
