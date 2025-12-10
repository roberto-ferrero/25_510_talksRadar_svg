import gsap from "gsap"
import * as THREE from 'three'

import EasedOutValue from "../../core/utils/EasedOutValue"

import StageSuper from '../StageSuper'

import StageCamera from "./StageCamera"
import Scenario3D from "./Scenario3D/Scenario3D"


class FlipGalleryStage extends StageSuper{
    // this.app.project.stage
    constructor (obj){
        // console.log("(FlipGalleryStage.CONSTRUCTORA): ", obj)
        // console.log(THREE.REVISION);
        super(obj)
        //-------------------
        this.START_REQUESTED = true
        this.STARTED = false
        this.PRE_BUILT = false 
        //-------------------
        this.MOBILE_MODE = this.app.data.mobileMode
        this.STAGE_SIZE = this.app.size.CURRENT
        this.PROGRESS = 0
        this.TEXT_ID = "inside"
        this.DEV_MODE = false // Con true las posiciones de OXSET_X se manejas con el GUI
        //-------------------
        // this.ARRAY_IMGS = ["img1.jpg", "img2.jpg", "img3.jpg", "img4.jpg", "img5.jpg", "img6.jpg", "img7.jpg"]
        this.ARRAY_IMGS = this.app.data.items
        this.MOUSE_PAN_FACTOR_EASED = new EasedOutValue(1, 0.05, 0.005, this.app.emitter, "onUpdateRAF")
        //--------------------
        //this.background_color = [ 246, 246, 246, 1 ]
        //const newColor = new THREE.Color(this.background_color[0]/255, this.background_color[1]/255, this.background_color[2]/255)
        //this.app.render.renderer.setClearColor(newColor, 1)
        // this.app.render.renderer.outputEncoding = THREE.sRGBEncoding
        this.app.render.renderer.toneMapping = THREE.NoToneMapping;
        // this.scene.fog = new THREE.Fog(0x000000, 3, 6);
        //---------------------
        // BASIC STRUCTURE:
        this.world3D = new THREE.Object3D()
        this.world3D.name = "world3D"
        this.scene.name = "stage_scene"
        this.scene.add(this.world3D)
        //------------------------
        // CAMERA:
        this.stageCamera = new StageCamera({
            app:this.app,
            project:this.project,
            stage:this,
            parent3D:this.world3D
        })
        //------------------------
        if(!this.app.USE_RENDER_PLANE){
           this.app.render.set_stageCamera(this.stageCamera.camera)
        }
        //---------------------
        // LOADING MANIFEST:
        this.loader.add_gltf("scene", this.app.loader_pathPrefix+"glbs/stephouse_flipGallery_3js.glb", true)
        // this.loader.add_gltf("scene", this.app.loader_pathPrefix+"glbs/stephouse_scene.glb", true)
        // this.loader.add_texture("forward", this.app.loader_pathPrefix+"img/text_forward.jpg", true)
        // this.loader.add_texture("inside", this.app.loader_pathPrefix+"img/text_inside.jpg", true)
        // this.loader.add_texture("grow", this.app.loader_pathPrefix+"img/text_grow.jpg", true)
        // this.loader.add_texture("petals9", this.app.loader_pathPrefix+"img/petals9_white.png", true)
        //--
            const texture_config = {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.NearestFilter,
                anisotropy: this.app.render.renderer.capabilities.getMaxAnisotropy(),
                // encoding: THREE.sRGBEncoding,
                generateMipmaps: true,
                mapping:THREE.UVMapping
            }
        //--
        this.ARRAY_IMGS.map((imgId)=>{
            this.loader.add_texture(imgId, this.app.loader_pathPrefix+"img/"+imgId, true)
        })
        
        //------------------------------
        this.app.emitter.on("onAppScrollUpdate",(e)=>{
            // this.progress.set_GENERAL_PROGRESS(e.scroll.PROGRESS)
        })
        //------------------------------
        this.app.dev.gui?.add(this, 'PROGRESS', 0, 1.0, 0.001).name('PROGRESS').onChange(value => {
            // You can update the 3D positions or do something with the new value
            
        })
    }
    //----------------------------------------------
    // INTERNAL:
    init(){ // Called by ProjectSuper
        // console.log("(FlipGalleryStage.init)!");
        // console.log("(FlipGalleryStage.init): "+this.id)
        this.stageCamera.init()
    }
    build(){
        // console.log("(FlipGalleryStage.build)!");
        this.GLB_PROJECT = this.loader.get_gltf("scene")
        // console.log("this.GLB_PROJECT: ", this.GLB_PROJECT);
        this.stageCamera.build(this.GLB_PROJECT)
        //-------------------   
        this.axis_helper = new THREE.AxesHelper( 100 )
        this.scene.add(this.axis_helper)
        this.app.register_helper(this.axis_helper)
        //--
        this.gridHelper = new THREE.GridHelper( 100, 10 );
        this.scene.add( this.gridHelper );
        this.app.register_helper(this.gridHelper)
        //------------------- 


        //------------------- 
        this.stephouseScene = new Scenario3D({
            app:this.app,
            project:this.project,
            stage:this,
            parent3D:this.world3D
        })

        //------------------- 


        //------------------- 
        this.app.emitter.on("onAppScrollUpdate",(e)=>{
            if(e.id == "scroll_main"){
                // this.stageCamera.set_PROGRESS(e.scroll.PROGRESS)
            }
        })
        
        //-------------------   
        this.BUILT2 = true
        //-------------------   
        this.eval_start()
        //this.start()
    }

    request_start(){ // Called from app
        this.START_REQUESTED = true
        this.eval_start()
    }
    eval_start(){
        if(this.BUILT && this.START_REQUESTED && !this.STARTED){
            this.STARTED = true
            this.start()
        }
    }
    start(){
        // console.log("(FlipGalleryStage.start)! <-----------------------------------------"+this.STARTED);
        this.stageCamera.start()
        // this.stageCamera.animateStateFromTo("camera0", "camera1", 2)
        // this.stageCamera.animateTargetFromTo("target0", "target1", 2)
    }
    //----------------------------------------------
    // PUBLIC API:
    advance(){
        // console.log("(FlipGalleryStage.start)!");
        this.stephouseScene.gallery.advance()
    }
    rewind(){
        // console.log("(FlipGalleryStage.rewind)!");
        this.stephouseScene.gallery.rewind()
    }
    //----------------------------------------------
    // INTERNAL:
    get_mesh_from_GLB_PROJECT(meshId){
        // console.log("_extract_mesh_from_GLB_PROJECT: ", meshId);
        const mesh = this.GLB_PROJECT.children.find((mesh)=>{
            const result = mesh.name == meshId
            return result
        })

        // if(mesh?.type == "Group"){ // DOC: Algunas veces la exportación de Blender genera un grupo en vez de un mesh. La posicion es del group y de la copiamos al mesh
        // // if(result){ // DOC: Algunas veces la exportación de Blender genera un grupo en vez de un mesh. La posicion es del group y de la copiamos al mesh
        //     const position = mesh.position
        //     // console.log("!!!");
        //     // console.log("   mesh: ", mesh);
        //     const itemMesh = mesh.children[0]
        //     itemMesh.position.set(position.x, position.y, position.z)
        //     return itemMesh.clone()
        // }
        // }
        return mesh.clone()
    }
    //----------------------------------------------
    // UPDATES:
    update_RAF(){
        if(this.STARTED){
            this.stageCamera?.update_RAF()
            this.stephouseScene?.update_RAF()
        }
    }
    //----------------------------------------------
    // PRIVATE:
    _reconfigure_renderer(){

    }
    //----------------------------------------------
    // AUX:


}
export default FlipGalleryStage
