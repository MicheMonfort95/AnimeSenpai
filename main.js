const base_url = "https://api.jikan.moe/v4";

function searchCharacter(event) {
  event.preventDefault();

  const form = new FormData(this);
  const query = form.get("search");

  //console.log(query);

  Promise.all([
    fetch(`${base_url}/anime?q=${query}`).then((res) => res.json()),
    fetch(`${base_url}/characters?q=${query}`).then((res) => res.json()),
  ])
    .then(([animeData, characterData]) => {
      console.log(animeData, characterData);
      updateDom(animeData.data, characterData.data);
    })
    .catch((err) => console.warn(err.message));
}

function updateDom(animeData, characterData) {
  const searchResults = document.getElementById("search-results");

  const animeCards = animeData

    .map((anime) => {
      return `
          <div class="card">
            <div class="card-image">
              <img src="${anime.images.jpg.image_url}">
            </div>
            <div class="card-content">
              <span class="card-title">${anime.title}</span>
              <p>${anime.synopsis}</p>
            </div>
            <div class="card-action">
              <a href="${anime.url}">More info</a>
            </div>
          </div>
        `;
    })
    .join("");

  const characterCards = characterData
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((character) => {
      return `
          <div class="card">
            <div class="card-image">
              <img src="${character.images.jpg.image_url}">
            </div>
            <div class="card-content">
              <span class="card-title">${character.name}</span>
              <p>${character.about}</p>
            </div>
            <div class="card-action">
              <a href="${character.url}">More info</a>
            </div>
          </div>
        `;
    })
    .join("");

  searchResults.innerHTML = animeCards + characterCards;
}

function pageloaded() {
  const form = document.getElementById("search-form");
  form.addEventListener("submit", searchCharacter);
}
window.addEventListener("pageshow", function (event) {
  // Check if the page is loaded from the cache
  if (event.persisted) {
    // Reload the page
    location.reload(searchResults);
  }
});

window.addEventListener("load", pageloaded);
