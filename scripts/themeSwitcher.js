const btnThemeSwitcher = document.querySelector(".btn_theme");
const cssLinkStyles = document.querySelector("#myStylesheet");
const cssDetailsStyles = document.querySelector("#myDetailStylesheet");
let i = 0;
const links = [
  "style.css",
  "dark_theme_style.css",
  "country_Details.css",
  "countryDetails_Dark.css",
];

const windowsOnLoad = function () {
  cssLinkStyles.href = `/css/${links[0]}`;
  cssDetailsStyles.href = `/css/${links[3]}`;
};

windowsOnLoad();

const changeTheme = function (link1, link2, modeName, iconHTML) {
  cssLinkStyles.href = `${[link1]}`;
  cssDetailsStyles.href = `${[link2]}`;
  btnThemeSwitcher.textContent = `${modeName} Mode`;
  btnThemeSwitcher.insertAdjacentHTML("afterbegin", iconHTML);
};

const switchTheme = function () {
  btnThemeSwitcher.children[0].remove();
  if (i === 0) {
    changeTheme(
      `/css/${links[1]}`,
      `/css/${links[3]}`,
      "Light",
      '<i class="fas fa-sun"></i>'
    );
    i++;
  } else {
    changeTheme(
      `/css/${links[0]}`,
      `/css/${links[2]}`,
      "Dark",
      '<i class="far fa-moon"></i>'
    );

    i--;
  }
};

btnThemeSwitcher.addEventListener("click", switchTheme);
