export function Observe(id, numSteps, callback){
  let boxElement = document.querySelector(id)

  let thresholds = [...Array(numSteps).keys()]
    .map((val)=>val/numSteps + 1/numSteps)
  let options = {
    root: null,
    rootMargin: "0px",
    threshold: thresholds
  }

  let observer = new IntersectionObserver(callback, options)
  observer.observe(boxElement)
}

const PLAYLIST_TRACK_LIMIT = 50
const TRACK_LENGTH_SCALE = 0.2

export const randomIntFromInterval = (min, max) => { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index from 0 to i (inclusive)
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements at index i and j
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const fetchPlaylistMeta = async(playlistIds) => {
    let promises = playlistIds.map(playlistId => 
      fetch(`https://spotify-proxy-beta.vercel.app/api/spotify?type=playlist&id=${playlistId}`)
        .then(r => r.ok ? r.json() : Promise.reject(new Error(`Playlist failed for:${playlistId}`)))
    )
    let results = await Promise.allSettled(promises)
    return results
      .filter(r => r.status === "fulfilled")
      .flatMap(r => r.value)
  }

const fetchPlaylistTracks = async(playlistId, offsets) => {
  let promises = offsets.map(offset => 
    fetch(`https://spotify-proxy-beta.vercel.app/api/spotify?type=playlist_chunk&id=${playlistId}&offset=${offset}&limit=${PLAYLIST_TRACK_LIMIT}`)
      .then(r => r.ok ? r.json() : Promise.reject(new Error(`Tracks failed for ${playlistId}:${offset}`)))
  )
  let results = await Promise.allSettled(promises)
  return results
    .filter(r => r.status === "fulfilled")
    .flatMap(r => r.value.items)
}

export const GetSpotifyPlaylistTracks = async(playlistSplit) => {
  let total = Object.keys(playlistSplit).reduce((tot, currPlaylistId) => tot + playlistSplit[currPlaylistId], 0)

  const validPlaylists = await fetchPlaylistMeta(Object.keys(playlistSplit)) 

  const playlistTasks = validPlaylists.map(async (meta) => {
    let numtracks = Math.floor(playlistSplit[meta.id]/total * meta.tracks.total * TRACK_LENGTH_SCALE)
    let chunksNeeded = Math.ceil(numtracks/PLAYLIST_TRACK_LIMIT)
    let upperLim = meta.tracks.total - PLAYLIST_TRACK_LIMIT
    let offsets = Array(chunksNeeded).fill(0)
    offsets = offsets.map(()=>randomIntFromInterval(0, upperLim))
    let tracks = await fetchPlaylistTracks(meta.id, offsets)
    tracks = shuffleArray(tracks).slice(numtracks)
    return { id: meta.id, tracks }
  })

  const allResults = await Promise.allSettled(playlistTasks)
  let tracks = allResults
    .filter(r => r.status === "fulfilled")
    .map(r => r.value)
    .flatMap(p => p.tracks)
  tracks = shuffleArray(tracks)
  return tracks
}