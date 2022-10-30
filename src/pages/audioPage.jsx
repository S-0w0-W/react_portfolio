import React from "react";
import "../css/_audioPage.scss"
import AudioVisualiser from "../components/audioVis";

export default class AudioVis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  render() {
    return (
      <div className="audioPage_container">
        <AudioVisualiser
          startAnimate={true}
        />
      </div>
    )
  }
}