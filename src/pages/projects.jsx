import React from "react";
import "../css/_landing.scss"
import AOS from 'aos';
import "aos/dist/aos.css";

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
                <div className="landing_page_content">
                    <div  className="landing_title"  
                          data-aos="fade-up"
                          data-aos-duration="800">
                            Projects
                    </div>
                </div>
            </div>
        </div>
      </div>
    )
  }
}