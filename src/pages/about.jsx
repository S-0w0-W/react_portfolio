import React from "react";
import "../css/_base.scss"
import "../css/_about.scss"
import { Observe } from "./utils/observe";
import cringe from "../assets/images/cringe2.jpg"
import ResumePDF from "../assets/documents/resume.pdf"

import cube from "../assets/models/rounded_cube.glb"
import ThreeCanvas from "../components/threeJS/threeCanvas";
import * as THREE from "three";
import ArrowSvg from "../assets/images/arrowSvg";

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
    }
    this.threeCanvas = React.createRef();
    this.animate = this.animate.bind(this)
    this.timeStamp = 0
    this.intersectionRatio = 0
  }

  componentDidMount() {
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
    return (
      <div className="landing_page about">
        <div className="background" id="page_about">
          <div className="modal">
            <div className="landing_page_content" id="about_content">
              <div className="about_content">
                <div className="profile_pic_container">
                  <div className="profile_pic"
                    onClick={()=>window.open(ResumePDF)}
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
                      <div style={{width:'100px', transform: "scale(-1, -1)"}}>
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
                  Oxygen enjoyer and food enthusiast <br/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}