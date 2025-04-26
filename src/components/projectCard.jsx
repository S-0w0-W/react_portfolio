import React from "react";

export default function ProjectCard({
  title = '',
  description = '',
  imageUrl = '',
  linkUrl = '',
}){

  return(
    <div className="project-card" onClick={()=>window.open(linkUrl)}>
      <div className="projectCard_hoverarea">
        <div className="img_container" style={{backgroundImage: `url(${imageUrl})`}}/>
        <div className='projectCard'>
          <div className="projectTitle">{`${title}:`}</div>
          <div className="projectDesc">{description}</div>
        </div>
      </div>
    </div>
  )
}