import React from "react";
import "../css/_base.scss"
import "aos/dist/aos.css";
import ThreeCanvas from "./threeJS/threeCanvas";
import ModelGithub from "../assets/models/github_3d_2.glb"
import ModelAudioVis from "../assets/models/audioVis.glb"
import Cube from "../assets/models/rounded_cube.glb"

const VisLength = 100
const RADIUS = 10

const getRandomPastelRGB = () => {
  // Generate random values for red, green, and blue,
  // ensuring they are in a higher range for lightness (e.g., 180-255)
  // and relatively close to each other for low saturation.
  const r = Math.floor(Math.random() * 76) + 180; // Range 180-255
  const g = Math.floor(Math.random() * 76) + 180; // Range 180-255
  const b = Math.floor(Math.random() * 76) + 180; // Range 180-255

  return {
    r: parseInt(r, 16),
    g: parseInt(g, 16),
    b: parseInt(b, 16)
  }
}

function generateRandomPastelRGB() {
  // Generate a random hue (0-360 degrees)
  const hue = Math.floor(Math.random() * 361);

  // Set saturation and lightness for pastel effect
  // Saturation (s): Low to medium (e.g., 30-70%)
  // Lightness (l): High (e.g., 70-90%)
  const saturation = Math.floor(Math.random() * 41) + 30; // 30-70%
  const lightness = Math.floor(Math.random() * 21) + 70; // 70-90%

  // Convert HSL to RGB
  // This conversion is a common algorithm, adapted here for clarity.
  const h = hue / 360;
  const s = saturation / 100;
  const l = lightness / 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  // Convert to 0-255 range and round
  const red = Math.round(r * 255);
  const green = Math.round(g * 255);
  const blue = Math.round(b * 255);

  return {
    r: parseInt(red, 16),
    g: parseInt(green, 16),
    b: parseInt(blue, 16)
  }
}

export default class AudioVisualiser extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      models:null,
      animate: false,
      audioControls: null,
      url: null,
    }
    this.audioInputRef = new React.createRef()
    this.animate = this.animate.bind(this)
    this.audioContext = new AudioContext()
    this.analyser = this.audioContext.createAnalyser()
    this.freqIndxArr = []
    this.freqArr = []
    this.originalMeshYposArr = []
    this.source = null
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

  componentDidUpdate(prevProps, prevState){
    if(this.state.models !==null && Object.values(this.state.models).length >=VisLength){
      let meshs = Object.values(this.state.models)
      // set color
      let from = this.HexToRGB('#C53459')
      let to = this.HexToRGB('#EE9C3F')

      let rStep = Math.round(((from.r-to.r)/meshs.length))
      let gStep = Math.round(((from.g-to.g)/meshs.length))
      let bStep = Math.round(((from.b-to.b)/meshs.length))

      meshs.forEach((mesh, indx)=>{
        mesh.position.set(-29+(indx), 0, 0)
        var angle  = (indx/meshs.length)*360
        var x = RADIUS * Math.cos(Math.PI * 2 * angle / 360)
        var y = RADIUS * Math.sin(Math.PI * 2 * angle / 360)
        mesh.position.x = x
        mesh.position.y = y
        mesh.rotation.z = angle * (Math.PI/180)

        let r = from.r - rStep*indx
        let g = from.g - gStep*indx
        let b = from.b - bStep*indx

        // let {r, g, b} = generateRandomPastelRGB()

        mesh.material.color.setHex(this.RGBToHex(r, g, b))
        this.originalMeshYposArr.push(-29+(indx))
      })
    }

    if(this.props.url != prevProps.url){
      this.handleInputAudio(null, this.props.url)
    }
  }

  handleInputAudio = (e, url = null)=>{
    let audioFile = e?.target.files[0]

    let audio = document.getElementById("audio")
    audio.crossOrigin = "anonymous"
    audio.src = url || URL.createObjectURL(audioFile)
    audio.load()
    audio.play()
    audio.onended = () => {
      this.props.audioEndedHandler()
    }

    if(!this.state.source){
      this.setState({source: this.audioContext.createMediaElementSource(audio)}, ()=>{
        this.state.source.connect(this.analyser)
        this.state.source.connect(this.audioContext.destination)
      })
    }

    let fftLength = 256
    let stepSize = Math.round((fftLength/2)/VisLength)
    this.freqIndxArr = new Array(VisLength).fill(0).map((val, indx)=>indx*stepSize)

    this.analyser.fftSize = fftLength

    let bufferLength = this.analyser.frequencyBinCount
    this.freqArr = new Uint8Array(bufferLength)

    this.audioContext.resume()
    this.setState({animate: true},()=>this.animate())
  }

  animate(timestamp){
    if(this.state.animate){
      requestAnimationFrame((t)=>this.animate(t))
    }
    if(this.freqArr.length >= this.freqIndxArr[this.freqIndxArr.length-1]){
      this.analyser.getByteFrequencyData(this.freqArr)

      let meshs = Object.values(this.state.models)
      
      meshs.forEach((mesh, indx)=>{
        // mesh.rotation.x += 0.01
        // mesh.rotation.y += 0.01
        // mesh.rotation.z += 0.01
        let scalefactor = this.freqArr[this.freqIndxArr[indx]]/100
        mesh.scale.x = 0.3 + scalefactor

        var angle  = (indx/meshs.length)*360
        var x = (RADIUS+(scalefactor/2*2)) * Math.cos(Math.PI * 2 * angle / 360)
        var y = (RADIUS+(scalefactor/2*2)) * Math.sin(Math.PI * 2 * angle / 360)
        mesh.position.x = x
        mesh.position.y = y
      })
    }
  }

  playAudio = () => {
    if (document.getElementById("audio")) {
      document.getElementById("audio").play()
      this.audioContext.resume()
    }
  }

  render(){
    return(
      <div className="audioVisualiser">
        <input ref={this.audioInputRef} type="file" id="audioInput" accept="audio/*" />
        <audio id="audio" controls 
          onPlay={()=>this.setState({animate: true}, () => this.animate())}
          onPause={()=>this.setState({animate: false})}>
        </audio>
        <div className="threeContent"
          style={{
            marginTop:"5vh",
            width: "100vw",
            height: "80vh"
          }}>
          <ThreeCanvas
            id='ThreeCanvas'
            startAnimate={this.props.startAnimate}
            cameraPos={{x: 0, y: 0, z: 75}}
            enableControl={true}
            models={[
              {
                modelFile: Cube,
                name: "cube1",
                quantity: VisLength,
                scale: 0.3,
                color: null,
                mapImg: null,
              }
            ]}
            updateModelList={(models) => this.setState({ models })}
          />
        </div>
      </div>
    )
  }
}