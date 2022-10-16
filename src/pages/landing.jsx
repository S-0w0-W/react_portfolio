import React from "react";
import "../css/_landing.scss"
// import SignatureIcon from '../assets/images/signature'
import anime from 'animejs/lib/anime.es.js';
import SignatureSvg from '../assets/images/signature'
import SignatureSvgEng from '../assets/images/signature_eng'
import {Observe} from  "./utils/observe";

export default class Landing extends React.Component{
  constructor(props) {
    super(props);
    this.state = {

    }

  }

  componentDidMount(){
    let svgDuration = 1000
    setTimeout(() => {
      this.props.startThree()
    }, (svgDuration+500));

    let handleIntersect = (entries)=>{
      entries.forEach((entry)=>{
        this.props.trackpage(entry.intersectionRatio)
      })
    }
    Observe("#page_landing", 20, handleIntersect)
  }

  render(){
    return(
      <div className="landing_page">
        <div className="background">
            <div className="modal">
                <div className="landing_page_content" id="page_landing">
                    <div className="signature_container">
                      {/* <SignatureSvg/> */}
                      <SignatureSvgEng/>
                    </div>
                    <div  className="landing_description"
                          data-aos="fade-up"
                          data-aos-duration="1200">
                            Welcome to my portfolio!
                    </div>
                </div>
            </div>
        </div>
      </div>
    )
  }
}