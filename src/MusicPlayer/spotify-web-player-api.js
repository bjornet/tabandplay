// Get the hash of the url
const hash = window.location.hash
  .substring(1)
  .split('&')
  .reduce(function (initial, item) {
    if (item) {
      var parts = item.split('=');
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});

window.location.hash = '';

// Set token
let _token = hash.access_token;

let songUris = ["spotify:track:7Fg4jpwpkdkGCvq1rrXnvx"]

const authEndpoint = 'https://accounts.spotify.com/authorize';

// Replace with your app's client ID, redirect URI and desired scopes
const clientId = 'dfb5394565834cecaa5498b82c6331e1';
const redirectUri = 'http://localhost:5000/';
const scopes = [
  'streaming',
  'user-read-private',
  'user-modify-playback-state'
];

// If there is no token, redirect to Spotify authorization
if (!_token) {
  window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
}

// Play a specified track on the Web Playback SDK's device ID
async function play(device_id) {
  return new Promise((resolve) => {
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
      method: 'PUT',
      body: JSON.stringify({
        uris: songUris
      }),
      headers: {
        Authorization: `Bearer ${_token}`
      }
    }).then(resolve);
  });
}

window.onSpotifyWebPlaybackSDKReady = () => {};

async function waitForSpotifyWebPlaybackSDKToLoad() {
  return new Promise(resolve => {
    if (window.Spotify) {
      resolve(window.Spotify);
    } else {
      window.onSpotifyWebPlaybackSDKReady = () => {
        resolve(window.Spotify);
      };
    }
  });
};

async function waitUntilUserHasSelectedPlayer(sdk) {
  return new Promise(resolve => {
    let interval = setInterval(async () => {
      let state = await sdk.getCurrentState();
      if (state !== null) {
        resolve(state);
        clearInterval(interval);
      }
    });
  });
};

module.exports = async () => {
  const {
    Player
  } = await waitForSpotifyWebPlaybackSDKToLoad();

  const sdk = new Player({
    name: "Web Playback SDK async-await Template",
    volume: 1.0,
    getOAuthToken: callback => {
      callback(_token);
    }
  });

  // Playback state has changed
  sdk.on("player_state_changed", state => {
    let {
      name: track_name,
      album: {
        images: [{
          url: artwork_url
        }],
        name
      }
    } = state.track_window.current_track;
    console.log(state);

    document.getElementById('current-track').setAttribute('src', artwork_url);
    document.getElementById('current-track-title').innerText = `${track_name} on ${name}`;
  });

  // Ready
  sdk.on('ready', data => {
    let {
      device_id
    } = data;

    // Play a track using our new device ID
    console.log('Ready with Device ID', device_id);
    play(device_id);
  });

  let connected = await sdk.connect();
  if (connected) {
    console.log("Waiting for player to be selected ...");
    let state = await waitUntilUserHasSelectedPlayer(sdk);
    console.log("Player has been selected!");

    await sdk.resume();
    await sdk.setVolume(0.5);

    let {
      id,
      uri: track_uri,
      name: track_name,
      duration_ms,
      artists,
      album: {
        name: album_name,
        uri: album_uri,
        images: album_images
      }
    } = state.track_window.current_track;


    console.log(`You're listening to ${track_name} by ${artists[0].name}!`);
  } else {
    console.error("Failed to connect Player");
  }
};
