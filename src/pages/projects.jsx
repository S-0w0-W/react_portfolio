import React from "react";
import "../css/_landing.scss"
import "../css/_projects.scss"
import LoadGLB from "../components/LoadGLB";
import ThreeCanvas from "../components/threeJS/threeCanvas";
// import { Canvas } from "@react-three/fiber";
// import { Environment, OrbitControls, useFBX } from "@react-three/drei";
// import bread from "../assets/models/bread.glb"
import ModelGithub from "../assets/models/github_3d_2.glb"
import Cube from "../assets/models/rounded_cube.glb"
import AudioVisualiser from "../components/audioVis";
import {Observe} from  "./utils/observe";
import {projectList} from "../assets/pageContents/projects/projectList"

export default class Projects extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      models:null,
      typeTimes: projectList.map(()=>false),
      draw: false,
    }
    this.state.models = [
      {modelFile: ModelGithub, name: "ModelGithub"}
    ]
    // this.ThreeCanvasRef = new React.createRef()
  }

  componentDidMount(){
    let handleIntersect = (entries)=>{
      entries.forEach((entry)=>{
        this.props.trackpage(entry.intersectionRatio)
      })
    }
    Observe("#projects_container", 20, handleIntersect)

    Object.values(projectList).forEach((project, index) => {
      let handleTyping = (entries)=>{
        entries.forEach((entry)=>{
          if (entry.intersectionRatio > 0.8){
            setTimeout(() => {
              let typeTimes = [...this.state.typeTimes]
              typeTimes[index] = true
              this.setState({typeTimes})
            }, 500 + index*250)
          }
        })
      }
      Observe(`#project_${index}`, 20, handleTyping)
    })
    console.log(this.state.typeTimes)

    setTimeout(() => {
      this.setState({draw: true})
    }, 500)
  }

  render(){
    return(
      <div id="projects_container"  className="landing_page projects">
        <div className="background">
          <div className="modal">
            <div className="projects_page_content" id="page_project">
              {this.state.draw &&
                <div className="threeContent">
                  <ThreeCanvas
                    id = 'ThreeCanvas'
                    startAnimate={this.props.start}
                    zoom={70}
                    models={[
                      {
                        modelFile: Cube,
                        name: "cube",
                        quantity: 1,
                        scale: 1,
                      }
                    ]}
                    updateModelList={(models)=>this.setState({models}, ()=>console.log(this.state.models))}
                  />
                </div>
              }
              
              {/* <AudioVisualiser
                startAnimate={this.props.start}
              /> */}
              <div  className="landing_title"
                data-aos="fade-up"
                data-aos-duration="800">
                  Projects
              </div>
              <div className="projects">
                {projectList.map((project, index)=>(
                  <div id={`project_${index}`}>
                    {this.state.typeTimes[index] && <div data-aos="flip-left" data-aos-duration="800">
                      <div className="typewriter">
                        <h1>{`${project.name}:`}</h1>
                      </div>
                      <div className="projectCard_container">
                        {/* TODO: parallax card css */}
                        <div className="projectCard"> 
                          <div className="projectPeriod">{project.timePeriod}</div>
                          <div className="projectDesc">
                            {project.description}
                          </div>
                        </div>
                      </div>
                    </div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}