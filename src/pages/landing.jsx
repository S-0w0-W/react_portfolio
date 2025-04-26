import React from "react";
import "../css/_base.scss"
import SignatureSvgEng from '../assets/images/signature_eng'
import { Observe } from "./utils/observe";

export default class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawSig: false,
      displayMenu: false,
      displayBotText: false,
    }
    this.svgDuration = 900
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({drawSig:true})
    }, (1500))

    setTimeout(() => {
      this.props.startThree()
    }, (this.svgDuration + 500))

    let handleIntersect = (entries) => {
      entries.forEach((entry) => {
        this.props.trackpage(entry.intersectionRatio)
      })
    }
    Observe("#page_landing", 20, handleIntersect)
  }

  componentDidUpdate(){
    if (this.state.displayMenu){
      this.setState({displayMenu:false})
      this.props.handleDisplayNav()
    }
  }

  render() {
    return (
      <div className="landing_page">
        <div className="background">
          <div className="modal">
            <div className="landing_page_content" id="page_landing">
              <div className="typewriter_container landing_text">
                <div className="typewriter">
                  <p>Hi 👋, my name is </p>
                </div>
              </div>
              <div className="signature_container">
                {this.state.drawSig &&
                  <SignatureSvgEng
                    duration={this.svgDuration}
                    height={'50vh'}
                    done={()=>this.setState({displayMenu:true, displayBotText:true})}
                  />
                }
              </div>
              {this.state.displayBotText &&
                <div className="landing_description"
                  data-aos="fade-up"
                  data-aos-duration="1200">
                  Welcome to my site!
              </div>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}