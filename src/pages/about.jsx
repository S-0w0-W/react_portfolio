import React from "react";
import "../css/_landing.scss"
import "../css/_about.scss"
import AOS from 'aos';
import "aos/dist/aos.css";

export default class About extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      threeCanvasWidth: 0,
      threeCanvasHeight: 0,

    }
    this.threeCanvas = React.createRef();
    this.handleResize = this.handleResize.bind(this)
  }

  componentDidMount(){
    AOS.init()
    window.addEventListener('resize', this.handleResize)
  }

  componentDidUpdate(){
    // console.log(this.props.start)
  }

  handleResize(){
    // console.log(this.threeCanvas.current.clientWidth, this.threeCanvas.current.clientHeight)
  }

  render(){
    return(
      <div className="landing_page">
        <div className="background">
            <div className="modal">
                <div className="landing_page_content">
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