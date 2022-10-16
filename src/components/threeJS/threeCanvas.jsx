import React from "react";
import * as THREE from "three";
import { GLTFLoader, Raycaster, OrbitControls, FlakesTexture, RGBELoader } from 'three-stdlib';
import envMap from "../../assets/environmentMaps/fireplace_4k.hdr"

export default class ThreeCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderer: new THREE.WebGLRenderer({ alpha: true, antialias:true }),
      scene: new THREE.Scene(),
      camera: null,
      root: null,
      loader: new GLTFLoader(),
      glb: {},
      animateCalled: false,
    }
    this.threeCanvas = React.createRef();
    this.addModel = this.addModel.bind(this)
    this.animate = this.animate.bind(this)
  }

  init(){
    let width = this.threeCanvas.current.parentNode.offsetWidth
    let height = this.threeCanvas.current.parentNode.offsetHeight


    this.state.renderer.setSize(width, height)
    this.state.renderer.setPixelRatio(devicePixelRatio)
    this.threeCanvas.current.appendChild(this.state.renderer.domElement)

    this.state.camera = new THREE.PerspectiveCamera(
      30, 
      width/height, 
      0.1, 
      1000
    )
    this.state.camera.position.set(0, 0, this.props.zoom)

    this.state.controls = new OrbitControls(this.state.camera, this.state.renderer.domElement)
    // this.state.controls.enableRotate = false;
    this.state.controls.enableZoom = false;
    // this.state.controls.enablePan = false;
    
    let pointlight =  new THREE.PointLight(0xffffff, 1)
    pointlight.position.set(100, 100, 100)
    this.state.scene.add(pointlight)
    
    this.state.renderer.outputEncoding = THREE.sRGBEncoding
    this.state.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.state.renderer.toneMappingExposure = 1.25
  }

  animate(){
    requestAnimationFrame(this.animate)
    this.state.controls.update()
    this.state.controls.enableDamping = true;
    this.state.renderer.render(this.state.scene, this.state.camera)
  }

  addModel(name, glbModel, quantity, scale){
    let THIS = this
    let envMapLoader = new THREE.PMREMGenerator(this.state.renderer)
    for(let i=0; i<quantity; i++){
      this.state.loader.load(glbModel, (gltf)=>{
        gltf.scene.traverse((object)=>{
          if ( object instanceof THREE.Mesh ) {
            // new RGBELoader().load(envMap, (hdrmap)=>{
            //   let envmap = envMapLoader.fromCubemap(hdrmap)
            //   let texture = new THREE.CanvasTexture(new FlakesTexture())
            //   texture.wrapS = THREE.RepeatWrapping
            //   texture.wrapT = THREE.RepeatWrapping
            //   texture.repeat.x = 50
            //   texture.repeat.y = 50
  
            //   const Materialprop = {
            //     clearcoat: 1.0,
            //     cleacoatRoughness: 0.1,
            //     metalness: 0.3,
            //     roughness: 0.8,
            //     color: 0x5a2c40,
            //     normalMap: texture,
            //     // normalScale: new THREE.Vector2(0.05, 0.05),
            //     envMap: envmap.texture
            //   }
            //   let material = new THREE.MeshPhysicalMaterial(Materialprop);
            //   object.material = material;
            // })
            const Materialprop = {
              clearcoat: 1.0,
              cleacoatRoughness: 0.1,
              metalness: 1,
              roughness: 0.8,
              color: 0x5a2c40,
            }
            let material = new THREE.MeshPhysicalMaterial(Materialprop);
            object.material = material;
            this.setState(prevState => {
                let glb = { ...prevState.glb };  // creating  of state variable jasper
                glb[quantity>0 ?name+i :name] = object  
                return { 
                    glb,
                    root: gltf.scene
                }                                 // return new object jasper object
            }, ()=>{
              object.scale.set(scale, scale, scale)
              this.state.scene.add(object)

              this.props.updateModelList(this.state.glb)
            })
          }
        })
      })
    }
  }

  componentDidMount(){
    this.init()
  }

  componentDidUpdate(){
    if (this.props.startAnimate && !this.state.animateCalled){
      this.setState({animateCalled: true}, ()=>{
        this.props.models.map((model)=>{
          this.addModel(model.name, model.modelFile, model.quantity, model.scale)
        })
        this.animate()
      })
    }
  }

  render(){
    return(
      <div id="three" className="threeContainer" ref={this.threeCanvas}/>
    )
  }

}