<script>
  import { onMount } from 'svelte';
  import MusicPlayerInit from './spotify-web-player-api';
  let musicPlayerReady = false;
  let mounted = false;

  onMount(() => {
    mounted = true;
    if (musicPlayerReady) {
      loadMusicPlayerElements();
    }
  });

  function musicPlayerLoaded() {
    // The external musicPlayer javascript is ready.
    musicPlayerReady = true;
    if (mounted) {
      loadMusicPlayerElements();
    }
  }

  function loadMusicPlayerElements() {
    MusicPlayerInit()
  }
</script>

<style>
  .spotify-player {
    background: whitesmoke;
  }
</style>

<svelte:head>
  <script src="https://sdk.scdn.co/spotify-player.js" on:load={musicPlayerLoaded}></script>
</svelte:head>

<section class="spotify-player">
  {#if !musicPlayerReady}
    ...loader
  {:else}
    <img id="current-track" alt="track-image" src="images/MusicPlayer/tape.png" height="300" />
    <h3 id="current-track-title">&nbsp;</h3>
  {/if}
</section>
