import React from "react";
import "../css/_landing.scss"
import Navigation from "../components/navBar"
import AOS from 'aos';
import "aos/dist/aos.css";
// import SignatureIcon from '../assets/images/signature'
import anime from 'animejs/lib/anime.es.js';
import SignatureSvg from '../assets/images/signature'

export default class Landing extends React.Component{
  constructor(props) {
    super(props);
    this.state = {

    }

  }

  handleSig(svgDuration){
    anime({
      targets: '#signature path',
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: svgDuration,
      delay: function(el, i) { return i * 250 },
      direction: 'alternate',
      loop: false
    })
  }

  componentDidMount(){
    let svgDuration = 1000
    this.handleSig(svgDuration)
    setTimeout(() => {
      this.props.startThree()
    }, (svgDuration+500));
  }

  render(){
    return(
      <div className="landing_page">
        <div className="background">
            <div className="modal">
                <div className="landing_page_content">
                    <div className="signature_container">
                      <SignatureSvg/>
                    </div>
                    <div  className="landing_title"  
                          data-aos="fade-up"
                          data-aos-duration="800">
                            Shiyao Wang
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