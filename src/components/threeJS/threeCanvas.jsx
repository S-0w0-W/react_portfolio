import React from "react";
import * as THREE from "three";
import { GLTFLoader, Raycaster, OrbitControls, FlakesTexture, RGBELoader } from 'three-stdlib';
// import { RenderPass } from "three-stdlib";
// import { EffectComposer } from "three-stdlib";
// import { UnrealBloomPass } from "three-stdlib";

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

    // this.renderPass= null
    // this.composer= null
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
    this.state.camera.position.set(this.props.cameraPos.x, this.props.cameraPos.y, this.props.cameraPos.z)

    // this.renderPass = new RenderPass(this.state.scene, this.state.camera)
    // this.composer = new EffectComposer(this.state.renderer)
    // this.composer.addPass(this.renderPass)

    // let bloomPass = new UnrealBloomPass(
    //   new THREE.Vector2(width, height),
    //   1.6,
    //   0.1,
    //   0.1
    // )
    // bloomPass.strength = 0.5
    // this.composer.addPass(bloomPass)

    this.state.controls = new OrbitControls(this.state.camera, this.state.renderer.domElement)
    this.state.controls.enableRotate = this.props.enableControl;
    this.state.controls.enableZoom = this.props.enableControl;
    this.state.controls.enablePan = this.props.enableControl;
    
    let pointlight =  new THREE.PointLight(0xffffff, 1)
    pointlight.position.set(50, 100, 100)
    this.state.scene.add(pointlight)
    
    this.state.renderer.outputEncoding = THREE.sRGBEncoding
    this.state.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.state.renderer.toneMappingExposure = 1.25

    this.start()
  }

  animate(){
    requestAnimationFrame(this.animate)
    this.state.controls.update()
    this.state.controls.enableDamping = true;
    this.state.renderer.render(this.state.scene, this.state.camera)
    // this.composer.render()
  }

  addModel(name, glbModel, quantity, scale, color = null, mapImg = null){
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
            let displacementMap = null
            if (mapImg){
              displacementMap = new THREE.TextureLoader().load(mapImg);
              displacementMap.encoding = THREE.sRGBEncoding
              displacementMap.wrapS = THREE.RepeatWrapping;
              displacementMap.wrapT = THREE.RepeatWrapping;
              displacementMap.repeat.set( 2, 2 );
            }
            const Materialprop = {
              clearcoat: 1.0,
              clearcoatRoughness: 0.1,
              metalness: 1,
              roughness: 0.8,
              color: color,
              map: displacementMap,
            }
            let material = new THREE.MeshPhysicalMaterial(Materialprop);
            object.material = material;
            object.name = name
            this.setState(prevState => {
                let glb = { ...prevState.glb }
                glb[quantity>0 ?name+i :name] = object
                return {
                    glb,
                    root: gltf.scene
                }
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

  start(){
    if (this.props.startAnimate && !this.state.animateCalled){
      this.setState({animateCalled: true}, ()=>{
        this.props.models.map((model)=>{
          this.addModel(model.name, model.modelFile, model.quantity, model.scale, model.color, model.mapImg)
        })
        if(this.props.extras){
          this.props.extras.map((extra)=>{
            this.state.scene.add(extra)
          })
        }
        this.animate()
      })
    }
  }

  componentDidMount(){
    this.init()
  }

  componentDidUpdate(){
    this.start()
  }

  render(){
    return(
      <div id="three" className="threeContainer" ref={this.threeCanvas}/>
    )
  }
}