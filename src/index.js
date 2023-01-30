import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const debounce = require('lodash.debounce');
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('input');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
    const searchedCountry = e.target.value.trim();
  
    if (!searchedCountry) {
      return;
    }
  
    fetchCountries(searchedCountry)
      .then(data => {
        // console.log(data);
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
  
        if (data.length > 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
          return;
        }
  
        if (data.length >= 2 && data.length <= 10) {
          countryListMarkup(data);
          return;
        }
  
        renderCountryInfo(data);
      })
      .catch(err => {
        if (err.message === '404') {
          Notify.failure('Oops, there is no country with that name');
          countryList.innerHTML = '';
          countryInfo.innerHTML = '';
        }
      });
  }

  function countryListMarkup(countries) {
    const markup = countries
      .map(({ flags, name }) => {
        return `<li class="country-item">
          <img class="country-list-image" src=${flags.svg} width='50px' alt='${name.common}-flag' />
          <p class="country-list-name">${name.official}</p>
          </li>`;
      })
      .join('');
  
    countryList.innerHTML = markup;
  }
  
  function renderCountryInfo([{ name, capital, flags, population, languages }]) {
    const lang = Object.values(languages).join(', ');
  
    const markup = `<h2 class="country-info-title">
    <img class="country-flag-svg" src=${flags.svg} width="50px">
    ${name.official}</h2>
    <ul class="country-info">
  <li class="country-info-item">
  <p><b>Capital:</b> ${capital}
  </p>
  </li>
  <li class="country-info-item">
  <p><b>Population:</b> ${population}
  </p>
  </li>
  <li class="country-info-item">
  <p><b>Languages:</b> ${lang}
  </p>
  </li>
  </ul>`;
  
    countryInfo.innerHTML = markup;
  }