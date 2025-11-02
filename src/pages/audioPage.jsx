import React from "react";
import "../css/_audioPage.scss"
import AudioVisualiser from "../components/audioVis";

export default class AudioVis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currAudioUrl: null,
      searchTerm: '',
      tracks: [],
      currTrackIndex: 0,
    }
    this.deezerFetch = this.deezerFetch.bind(this)
  }

  deezerFetch = async(event) => {
    // var searchTerm = 'miku'
    if (event.key !== 'Enter') return
    const url = "https://api.deezer.com/search?q=" + this.state.searchTerm
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
      }

      const json = await response.json()
      var currAudioUrl = json.data[0]?.preview || null
      this.setState({currAudioUrl})
    } catch (error) {
      console.error(error.message)
    }
  }

  componentDidMount = () => {
    const textInput = document.getElementById('search_song_textfield')
    textInput.addEventListener('keydown', this.deezerFetch)
  }

  render() {
    return (
      <div className="audioPage_container">
        <AudioVisualiser
          startAnimate={true}
          url={this.state.currAudioUrl || undefined}
          audioEndedHandler = {()=>this.setState(prevState => ({
            currTrackIndex: prevState.currTrackIndex + 1
          }))}
        />
        <input type="text" id="search_song_textfield" onChange={(e)=>this.setState({searchTerm: e.target.value})}/>
      </div>
    )
  }
}