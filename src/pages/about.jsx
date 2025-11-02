import React from "react";
import "../css/_base.scss"
import "../css/_about.scss"
import "../css/_musicPlayerWidget.scss"
import { Observe } from "./utils/observe";
import cringe from "../assets/images/cringe2.jpg"
import ResumePDF from "../assets/documents/resume.pdf"

import cube from "../assets/models/rounded_cube.glb"
import ThreeCanvas from "../components/threeJS/threeCanvas";
import * as THREE from "three";
import ArrowSvg from "../assets/images/arrowSvg";
import ArrowRIghtAngleSvg from "../assets/images/arrow_right_angle";

import { GetSpotifyPlaylistTracks } from "./utils/observe";
import MusicPlayerWidget from "../components/MusicPlayerWidget";

export default class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      threeCanvasWidth: 0,
      threeCanvasHeight: 0,
      typeTriggers: [],
      test: false,
      models: null,
      extras: [],
      tracks: [],
      musicPlayerWidgetData: {
        trackImgUrl: '',
        trackName: '',
        artistName: '',
        linkUrl: '',
      }
    }
    this.threeCanvas = React.createRef();
    this.animate = this.animate.bind(this)
    this.timeStamp = 0
    this.intersectionRatio = 0
    this.currTrackIndex = 0
  }

  async componentDidMount() {
    window.addEventListener('resize', this.handleResize)

    let handleIntersect = (entries) => {
      entries.forEach((entry) => {
        this.intersectionRatio = entry.intersectionRatio
        this.props.trackpage(entry.intersectionRatio)
      })
    }
    Observe("#page_about", 20, handleIntersect)

    const loader = new THREE.TextureLoader();
    const texture = loader.load(cringe)
    texture.encoding = THREE.sRGBEncoding
    let geometry = new THREE.CircleGeometry(1, 32) // ensure correct aspect ratio
    let material = new THREE.MeshBasicMaterial({ map: texture })
    let mesh = new THREE.Mesh(geometry, material)
    mesh.scale.set(15, 15)

    this.setState({ extras: [...this.state.extras, mesh] })
    this.animate()

    let tracks = await GetSpotifyPlaylistTracks({
      "5NfariAq7QpIho95rsjvbI": 10,
      "58FzrDwAvFtUu1HXa8J5Ep": 20,
      "6PRPIORY3xM68kfBrWvlIA": 10,
      "3WPjvXTO4Ux9v3ylbhQtCu": 20,
      "1CD4wGDLiuGEhW9W5Oa6nE": 25,
      "0IRxJDJf7bWKsjHf1Dm18k": 30,
      "2Psp006KQbVZ4UCfR29Lmk": 30,
    })
    this.setState({tracks}, ()=>this.handleTrackChange())
  }

  handleTrackChange = (skip_amount = 0, removeSong = false) => {
    let new_track_index = this.currTrackIndex + skip_amount
    let updatedTracks = this.state.tracks
    if (removeSong){
      updatedTracks = updatedTracks.filter((_, index) => index !== new_track_index)
    }
    let tot_tracks_length = updatedTracks.length

    if (new_track_index < 0) new_track_index = 0
    if (new_track_index > tot_tracks_length-1) new_track_index = tot_tracks_length

    const {
      track: {
        name: trackName,
        uri: linkUrl,
        album: { images: albumImages },
        artists: artistList
      }
    } = updatedTracks[new_track_index]

    const trackImgUrl = albumImages?.[0]?.url || ''
    const artistName = artistList?.map(a => a.name).join(", ") || "Unknown Artist"

    let musicPlayerWidgetData = {
      trackImgUrl,
      trackName,
      artistName,
      linkUrl,
    }
    this.setState({ musicPlayerWidgetData, tracks: updatedTracks }, ()=>this.currTrackIndex = new_track_index)
  }

  animate() {
    requestAnimationFrame(this.animate)

    if (this.state.models !== null) {
      // orbit control vars
      let rad = 18.5
      let XYdivision = 8
      // changes depending on orbit obj
      let divisionProportion = 0
      let delay = 0
      Object.values(this.state.models).forEach(model => {

        if (model.name === "disk") {
          model.rotation.y += 0.01

        } else if (model.name === "cube1") {
          model.rotation.y += 0.01
          model.rotation.x += 0.01

          divisionProportion = 1
          delay = 1
          model.position.x = rad * Math.cos(2 * Math.PI / XYdivision * divisionProportion) * Math.sin(this.timeStamp + delay)
          model.position.y = rad * Math.sin(2 * Math.PI / XYdivision * divisionProportion) * Math.sin(this.timeStamp + delay) + Math.sin(this.timeStamp) * 0.02
          model.position.z = rad * Math.cos(this.timeStamp + delay)
        } else if (model.name === "cube2") {
          model.rotation.y += 0.01
          model.rotation.x += 0.01

          divisionProportion = 7
          delay = 3
          model.position.x = rad * Math.cos(2 * Math.PI / XYdivision * divisionProportion) * Math.sin(this.timeStamp + delay)
          model.position.y = rad * Math.sin(2 * Math.PI / XYdivision * divisionProportion) * Math.sin(this.timeStamp + delay) + Math.sin(this.timeStamp) * 0.02
          model.position.z = rad * Math.cos(this.timeStamp + delay)
        } else if (model.name === "cube3") {
          model.rotation.y += 0.01
          model.rotation.x += 0.01

          divisionProportion = 2
          delay = 2
          model.position.x = rad * Math.cos(2 * Math.PI / XYdivision * divisionProportion) * Math.sin(this.timeStamp + delay)
          model.position.y = rad * Math.sin(2 * Math.PI / XYdivision * divisionProportion) * Math.sin(this.timeStamp + delay) + Math.sin(this.timeStamp) * 0.02
          model.position.z = rad * Math.cos(this.timeStamp + delay)
        }
      })
      this.state.extras.forEach(extra => {
        extra.position.y += Math.sin(this.timeStamp) * 0.02
      })
    }

    this.timeStamp += 0.01
  }

  render() {
    let profilePicWidth = window.innerWidth * (window.innerWidth < 850 ? 0.8 : 0.5)

    return (
      <div className="landing_page about">
        <div className="background" id="page_about">
          <div className="modal">
            <div className="landing_page_content" id="about_content">
              <div className="about_content">
                <div className="profile_pic_container">
                  <div className="profile_pic"
                    onClick={()=>window.open(ResumePDF)}
                    style={{width: `${profilePicWidth}px`, height: `${profilePicWidth}px`}}
                  >
                    <ThreeCanvas
                      id='ThreeCanvas'
                      startAnimate={this.props.start}
                      cameraPos={{ x: -20, y: 0, z: 80 }}
                      enableControl={false}
                      models={[
                        {
                          modelFile: cube,
                          name: "cube1",
                          quantity: 1,
                          scale: 1.8,
                          color: null,
                          mapImg: cringe,
                        },
                        {
                          modelFile: cube,
                          name: "cube2",
                          quantity: 1,
                          scale: 1.8,
                          color: null,
                          mapImg: cringe,
                        },
                        {
                          modelFile: cube,
                          name: "cube3",
                          quantity: 1,
                          scale: 1.8,
                          color: null,
                          mapImg: cringe,
                        }
                      ]}
                      extras={this.state.extras}
                      updateModelList={(models) => this.setState({ models })}
                      updateExtraList={(extras) => this.setState({ extras })}
                    />
                    <div className="click-resume-prompt">
                      <div className="prompt-arrow">
                        <ArrowSvg
                          duration={500}
                          height={'100%'}
                          pageOverlap={this.intersectionRatio}
                        />
                      </div>
                      <div className="prompt-text"
                        data-aos="fade-up"
                      >
                        Click for Resume!
                      </div>
                    </div>
                  </div>
                </div>
                <div className="about_desc">
                  <div className="about_text">
                    Oxygen enjoyer and food enthusiast <br/>
                  </div>
                  <div className="music_container">
                    <div className="click-resume-prompt">
                      <div className="prompt-arrow">
                        <ArrowRIghtAngleSvg
                          duration={500}
                          height={'100%'}
                          pageOverlap={this.intersectionRatio}
                        />
                      </div>
                      <div className="prompt-text"
                        data-aos="fade-up"
                      >
                        Some songs I like, 🅱️angers only 🔥🔥🔥
                      </div>
                    </div>
                    <div className="music_player_widget_container">
                      <MusicPlayerWidget
                        trackImgUrl={this.state.musicPlayerWidgetData.trackImgUrl}
                        trackName={this.state.musicPlayerWidgetData.trackName}
                        artistName={this.state.musicPlayerWidgetData.artistName}
                        linkUrl={this.state.musicPlayerWidgetData.linkUrl}
                        trackHandler={(skipAmount, remove)=>this.handleTrackChange(skipAmount, remove)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}