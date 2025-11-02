import React, { useEffect, useState } from "react";
import EmptyImage from "../assets/icons/image_icon.svg"

export default function MusicPlayerWidget({
  trackImgUrl = '',
  trackName = '',
  artistName = '',
  linkUrl = '',
  trackHandler,
}){
  const [isAudioPaused, setIsAudioPaused] = useState(true)

  useEffect(()=>{
    let query = `artist:"${artistName}" track:"${trackName}"`
    fetch(`https://spotify-proxy-beta.vercel.app/api/deezer?type=search&query=${encodeURIComponent(query)}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then(data => {
        if (data.data.length < 1){
          trackHandler(0, true)
        }
        let audio = document.getElementById("audio")
        audio.crossOrigin = "anonymous"
        audio.src = data.data[0].preview
        audio.load()
        audio.play()
        audio.volume = 0.5
        audio.onended = () => {
          trackHandler(1)
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      })
  }, [linkUrl])

  useEffect(()=>{
    let myAudio = document.getElementById('audio')
    isAudioPaused ? myAudio.pause() : myAudio.play()

  }, [isAudioPaused])

  return(
    <div className="music_player_widget">
      <img
        className="track_image"
        src={trackImgUrl}
        onError={(e) => {
          e.target.onerror = null
          e.target.src = EmptyImage
        }}
        alt="Album art" 
      />
      <div className="desc_and_controls_container">
        <div className="track_info">
          <div className="track_name">{trackName}</div>
          <div className="artist_name">{artistName}</div>
        </div>
        <div className="audio_control">
          <div className="audio_icon skip prev"
            onClick={()=>trackHandler(-1)}
          />
          <div className={`audio_icon ${isAudioPaused ?'play' :'pause'}`}
            onClick={()=>setIsAudioPaused(!isAudioPaused)}
          />
          <div className="audio_icon skip"
            onClick={()=>trackHandler(1)}
          />
          <audio id="audio" />
        </div>
      </div>
    </div>
  )
}