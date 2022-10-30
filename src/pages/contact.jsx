import React from "react";
import "../css/_base.scss"
import "../css/_contact.scss"
import {Observe} from  "./utils/observe";
import * as THREE from "three";
import { Reflector } from 'three/examples/jsm/objects/Reflector'

export default class Contact extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      clipboardText: '',
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

  placeMirror(xRot = 0, yRot = 0, zRot = 0, xPos = 0, yPos = 0, zPos = 0){
    let scale = 2
    let mirror = new Reflector(
        new THREE.PlaneBufferGeometry(50 * scale, 50 * scale),
        {
            color: new THREE.Color(0x7f7f7f),
            textureWidth: window.innerWidth * window.devicePixelRatio,
            textureHeight: window.innerHeight * window.devicePixelRatio
        }
    )
    mirror.position.y = yPos * scale
    mirror.position.z = zPos * scale
    mirror.position.x = xPos * scale
    mirror.rotateY(yRot)
    mirror.rotateX(xRot)
    mirror.rotateZ(zRot)

    return mirror
  }

  render(){
    return(
      <div className="landing_page contact">
        <div className="background">
            <div className="modal">
              <div className="landing_page_content" id="page_contact">
                <div className="divider_container">
                  <div className="divider"></div>
                </div>
                <div className="contact_container">
                  <div className="contact">
                    <div className={`copied_text${this.state.clipboardText!==''?' show':''}`}>
                      {`${this.state.clipboardText} copied to clipboard`}
                    </div>
                    <div className="contact_info_container">
                      <div className="contact_info">
                        <div className="verCenter">
                          <div className="icon contact email"
                            onClick={()=>{
                              this.setState({clipboardText: "Email"},()=>{
                                setTimeout(() => {
                                  this.setState({clipboardText:""})
                                }, (2000))
                              })
                              window.navigator.clipboard.writeText("swangwang2000@gmail.com")
                            }}
                          />
                        </div>
                        <div className="contact_text">
                          swangwang2000@gmail.com
                        </div>
                      </div>
                    </div>
                    <div className="socials">
                      <a href="https://www.linkedin.com/in/shiyao-wang-01b5911b0/" target="_blank">
                        <div className="icon contact linkedin"/>
                      </a>
                      <a href="https://github.com/S-0w0-W?tab=repositories" target="_blank">
                        <div className="icon contact github"/>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    )
  }
}