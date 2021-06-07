//Selectors
const pageTitle = document.querySelector(".page_name");
const countriesContainer = document.querySelector(".countries");
const regions = ["africa", "americas", "asia", "europe", "oceania"];
const chooseRegionBtn = document.querySelector(".option_title");
const mainContainer = document.querySelector(".main_container");

const inputSearchCountry = document.querySelector(".search_input");
const searchForm = document.querySelector(".search_container");

const countryCard = document.querySelector(".country");
const countryDetails = document.querySelector(".country_details");
const countryName = document.querySelector(".country_name_title");

const features1 = document.querySelector(".features_1");
const features2 = document.querySelector(".features_2");

const countryBorderCountries = document.querySelector(".border_countries");
const countryFlag = document.querySelector(".country-flag");

const btnBack = document.querySelector(".btn_back");
const chooseRegionOptionsContainer = document.querySelector(
  ".option_container__options"
);
const optionsContainer = document.querySelector(".option_container");

pageTitle.addEventListener("click", () => {
  window.location.reload();
});

const getJSON = function (url, errorMsg = "Something went wrong:(") {
  return fetch(url).then((response) => {
    if (!response.ok) throw new Error(`${response.status} : ${errorMsg}`);
    return response.json();
  });
};

const renderCountry = function (data) {
  const population = new Intl.NumberFormat(`en-IN`).format(
    `${data.population}`
  );

  const html = `<article class="country">
    <img src="${data.flag}" alt="country_flag" />
    <div class="country__data">
      <h3 class="country_name">${data.name}</h3>
      <p class="country_population">
        <span class="data_heading">Population:</span> ${population}
      </p>
      <p class="country_region">
        <span class="data_heading">Region:</span> ${data.region}
      </p>
      <p class="country_capital">
        <span class="data_heading">Capital:</span> ${data.capital}
      </p>
    </div>
  </article>`;
  countriesContainer.insertAdjacentHTML(`beforeend`, html);
};

const getCountriesByRegion = function (region) {
  getJSON(`https://restcountries.eu/rest/v2/region/${region}`).then((data) => {
    data.forEach((country) => renderCountry(country));
  });
};

chooseRegionBtn.addEventListener("click", function () {
  if (chooseRegionOptionsContainer.classList.contains("hidden"))
    chooseRegionOptionsContainer.classList.remove("hidden");
  else chooseRegionOptionsContainer.classList.add("hidden");
});

regions.forEach((region) => getCountriesByRegion(region));

optionsContainer.addEventListener("click", function (e) {
  if (!e.target.classList.contains("option")) return;

  const regionName = e.target.dataset.region;
  clearCountries();
  getCountriesByRegion(regionName);
});

const clearCountries = function () {
  countriesContainer.innerHTML = "";
};

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  clearCountries();
  const searchCountry = inputSearchCountry.value;

  getJSON(`https://restcountries.eu/rest/v2/name/${searchCountry}`)
    .then((data) => {
      renderCountry(data[0]);
    })
    .catch((err) => {
      countriesContainer.insertAdjacentText(
        "beforeend",
        `${err.message} Try again!`
      );
    });
});

const clearPrevDetails = function () {
  countryName.innerText =
    features1.innerHTML =
    features2.innerHTML =
    countryBorderCountries.innerHTML =
    countryBorderCountries.innerHTML =
      "";
};

const renderCountryDetailsCard = function (country) {
  clearPrevDetails();

  countryFlag.src = country.flag;
  countryName.insertAdjacentHTML("beforeend", `${country.name}`);
  const populationCount = new Intl.NumberFormat(
    `en-${country.alpha2Code}`
  ).format(`${country.population}`);
  // Rendering details
  const detailsHTML = `<ul>
                  <li><span class="feature_title ">Native Name:</span> ${
                    country.nativeName
                  }</li>
                  <li><span class="feature_title ">Population:</span> ${populationCount}</li>
                  <li><span class="feature_title ">Region:</span> ${
                    country.region
                  }</li>
                  <li><span class="feature_title ">Sub Region:</span> ${
                    !country.subRegion ? "" : country.subRegion
                  }</li>
                  <li><span class="feature_title ">Capital:</span> ${
                    country.capital
                  }</li>
                  </ul>`;

  features1.insertAdjacentHTML("beforeend", detailsHTML);

  // Country currencies
  let currencyElement = `<li class="currencies"><span class="feature_title">Currencies:</span>`;
  country.currencies.forEach((e, index) => {
    currencyElement += `${country.currencies[index].name} (${country.currencies[index].symbol}), `;
  });
  currencyElement = ` ${currencyElement.slice(
    0,
    currencyElement.length - 2
  )}</li>`;

  // Languages
  let languages = "";
  country.languages.forEach((lang) => (languages += `${lang.name}, `));
  languages = languages.slice(0, languages.length - 2);
  const f2HTML = `<ul><li class="top-level-domain"><span class="feature_title tld">Top Level Domain:</span>${country.topLevelDomain}</li>
  ${currencyElement}
  <li class="languages"><span class="feature_title">Languages:</span>${languages}</li>
</ul>`;

  features2.insertAdjacentHTML("beforeend", f2HTML);
  // Border Countries
  let borderCountriesHTML = `<p class="feature_title">Border Countries:</p>`;
  countryBorderCountries.insertAdjacentHTML("beforeend", borderCountriesHTML);
  const borderCs = country.borders;
  for (let i = 0; i < borderCs.length; i++) {
    getJSON(`https://restcountries.eu/rest/v2/alpha/${borderCs[i]}`)
      .then((data) => {
        countryBorderCountries.insertAdjacentHTML(
          "beforeend",
          `<span class="border_country">${data.name}</span>`
        );
      })
      .catch((err) => console.error(err));
  }
};

const toggleHidden = function () {
  countryDetails.classList.toggle("hidden");
  mainContainer.classList.toggle("hidden");
};

countriesContainer.addEventListener("click", function (e) {
  if (!e.target.classList.contains("country_name")) return;
  toggleHidden();
  const capital = e.target.parentElement
    .querySelector(".country_capital")
    .textContent.replace(/\n/g, "")
    .replace(" ", "")
    .trimStart()
    .slice(9);

  getJSON(`https://restcountries.eu/rest/v2/capital/${capital}`)
    .then((data) => {
      renderCountryDetailsCard(data[0]);
    })
    .catch((err) => console.log(`${err.message}`));
});

btnBack.addEventListener("click", function () {
  toggleHidden();
});

countryBorderCountries.addEventListener("click", function (e) {
  if (!e.target.classList.contains("border_country")) return;
  const bCountry = getJSON(
    `https://restcountries.eu/rest/v2/name/${e.target.textContent}`
  ).then((data) => {
    return renderCountryDetailsCard(data[0]);
  });
});
