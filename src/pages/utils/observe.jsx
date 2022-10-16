export function Observe(id, numSteps, callback){
  let boxElement = document.querySelector(id)

  let thresholds = [...Array(numSteps).keys()]
    .map((val)=>val/numSteps + 1/numSteps)
  let options = {
    root: null,
    rootMargin: "0px",
    threshold: thresholds
  }

  let observer = new IntersectionObserver(callback, options)
  observer.observe(boxElement)
}