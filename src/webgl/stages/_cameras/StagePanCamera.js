//import gsap from "gsap"
import * as THREE from 'three'
import MeshUtils from '../../core/utils/MeshUtils'

class StageCamera{
    constructor (obj){
        console.log("(StageCamera.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.parent3D = obj.parent3D
        //-----------------------------
        this.INITIALIZED = false
        this.BUILT = false
        this.PAN_FACTOR = 1
        //-----------------------------
        this.gsap_params = {
            control:0,
            fov_base: 20,
            fov_factor: 2,
            panX: 5,
            panY: 5,
            azimuth_arch: [-2*Math.PI*0.25, 2*Math.PI*0.25],
            elevation_arch: [-2*Math.PI*0.25, 2*Math.PI*0.25],
        }
        //-----------------------------
        this.lookingTarget_base = new THREE.Vector3(0, 0, 0)
        //-----------------------------
        this.camera = new THREE.PerspectiveCamera(20, this.app.size.CURRENT.aspect, 0.1, 1300);
        this.camera.name = "main_camera"
        //-----------------------------
        
    }
    //----------------------------------------------
    // PUBLIC:
    init(){
        console.log("(StageCamera.init)!")
        this.INITIALIZED = true
    }
    build(){
        console.log("(StageCamera.build)!")
        this._create_structure()
        //--
        this.BUILT = true

       
    }
    configure_camera(camera_placer, target_placer){
        console.log("(StageCamera.configure_camera) camera_placer: ", camera_placer, " target_placer: ", target_placer)
        this.lookingTarget_base.copy(target_placer.position)
        this.holder.position.copy(camera_placer.position)
        this.lookingTarget.position.copy(target_placer.position)
        this._update_camera_data()
    }
    update_RAF(){
        this._update_camera_data()
        this._update_pan()
        //this._update_panY()
    }
    get_position(){
        return this.holder.position
    }
    get_targetPosition(){
        return this.lookingTarget.position
    }
    //----------------------------------------------
    // EVENTS:
    _update_pan(){
        let fov_incr = this.app.mouse.POSITION2_EASED.y.get()*this.gsap_params.fov_factor
        //eased_x = Math.abs((eased_x - 0.5)*2)
        const posX = this.app.mouse.POSITION2_EASED.x.get()*this.gsap_params.panX *this.PAN_FACTOR*0
        const posY = this.app.mouse.POSITION2_EASED.y.get()*this.gsap_params.panY *this.PAN_FACTOR
        this.lookingTarget.position.set(this.lookingTarget_base.x+posX, this.lookingTarget_base.y+posY, this.lookingTarget_base.z)
        this.camera.fov = this.gsap_params.fov_base-fov_incr
        this.camera.updateProjectionMatrix();
    }
    //----------------------------------------------
    // PRIVATE:
    _create_structure(){
        this.holder = new THREE.Object3D()
        // this.holder.position.set(0, 20, 300)
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
        // this.lookingTarget.position.set(0, 55, 0)
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

    _get_star(_observer, _azimuthX, _elevationY, _distance) {
        /**
         * Calculates the position of a star given an observer's position, azimuth, elevation, and distance.
         * 
         * @param {THREE.Vector3} _observer - The position of the observer.
         * @param {number} _azimuthX - Azimuth angle in radians (rotation around the Y-axis).
         * @param {number} _elevationY - Elevation angle in radians (angle above the XZ-plane).
         * @param {number} _distance - Distance to the star.
         * @returns {THREE.Vector3} The position of the star as a THREE.Vector3.
         */
        // Calculate the position of the star relative to the origin
        const x = _distance * Math.cos(_elevationY) * Math.sin(_azimuthX);
        const y = _distance * Math.sin(_elevationY);
        const z = _distance * Math.cos(_elevationY) * Math.cos(_azimuthX);

        // Create a Vector3 for the star's position relative to the observer
        const starPosition = new THREE.Vector3(x, y, z);

        // Add the observer's position to the star's relative position
        return starPosition.add(_observer);
    }
    //----------------------------------------------
    // AUX:

  
}
export default StageCamera