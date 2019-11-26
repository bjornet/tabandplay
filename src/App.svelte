<script>
  import Tab from './Tab/Tab.svelte'
  import MusicPlayer from './MusicPlayer/MusicPlayer.svelte'

  let song = 'Comfortably Numb'
  let artist = 'Pink Floyd'
</script>

<style>
  main {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
</style>

<header>
  <h1>Time to play <span class="song">{song}</span> by <span class="artist">{artist}</span></h1>
</header>
<main>
  <Tab />
  <MusicPlayer />
</main>
