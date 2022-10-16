import React from "react";
import "../css/_landing.scss"
import "../css/_about.scss"
import {Observe} from  "./utils/observe";

export default class About extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      threeCanvasWidth: 0,
      threeCanvasHeight: 0,

      typeTriggers: [],
      test: false,
    }
    this.threeCanvas = React.createRef();
    this.handleResize = this.handleResize.bind(this)
  }

  componentDidMount(){
    window.addEventListener('resize', this.handleResize)

    let handleIntersect = (entries)=>{
      entries.forEach((entry)=>{
        this.props.trackpage(entry.intersectionRatio)
      })
    }
    Observe("#page_about", 20, handleIntersect)

    
  }

  componentDidUpdate(){
    // console.log(this.props.start)
  }

  handleResize(){
    // console.log(this.threeCanvas.current.clientWidth, this.threeCanvas.current.clientHeight)
  }

  render(){
    return(
      <div className="landing_page about">
        <div className="background" id="page_about">
            <div className="modal">
                <div className="landing_page_content" id="about_content">
                  <div  className="landing_title"  
                      data-aos="fade-up"
                      data-aos-duration="800">
                        About
                  </div>
                  
                </div>
            </div>
        </div>
      </div>
    )
  }
}