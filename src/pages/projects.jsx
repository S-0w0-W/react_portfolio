import React from "react";
import "../css/_landing.scss"
import AOS from 'aos';
import "aos/dist/aos.css";
import LoadGLB from "../components/LoadGLB";

export default class Projects extends React.Component{
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render(){
    return(
      <div id="projects"  className="landing_page">
        <div className="background">
            <div className="modal">
                <LoadGLB
                  trackMouse={true}
                  startAnimate={this.props.start}
                />
                <div className="landing_page_content">
                    <div  className="landing_title"  
                          data-aos="fade-up"
                          data-aos-duration="800">
                            Projects
                    </div>
                    
                    {/* <div className="threeContent" 
                      ref={this.threeCanvas} 
                      style={{
                        marginTop:"5vh",
                        width: "100vw",
                        height: "80vh"
                      }}>
                      <LoadGLB
                        trackMouse={true}
                        startAnimate={this.props.start}
                      />
                    </div> */}
                </div>
            </div>
        </div>
      </div>
    )
  }
}