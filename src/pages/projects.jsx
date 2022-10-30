import React from "react";
import "../css/_base.scss"
import "../css/_projects.scss"
import ThreeCanvas from "../components/threeJS/threeCanvas";
import Cube from "../assets/models/rounded_cube.glb"
import theBoys from "../assets/images/the_boys.jpg"
import { Observe } from "./utils/observe";
import { projectList } from "../assets/pageContents/projects/projectList"
import AudioVis from "../assets/models/audioVis.glb"

export default class Projects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      models: null,
      typeTimes: projectList.map(() => false),
      draw: false,
      inDiv: false,
    }
    this.currDiv = null
    this.projectCardRef = React.createRef()
    this.cardRotateRange = 20
    this.cardBackgroundTranslateRange = 20
    this.updateCount = 1
    this.updateRate = 10
    this.animate = this.animate.bind(this)
    this.timeStamp = 0
  }

  componentDidMount() {
    let handleIntersect = (entries) => {
      entries.forEach((entry) => {
        this.props.trackpage(entry.intersectionRatio)
      })
    }
    Observe("#projects_container", 20, handleIntersect)

    Object.values(projectList).forEach((project, index) => {
      let handleTyping = (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio > 0.8) {
            setTimeout(() => {
              let typeTimes = [...this.state.typeTimes]
              typeTimes[index] = true
              this.setState({ typeTimes })
            }, 500 + index * 250)
          }
        })
      }
      Observe(`#project_${index}`, 20, handleTyping)
    })

    setTimeout(() => {
      this.setState({ draw: true })
    }, 500)

    window.addEventListener('mousemove', (e) => {
      if(this.updateCount===this.updateRate){
        if (this.state.inDiv && e.target){
          let height = this.currDiv.offsetHeight
          let width = this.currDiv.offsetWidth
          let divPosRelToDocTop = this.currDiv.getBoundingClientRect()
          let left = divPosRelToDocTop.left + window.scrollX
          let top = divPosRelToDocTop.top + window.scrollY
          let xPos = e.pageX - left
          let yPos = e.pageY - top
          let xdeg = xPos<width/2 ?-1*((width-2*xPos)/width*this.cardRotateRange) :(2*xPos-width)/width*this.cardRotateRange
          let ydeg = yPos<height/2 ?((height-2*yPos)/height*this.cardRotateRange) :-1*((2*yPos-height)/height*this.cardRotateRange)
          let xbgtrans = xPos<width/2 ?-1*((width-2*xPos)/width*this.cardBackgroundTranslateRange) :(2*xPos-width)/width*this.cardBackgroundTranslateRange
          let ybgtrans = yPos<height/2 ?((height-2*yPos)/height*this.cardBackgroundTranslateRange) :-1*((2*yPos-height)/height*this.cardBackgroundTranslateRange)
          this.currDiv.children[0].style.transform = `rotateY(${xdeg}deg) rotateX(${ydeg}deg)`
          this.currDiv.children[0].style.backgroundPosition = `${50+xbgtrans}% ${50+ybgtrans}%`
          this.currDiv.children[1].style.transform = `rotateY(${xdeg}deg) rotateX(${ydeg}deg)`
          this.currDiv.children[1].style.backgroundPosition = `${50+xbgtrans}% ${50+ybgtrans}%`
        }else if(this.currDiv !== null){
          this.currDiv.children[0].style.transform = "rotateY(0deg) rotateX(0deg)"
          this.currDiv.children[0].style.backgroundPosition = "center"
          this.currDiv.children[1].style.transform = "rotateY(0deg) rotateX(0deg)"
          this.currDiv.children[1].style.backgroundPosition = "center"
        }
        this.updateCount = 0
      }
      this.updateCount += 1
    })

    Array.from(this.projectCardRef.current.children).map((divItem, index) => {
      divItem.children[0].firstChild.addEventListener('mouseenter', (e) => {
        e.stopPropagation()
        this.setState({inDiv: true}, ()=>{
          this.currDiv = divItem.children[0].firstChild
        })
      })
      divItem.children[0].firstChild.addEventListener('mouseleave', (e) => {
        e.stopPropagation()
        this.setState({inDiv: false})
      })
    })

    this.animate()
  }

  animate() {
    requestAnimationFrame(this.animate)
    if (this.state.models !== null) {
      // orbit control vars
      let rad = 0
      let XYdivision = 8
      // changes depending on orbit obj
      let divisionProportion = 0
      let delay = 0
      Object.values(this.state.models).forEach(model => {
        if (model.name === "github") {
          model.rotation.y -= 0.01
          model.rotation.x = Math.PI
          model.position.y = 10
        } else if (model.name === "cube1") {
          model.rotation.y += 0.01
          model.rotation.x += 0.01

          divisionProportion = 4
          delay = 1
          rad = 15
          model.position.x = rad * Math.cos(2 * Math.PI / XYdivision * divisionProportion) * Math.sin(this.timeStamp + delay)
          model.position.y = rad * Math.sin(2 * Math.PI / XYdivision * divisionProportion) * Math.sin(this.timeStamp + delay)
          model.position.z = rad * Math.cos(this.timeStamp + delay)
        } else if (model.name === "cube2") {
          model.rotation.y += 0.01
          model.rotation.x += 0.01

          divisionProportion = 4
          delay = 3
          rad = 20
          model.position.x = rad * Math.cos(2 * Math.PI / XYdivision * divisionProportion) * Math.sin(this.timeStamp + delay)
          model.position.y = rad * Math.sin(2 * Math.PI / XYdivision * divisionProportion) * Math.sin(this.timeStamp + delay)
          model.position.z = rad * Math.cos(this.timeStamp + delay)
        } else if (model.name === "cube3") {
          model.rotation.y += 0.01
          model.rotation.x += 0.01

          divisionProportion = 4
          delay = 10
          rad = 25
          model.position.x = rad * Math.cos(2 * Math.PI / XYdivision * divisionProportion) * Math.sin(this.timeStamp + delay)
          model.position.y = rad * Math.sin(2 * Math.PI / XYdivision * divisionProportion) * Math.sin(this.timeStamp + delay)
          model.position.z = rad * Math.cos(this.timeStamp + delay)
        } else if (model.name === "cube4") {
          model.rotation.y += 0.01
          model.rotation.x += 0.01

          divisionProportion = 4
          delay = 2
          rad = 30
          model.position.x = rad * Math.cos(2 * Math.PI / XYdivision * divisionProportion) * Math.sin(this.timeStamp + delay)
          model.position.y = rad * Math.sin(2 * Math.PI / XYdivision * divisionProportion) * Math.sin(this.timeStamp + delay)
          model.position.z = rad * Math.cos(this.timeStamp + delay)
        }
      })
    }
    this.timeStamp += 0.01
  }

  render() {
    return (
      <div id="projects_container" className="landing_page projects">
        <div className="background">
          <div className="modal">
            <div className="projects_page_content" id="page_project">
              <div className="threeContent">
                <ThreeCanvas
                  id='ThreeCanvas'
                  startAnimate={this.props.start}
                  cameraPos={{x: 80, y: -50, z: 0.8}}
                  enableControl={false}
                  models={[
                    {
                      modelFile: AudioVis,
                      name: "github",
                      quantity: 1,
                      scale: 1,
                      color: 0x05314d,
                      mapImg: null,
                    },
                    {
                      modelFile: Cube,
                      name: "cube1",
                      quantity: 1,
                      scale: 1.8,
                      color: null,
                      mapImg: theBoys,
                    },
                    {
                      modelFile: Cube,
                      name: "cube2",
                      quantity: 1,
                      scale: 1.8,
                      color: null,
                      mapImg: theBoys,
                    },
                    {
                      modelFile: Cube,
                      name: "cube3",
                      quantity: 1,
                      scale: 1.8,
                      color: null,
                      mapImg: theBoys,
                    },
                    {
                      modelFile: Cube,
                      name: "cube4",
                      quantity: 1,
                      scale: 1.8,
                      color: null,
                      mapImg: theBoys,
                    }
                  ]}
                  updateModelList={(models) => this.setState({ models })}
                />
              </div>
              <div className="projects" ref={this.projectCardRef}>
                {projectList.map((project, index) => (
                  <div id={`project_${index}`}>
                    <div className="projectCard_container">
                      <div className="projectCard_hoverarea">
                        <div className="img_container"/>
                        <div className='projectCard' id={`projectCard_${index}`}>
                          <div className="projectTitle">{`${project.name}:`}</div>
                          <div className="projectPeriod">{project.timePeriod}</div>
                        </div>
                      </div>
                    </div>
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