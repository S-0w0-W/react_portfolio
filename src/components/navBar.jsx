import React from "react";
import "../css/_navBar.scss"
import homeLogo from "../assets/icons/icons8-home-48.png"
import aboutLogo from "../assets/icons/icons8-person-48.png"
import projectsLogo from "../assets/icons/icons8-work-48.png"
import contactLogo from "../assets/icons/icons8-phone-50.png"

export default class Navigation extends React.Component{
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render(){
    return(
        <div className="navigation">
            <div className='nav'>
                <div className='left'>

                </div>
                <div className='right'>
                    <div className="tab_container">
                        <div className="tab" 
                            onClick={()=>{
                            this.props.scrollToRef('landing')
                        }}>
                            <img className="tab_icon"  src={homeLogo} />
                            <div className="tab_text_container">
                                <div className="tab_text">Home</div>
                            </div>
                        </div>
                    </div>
                    <div className="tab_container">
                        <div className="tab" 
                            onClick={()=>{
                            this.props.scrollToRef('about')
                        }}>
                            <img className="tab_icon"  src={aboutLogo} />
                            <div className="tab_text_container">
                                <div className="tab_text">About</div>                         
                            </div>
                        </div>
                    </div>
                    <div className="tab_container">
                        <div className="tab" 
                            onClick={()=>{
                            this.props.scrollToRef('projects')
                        }}>
                            <img className="tab_icon"  src={projectsLogo} />
                            <div className="tab_text_container">
                                <div className="tab_text">Projects</div>
                            </div>
                        </div>
                    </div>
                    <div className="tab_container">
                        <div className="tab" 
                            onClick={()=>{
                            this.props.scrollToRef('contact')
                        }}>
                            <img className="tab_icon"  src={contactLogo} />
                            <div className="tab_text_container">
                                <div className="tab_text">Contact</div>                            
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    )
  }
}