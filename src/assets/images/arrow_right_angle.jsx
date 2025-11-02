import React from "react";
import anime from 'animejs/lib/anime.es.js';

export default class ArrowSvg extends React.Component{
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount(){
    this.animation = anime({
      targets: '#arrow_right_angle path',
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 1000,
      direction: 'alternate',
      delay: function(el, i) { return i * 250 },
      loop: false,
      loopComplete: () => {
        this.animation.reverse()
      }
    })
    if(this.props.pageOverlap < 0.5){
      this.animation.reverse()
    }
  }

  componentDidUpdate(prevProps){
    if(this.props.pageOverlap > 0.9 && prevProps.pageOverlap <= 0.9){
      this.animation.play()
    }

    if(this.props.pageOverlap < 0.5 && prevProps.pageOverlap >= 0.5){
      this.animation.play()
    }
  }

  render() {
    return(
      <svg
        viewBox="0 0 500 500"
        id="arrow_right_angle"
        style={{
          fill: 'none', 
          stroke: 'white',
          strokeWidth: '10px',
          width: '100%',
          height: 'auto',
        }}
      >
        <g>
          <path d="M351.689,201.729c-0.612-46.512-6.732-95.472-18.972-140.76c-3.061-9.792-17.748-6.12-15.301,4.284
            c9.792,40.392,15.912,81.396,17.748,123.013c1.837,41.615,2.448,97.308-27.54,129.743c-15.3,16.524-42.84,15.912-63.647,17.137
            c-30.601,1.836-61.812,1.224-92.412-0.612c-30.6-1.224-61.812-4.284-92.412-7.956c-16.524-1.836-43.452-11.016-58.14-3.06
            c-1.224,0.611-1.224,2.447-0.612,3.06c11.016,14.076,42.228,13.464,58.752,15.912c36.72,4.896,72.828,7.344,109.548,9.18
            c44.675,1.836,114.443,11.017,149.939-22.644C351.077,299.649,351.689,242.121,351.689,201.729z"/>
          <path d="M338.225,8.949c-4.284-6.12-11.628-4.896-14.688,1.836c-8.567,20.808-22.031,39.78-30.6,60.588
            c-2.448,6.12,6.732,9.18,9.792,4.284c9.792-15.912,18.972-31.824,28.764-47.736c2.448,4.896,4.896,9.792,7.345,14.688
            c3.06,7.956,3.672,15.912,7.344,23.256c2.447,5.508,9.792,3.06,11.628-1.224C363.929,47.505,348.017,23.025,338.225,8.949z"/>
        </g>
      </svg>
    )
  }
}