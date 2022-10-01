import React from "react";
import "../css/_landing.scss"
import "aos/dist/aos.css";
import ThreeCanvas from "./threeJS/threeCanvas";
import ModelGithub from "../assets/models/github_3d_2.glb"
import ModelAudioVis from "../assets/models/audioVis.glb"
import Cube from "../assets/models/rounded_cube.glb"

const VisLength = 60

export default class AudioVisualiser extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      models:null,
      animate: false,
      audioControls: null,
    }
    this.audioInputRef = new React.createRef()
    this.animate = this.animate.bind(this)
    this.audioContext = new AudioContext()
    this.analyser = this.audioContext.createAnalyser()
    this.freqIndxArr = []
    this.freqArr = []
    this.originalMeshYposArr = []
  }

  RGBToHex(r, g, b) {
    return "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  HexToRGB(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });
  
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  componentDidMount(){
    this.audioInputRef.current.addEventListener('change', this.handleInputAudio)
  }

  componentDidUpdate(){
    if(this.state.models !==null && Object.values(this.state.models).length >=VisLength){
      let meshs = Object.values(this.state.models)

      // set color
      let from = this.HexToRGB('#f83d53')
      let to = this.HexToRGB('#85d8fe')

      let rStep = Math.round(((from.r-to.r)/meshs.length))
      let gStep = Math.round(((from.g-to.g)/meshs.length))
      let bStep = Math.round(((from.b-to.b)/meshs.length))

      meshs.forEach((mesh, indx)=>{
        mesh.position.set(-29+(indx), 0, 0)
        let r = from.r - rStep*indx
        let g = from.g - gStep*indx
        let b = from.b - bStep*indx
        mesh.material.color.setHex(this.RGBToHex(r, g, b))
        this.originalMeshYposArr.push(-29+(indx))
      })
    }
  }

  handleInputAudio = (e)=>{
    let audioFile = e.target.files[0]

    let audio = document.getElementById("audio")
    audio.src = URL.createObjectURL(audioFile)
    audio.load()
    audio.play()

    let source  = this.audioContext.createMediaElementSource(audio)
    source.connect(this.analyser)
    source.connect(this.audioContext.destination)

    let fftLength = 256
    let stepSize = Math.round((fftLength/2)/VisLength)
    this.freqIndxArr = new Array(VisLength).fill(0).map((val, indx)=>indx*stepSize)

    this.analyser.fftSize = fftLength

    let bufferLength = this.analyser.frequencyBinCount
    this.freqArr = new Uint8Array(bufferLength)

    this.audioContext.resume()
    this.setState({animate: !this.state.animate},()=>this.animate())
  }

  animate(){
    if(this.state.animate){
      requestAnimationFrame(this.animate)
    }

    if(this.freqArr.length >= this.freqIndxArr[this.freqIndxArr.length-1]){
      this.analyser.getByteFrequencyData(this.freqArr)

      let meshs = Object.values(this.state.models)
      meshs.forEach((mesh, indx)=>{
        mesh.rotation.y += 0.01
  
        let scalefactor = this.freqArr[this.freqIndxArr[indx]]/100
        mesh.scale.y = 0.3 + scalefactor
        mesh.position.y = scalefactor/2*2
      })
    }
  }

  render(){
    return(
      <div className="audioVisualiser">
        <input ref={this.audioInputRef} type="file" id="audioInput" accept="audio/*" />
        <audio id="audio" controls></audio>
        <div className="threeContent"
          style={{
            marginTop:"5vh",
            width: "100vw",
            height: "80vh"
          }}>
          <ThreeCanvas
            startAnimate={this.props.startAnimate}
            zoom={70}
            models={[
              {
                modelFile: Cube,
                name: "cube",
                quantity: VisLength,
                scale: 0.3,
              }
            ]}
            updateModelList={(models)=>this.setState({models})}
          />
        </div>
      </div>
    )
  }
}