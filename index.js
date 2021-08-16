const CLEAN_ICON_CLASS = 'clean-icon';
const SEARCH_INPUT_CLASS = 'search-input';

document.addEventListener('DOMContentLoaded', onDocumentLoaded);

function onDocumentLoaded() {
  document
    .getElementsByClassName(SEARCH_INPUT_CLASS)[0]
    .addEventListener('input', searchForMusic);

  document
    .getElementsByClassName(CLEAN_ICON_CLASS)[0]
    .addEventListener('click', cleanSearch);
}

async function searchForMusic(e) {
  const { value } = e.target;

  handleCleanSearchIcon(value);

  const response = await get(`search?query=${value}&type=track`);

  cleanList();

  if (response.tracks) {
    buildMusicList(response.tracks.items);
  }
}

function cleanSearch() {
  document.getElementsByClassName(SEARCH_INPUT_CLASS)[0].value = '';
  cleanList();
}

function handleCleanSearchIcon(value) {
  const element = document.getElementsByClassName(CLEAN_ICON_CLASS)[0];

  if (value) {
    element.style.visibility = 'visible';
  } else {
    element.style.visibility = 'hidden';
  }
}

function cleanList() {
  const parentElement = document.getElementsByClassName('search-results')[0];
  parentElement.innerHTML = null;
}

function buildMusicList(tracks) {
  const parentElement = document.getElementsByClassName('search-results')[0];

  tracks.forEach((track) => {
    const template = buildMusicTemplate(track);
    const element = document.createElement('div');

    element.innerHTML = template;
    element.className = 'track-container';

    parentElement.appendChild(element);
  });
}

function buildMusicTemplate(track) {
  const { album } = track;
  const url = album.images[0] && album.images[0].url;

  const base = `
    <div class='info'>
      <img src=${url} alt='album cover' class='album-cover'></img>
      <span class='title'>
        ${track.name}
      </span>
      <span class='subtitle'>
        ${track.artists[0].name} - ${album.name}
      </span>
    </div>
  `;

  const preview = `
    <div class='preview'>
      <audio controls>
        <source src=${track.preview_url} type="audio/mpeg"></source>
      </audio>
    </div>
  `;

  if (!track.preview_url) return base;

  return `${base}${preview}`;
}

async function get(url) {
  const BASE_URL = 'https://api.spotify.com/v1';
  const response = await fetch(`${BASE_URL}/${url}`, {
    headers: {
      Authorization:
        'Bearer <API_KEY>',
      'Content-type': 'application/json',
    },
  });

  return response.json();
}
