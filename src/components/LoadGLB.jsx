import React from "react";
import * as THREE from "three";
import { GLTFLoader, Raycaster, OrbitControls, FlakesTexture, RGBELoader } from 'three-stdlib';
import bread from "../assets/models/bread.glb"
import Github from "../assets/models/github_3d_2.glb"
import envMap from "../assets/environmentMaps/studio_small_07_4k.hdr"

export default class LoadGLB extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            renderer: new THREE.WebGLRenderer({ alpha: true, antialias:true }),
            scene: new THREE.Scene(),
            camera: null,
            root: null,
            loader: new GLTFLoader(),
            glb: {},
            mouseX: 0,
            mouseY: 0,
            currX_rot_offset: 180,
            currY_rot_offset: 270,
            insideCanvas: false,
        }
        this.threeCanvas = React.createRef();
        this.handleResize = this.handleResize.bind(this)
        this.addModel = this.addModel.bind(this)
        this.animate = this.animate.bind(this)
        // this.handleMouseMove = this.handleMouseMove.bind(this)
    }

    // mousePosLog(){
    //     document.onmousemove = handleMouseMove
    //     function handleMouseMove(event){
            
    //         this.state.mouseX = event.clientX
    //         this.state.mouseY = event.clientY

    //         console.log()
    //         // this.state.pointer.x = (this.state.mouseX/window.innerWidth) * 2 - 1
    //         // this.state.pointer.y = -1 * (this.state.mouseY/window.innerHeight) * 2 + 1
    //     }
    // }



    init(){
        window.addEventListener('resize', this.handleResize)
        // console.log(this.threeCanvas.current.parentNode.offsetWidth, this.threeCanvas.current.parentNode.offsetHeight)
        let width = this.threeCanvas.current.parentNode.offsetWidth
        let height = this.threeCanvas.current.parentNode.offsetHeight


        this.state.renderer.setSize(width, height)
        this.state.renderer.setPixelRatio(devicePixelRatio)
        this.threeCanvas.current.appendChild(this.state.renderer.domElement)

        this.state.camera = new THREE.PerspectiveCamera(
            50, 
            width/height, 
            0.1, 
            1000
        )
        this.state.camera.position.set(50, 0, 50)

        this.state.controls = new OrbitControls(this.state.camera, this.state.renderer.domElement)

        let pointlight =  new THREE.PointLight(0xffffff, 1)
        pointlight.position.set(100, 0, 0)
        this.state.scene.add(pointlight)
        
        this.state.renderer.outputEncoding = THREE.sRGBEncoding
        this.state.renderer.toneMapping = THREE.ACESFilmicToneMapping
        this.state.renderer.toneMappingExposure = 1.25

        this.addModel('github', Github)

        this.animate()
    }

    animate(){
        requestAnimationFrame(this.animate)
        this.state.controls.update()
        this.state.controls.enableDamping = true;
        this.state.renderer.render(this.state.scene, this.state.camera)

        if (this.props.trackMouse && this.state.insideCanvas){
            let b1, b2, dist1, dist2 = 0
            let width = this.threeCanvas.current.parentNode.offsetWidth
            let height = this.threeCanvas.current.parentNode.offsetHeight
            console.log(width, height)
            // console.log(this.state.mouseX, this.state.mouseY)
            
            for (let model in this.state.glb){
                if (height/2 < this.state.mouseY){
                    // console.log("BOTTOM")
                    b1 = (this.state.mouseY - (height/2))/(height/2)
                    dist1 = b1 * 45
                    this.state.glb[model].rotation.x = (dist1 + this.state.currX_rot_offset) * (Math.PI / 180)
                    
                }else if (height/2 > this.state.mouseY){
                    // console.log("TOP")
                    b1 = ((height/2) - this.state.mouseY)/(height/2)
                    dist1 = b1 * 45 * -1
                    this.state.glb[model].rotation.x = (dist1 + this.state.currX_rot_offset) * (Math.PI / 180)
    
                }
        
                if (width/2 > this.state.mouseX){
                    // console.log("LEFT")
                    b2 = ((width/2) - this.state.mouseX)/(width/2)
                    dist2 = b2 * 45
    
                    this.state.glb[model].rotation.y = (dist2 + this.state.currY_rot_offset) * (Math.PI / 180)
                
                }else if (width/2 < this.state.mouseX){
                    // console.log("RIGHT")
                    b2 = ((width/2) - this.state.mouseX)/(width/2)
                    dist2 = b2 * 45
                    
                    this.state.glb[model].rotation.y = (dist2 + this.state.currY_rot_offset) * (Math.PI / 180)
    
                }
            }
        }
    }
    

    addModel(name, glbModel){
        let THIS = this
        let envMapLoader = new THREE.PMREMGenerator(this.state.renderer)
        console.log(envMapLoader)
        this.state.loader.load(glbModel, (gltf)=>{
            gltf.scene.traverse(function (object){
                console.log(object)

                if ( object instanceof THREE.Mesh ) {

                    new RGBELoader().load(envMap, function(hdrmap){
    
                        let envmap = envMapLoader.fromCubemap(hdrmap)
                        let texture = new THREE.CanvasTexture(new FlakesTexture())
                        texture.wrapS = THREE.RepeatWrapping
                        texture.wrapT = THREE.RepeatWrapping
                        texture.repeat.x = 50
                        texture.repeat.y = 50
                    
                        const Materialprop = {
                            clearcoat: 1.0,
                            cleacoatRoughness: 0.1,
                            metalness: 0.3,
                            roughness: 0.8,
                            color: 0x8418ca,
                            normalMap: texture,
                            // normalScale: new THREE.Vector2(0.05, 0.05),
                            envMap: envmap.texture
                        }
                        
                        let material = new THREE.MeshPhysicalMaterial(Materialprop);
                        object.material = material;
                    })
                    console.log(gltf.scene)
                    THIS.setState(prevState => {
                        let glb = { ...prevState.glb };  // creating  of state variable jasper
                        glb[name] = object  
                        return { 
                            glb,
                            root: gltf.scene
                        }                                 // return new object jasper object
                    }, ()=>{
                        console.log(THIS)
                        THIS.state.root.scale.set(60, 60, 60)
                        THIS.state.root.lookAt(1, 0, 1)
                        THIS.state.scene.add(THIS.state.root)

                        object.rotation.z = 90 * (Math.PI / 180)
                        object.rotation.x = THIS.state.currX_rot_offset * (Math.PI / 180)
                        object.rotation.y = THIS.state.currY_rot_offset * (Math.PI / 180)
                    })

                    // object.rotation.z = 90 * (Math.PI / 180)
                    // object.rotation.x = THIS.state.currX_rot_offset * (Math.PI / 180)
                    // object.rotation.y = THIS.state.currY_rot_offset * (Math.PI / 180)
                }
            })
        })
    }

    handleResize(){

    }
    

    componentDidMount(){
        this.init()
        let THIS = this
        document.addEventListener('mousemove', e=>{
            // console.log(e.offsetX, e.offsetY)
            // let div = this.threeCanvas.current.parentNode.offset()
            // console.log(THIS.threeCanvas.current.parentNode)
            console.log(THIS.threeCanvas.current.parentNode.offsetTop, THIS.threeCanvas.current.parentNode.offsetLeft)
            if (THIS.state.insideCanvas){
                this.setState({
                    mouseX: e.offsetX ,
                    mouseY: e.offsetY 
                })
            }
        })

        this.threeCanvas.current.parentNode.addEventListener("mouseenter", ()=>{
            console.log('in canvas')
            THIS.setState({insideCanvas: true})
        })
        this.threeCanvas.current.parentNode.addEventListener("mouseleave", ()=>{
            console.log('out canvas')
            THIS.setState({insideCanvas: false})

        })
    }

    componentDidUpdate(){
        // console.log(this.props.parentDivWidth, this.props.parentDivHeight)
        // console.log(this.threeCanvas.current.parentNode.offsetHeight, this.threeCanvas.current.parentNode.offsetWidth)
    }

    render(){
        return(
            <div id="three" className="threeContainer" ref={this.threeCanvas}>

            </div>
        )
    }

}