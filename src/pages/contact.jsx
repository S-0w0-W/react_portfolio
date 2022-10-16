import React from "react";
import "../css/_landing.scss"
import "../css/_contact.scss"
import {Observe} from  "./utils/observe";
import AudioVisualiser from "../components/audioVis";

export default class Contact extends React.Component{
  constructor(props) {
    super(props);
    this.state = {

    }

  }

  componentDidMount(){
    let handleIntersect = (entries)=>{
      entries.forEach((entry)=>{
        this.props.trackpage(entry.intersectionRatio)
      })
    }
    Observe("#page_contact", 20, handleIntersect)
  }

  render(){
    return(
      <div className="landing_page contact">
        <div className="background">
            <div className="modal">
                <div className="landing_page_content" id="page_contact">
                    <div  className="landing_title"  
                          data-aos="fade-up"
                          data-aos-duration="800">
                            Contact
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