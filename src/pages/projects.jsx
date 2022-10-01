import React from "react";
import "../css/_landing.scss"
import AOS from 'aos';
import "aos/dist/aos.css";
import LoadGLB from "../components/LoadGLB";
import ThreeCanvas from "../components/threeJS/threeCanvas";
// import { Canvas } from "@react-three/fiber";
// import { Environment, OrbitControls, useFBX } from "@react-three/drei";
// import bread from "../assets/models/bread.glb"
import ModelGithub from "../assets/models/github_3d_2.glb"
import AudioVisualiser from "../components/audioVis";


export default class Projects extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      models:null
    }
    this.state.models = [
      {modelFile: ModelGithub, name: "ModelGithub"}
    ]
    // this.ThreeCanvasRef = new React.createRef()
  }



  render(){
    return(
      <div id="projects"  className="landing_page">
        <div className="background">
            <div className="modal">
                <div className="landing_page_content">
                    <div  className="landing_title"  
                      data-aos="fade-up"
                      data-aos-duration="800">
                        Projects
                    </div>
                    <AudioVisualiser
                      startAnimate={this.props.start}
                    />
                </div>
            </div>
        </div>
      </div>
    )
  }
}