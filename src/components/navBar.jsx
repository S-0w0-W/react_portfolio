import React from "react";
import "../css/_navBar.scss"
 
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
                            <div className="tab_icon"/>
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
                            <div className="tab_icon"/>
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
                            <div className="tab_icon"/>
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
                            <div className="tab_icon"/>
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