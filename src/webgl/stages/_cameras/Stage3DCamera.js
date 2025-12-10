//import gsap from "gsap"
import * as THREE from 'three'
import MeshUtils from '../../core/utils/MeshUtils'

class Stage3DCamera{
    constructor (obj){
        console.log("(Stage3DCamera.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.parent3D = obj.parent3D
        //-----------------------------
        this.INITIALIZED = false
        this.BUILT = false
        //-----------------------------
        //--
        this.camera = new THREE.PerspectiveCamera(20, this.app.size.CURRENT.aspect, 0.1, 2000);
        this.camera.name = "main_camera"
        this.camera.position.set(0, 0, 0)
        //this.camera.lookAt(0, 0, 0)
        //-----------------------------
        this.app.emitter.on("onAppSizeUpdate", ()=>{
            this._update_camera_data()
        })
    }
    //----------------------------------------------
    // PUBLIC:
    init(){
        console.log("(Stage3DCamera.init)!")
        this.INITIALIZED = true
    }
    build(){
        console.log("(Stage3DCamera.build)!")
        this._create_structure()
        this.BUILT = true

       
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:
    _create_structure(){
        this.holder = new THREE.Object3D()
        this.holder.position.set(0, 20, 300)
        //this.holder.position.set(-87, 126, -392)
        // x: -87.54139709472656, y: 126.45600128173828, z: -392.69500732421875
        this.parent3D.add(this.holder)
        //--
        this.looker = new THREE.Object3D()
        this.holder.add(this.looker)
        //--
        this.panX = new THREE.Object3D()
        this.looker.add(this.panX)
        //--
        this.panY = new THREE.Object3D()
        this.panX.add(this.panY)
        //--
        this.panY.add(this.camera)
        //--
        this.lookingTarget = new THREE.Object3D()
        this.lookingTarget.position.set(0, 55, 0)
        this.parent3D.add(this.lookingTarget)

        if(this.app.dev_helpers){
            this.holder_test = MeshUtils.get_sphere(5, 10, 10, 0xffff00)
            this.holder.add(this.holder_test)
            this.app.dev.register_helper(this.holder_test)
            //--
            this.camera_helper = new THREE.CameraHelper( this.camera );
            this.parent3D.add( this.camera_helper );
            this.app.dev.register_helper(this.camera_helper)
            //--
            // --
            // --
            this.holder_helper = MeshUtils.get_box(20, 20, 20, 0xff0000)
            this.holder.add(this.holder_helper)
            this.app.dev.register_helper(this.holder_helper)
            // --
            this.panX_helper = MeshUtils.get_box(10, 20, 10, 0xff0000)
            this.panX.add(this.panX_helper)
            this.app.dev.register_helper(this.panX_helper)
            // --
            this.panY_helper = MeshUtils.get_box(10, 10, 10, 0xff0000)
            this.panY.add(this.panY_helper)
            this.app.dev.register_helper(this.panY_helper)
            // --
            this.lookingTarget_helper = MeshUtils.get_box(10, 10, 10, 0x0000ff)
            this.lookingTarget.add(this.lookingTarget_helper)
            this.app.dev.register_helper(this.lookingTarget_helper)
            
        }
        this._update_camera_data()
    }
    _update_camera_data(){
        this.camera.lookAt(this.lookingTarget.position)
        // this.camera.fov = this.gsap_params.fov
        this.camera.aspect = (this.app.size.CURRENT.width)/this.app.size.CURRENT.height
        this.camera.updateProjectionMatrix();
        if(this.camera_helper) this.camera_helper.update()
    }
    //----------------------------------------------
    // AUX:

  
}
export default Stage3DCamera