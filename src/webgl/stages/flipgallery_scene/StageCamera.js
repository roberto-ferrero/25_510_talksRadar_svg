import gsap from "gsap"
import * as THREE from 'three'
import MeshUtils from '../../core/utils/MeshUtils'

import CameraStates from './_states/CameraStates'
import TargetStates from './_states/TargetStates'

// import LensFlare from './LensFlare/LensFlare'

class StageCamera{
    constructor (obj){ 
        // console.log("------------------- (StageCamera.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.parent3D = obj.parent3D
        //-----------------------------
        this.INITIALIZED = false
        this.BUILT = false
        //-----------------------------

        this.STATE_FROM = "camera0"
        this.STATE_TO = "camera0"
        this.STATE_PROGRESS = 0
        this.TARGET_FROM = "target0"
        this.TARGET_TO = "target0"
        this.gsap_params = {
            control:0,
            fov_base: 20,
            fov_factor: 2,
            panX: 5,
            panY: 5,
            pan_azimuth_arch: [-0.02, 0.02],
            pan_elevation_arch: [-0.01, 0.01],
        }
        //---
        this.FOV_MODIFIER_1 = 1
        this.FOV_MODIFIER_2 = 1
        //---
        this.TARGET_PROGRESS = 0
        this.HOLDER_REF_POSITION = new THREE.Vector3()
        this.LENSFLARE_DISTANCE = 100
        this.CURRENT_PAN_AZIMUTH = 0
        this.CURRENT_PAN_ELEVATION = 0
        //-----------------------------
        this.raycaster = new THREE.Raycaster();
        this.mouseV2 = new THREE.Vector2();
        //-----------------------------
        this.cameraStates = new CameraStates({
            app:this.app,
            project:this.project,
            stage:this.stage
        })

        this.targetStates  = new TargetStates({
            app:this.app,
            project:this.project,
            stage:this.stage
        })
        //-----------------------------
        this.lookingTarget_base = new THREE.Vector3(0, 0, 0)
        //-----------------------------
        this.camera = new THREE.PerspectiveCamera(22, this.app.size.CURRENT.aspect, 0.1, 100);
        this.camera.name = "main_camera"
        //-----------------------------
        console.log("this.app.state.MOBILE_MODE: ", this.app.state.MOBILE_MODE);

        if(!this.app.state.MOBILE_MODE){
            // DESKTOP!
            this.camera.setViewOffset(
                this.app.size.CURRENT.width,    // fullWidth
                this.app.size.CURRENT.height,   // fullHeight
                this.app.size.CURRENT.width*0.20, //this.app.size.CURRENT.width*0.4,        // offsetX
                0,     // offsetY (negative moves view up)
                this.app.size.CURRENT.width,    // width of the sub-camera
                this.app.size.CURRENT.height    // height of the sub-camera
              );
        }else{
            // MOBILE!
            // this.camera.setViewOffset(
            //     this.app.size.CURRENT.width,    // fullWidth
            //     this.app.size.CURRENT.height,   // fullHeight
            //     this.app.size.CURRENT.width*0.50, //this.app.size.CURRENT.width*0.4,        // offsetX
            //     0,     // offsetY (negative moves view up)
            //     this.app.size.CURRENT.width,    // width of the sub-camera
            //     this.app.size.CURRENT.height    // height of the sub-camera
            //   );
        }
        
    }
    //----------------------------------------------
    // PUBLIC:
    init(){
        //console.log("(StageCamera.init)!")
        this.INITIALIZED = true
    }
    build(GLB_PROJECT){
        //console.log("(StageCamera.build)!")
        this.cameraStates.build(GLB_PROJECT)
        this.targetStates.build(GLB_PROJECT)
        // console.log("this.cameraStates: ", this.cameraStates);
        //------------
        // console.log(" ", this.cameraStates.get_state("camera0").position);
        if(!this.app.state.MOBILE_MODE){
            // DESKTOP!
            this.cameraStates.override_state_param("camera0", "position", new THREE.Vector3(0, 0, 5.05))
        }else{
            // MOBILE!
            // this.cameraStates.override_state_param("camera0", "position", new THREE.Vector3(0, 0, 3.5))
        }
        console.log("fov: "+this.camera.fov);
        //------------
        this._create_structure()
        if(this.app.MODE == "radar"){
            this.configure_camera(this.cameraStates.get_state("camera2"), this.targetStates.get_state("target2"))
        }else{
            this.configure_camera(this.cameraStates.get_state("camera0"), this.targetStates.get_state("target0"))
        }
        //------------
        //--
        this.BUILT = true

       
    }
    start(){

    }
    //----------------------------------------------
    get_POSITION(){
        return this.holder.position
    }
    //----------------------------------------------
    animateStateFromTo(stateId_1, stateId_2, secs, ease="power2.inOut"){
        this.STATE_FROM = stateId_1
        this.STATE_TO = stateId_2
        this.STATE_PROGRESS = 0
        //--
        this.stateAnim?.kill()
        this.stateAnim = gsap.to(this, {
            STATE_PROGRESS:1,
            duration:secs,
            ease:ease
        })
    }
    animateTargetFromTo(targetId_1, targetId_2, secs, ease="power2.inOut"){
        this.TARGET_FROM = targetId_1
        this.TARGET_TO = targetId_2
        this.TARGET_PROGRESS = 0
        //--
        this.targetAnim?.kill()
        this.targetAnim = gsap.to(this, {
            TARGET_PROGRESS:1,
            duration:secs,
            ease:ease
        })
    }
    configure_camera(cameraState, target){
        // console.log("(StageCamera.configure_camera) cameraState: ", cameraState, " target_placer: ", target)
        this.lookingTarget_base.copy(target.position)
        this.holder.position.copy(cameraState.position)
        this.lookingTarget.position.copy(target.position)
        this._update_camera_data()
    }
    set_PROGRESS(progress){
        this.STATE_PROGRESS = progress
        this.TARGET_PROGRESS = progress
    }
    get_position(){
        return this.holder.position
    }
    get_targetPosition(){
        return this.lookingTarget.position
    }
    //----------------------------------------------
    // UPDATES:
    update_RAF(){
        // console.log("this.holder.position: ", this.holder.position);
        this._update_positions()
        if(this.app.MOUSE_ACTIVE){
            this._update_pan()
        }
        if(this.app.state.MOBILE_MODE){
            // MOBILE!
            this._update_viewOffset()
        }
        this._update_camera_data()
        //--
        this.camera.updateProjectionMatrix();
    }
    // _update_lensflareScale(){
    //     const dimensions = this._get_planeSizeAtDistance(this.camera, this.LENSFLARE_DISTANCE)
    //     // console.log("dimensions: ", dimensions);
    //     const xscale = dimensions.width/this.app.size.REF.width
    //     const yscale = dimensions.height/this.app.size.REF.height
    //     // console.log("xscale: ", xscale, " yscale: ", yscale);
    //     this.lensFlare.cont3D.scale.set(xscale, yscale, 1)
    // }
    // _update_lensFlare(){
    //     // const distance = 1;
    //     // const cameraWorldPosition = new THREE.Vector3();
    //     // this.camera.getWorldPosition(cameraWorldPosition);
    //     // const cameraDirection = new THREE.Vector3();
    //     // this.camera.getWorldDirection(cameraDirection);

    //     // // Step 2: Calculate the new position for cont3D
    //     // const lensFlarePosition = new THREE.Vector3();
    //     // lensFlarePosition.copy(cameraWorldPosition).add(cameraDirection.multiplyScalar(distance));

    //     // // Step 3: Update cont3D's position and make it look at the camera
    //     // this.lensFlare.cont3D.position.copy(lensFlarePosition);
    //     // this.lensFlare.cont3D.lookAt(cameraWorldPosition);
    //     this.lensFlare.cont3D.position.set(0, 0, -this.LENSFLARE_DISTANCE)
    //     const lensScale = 1;
    //     this.lensFlare.cont3D.scale.set(lensScale, lensScale, lensScale);
    //     //--
    //     this.lensFlare.update_RAF()
    //     this.lensFlare.update_progress(this.STATE_PROGRESS)
    // }
    _update_viewOffset(){
        console.log("+");
        const WIDTH_RATIO = this.app.size.CURRENT.width/this.app.size.REF.width
        const OFFESET_X = 2.6*this._getA(WIDTH_RATIO)
        //--
        const HEIGHT_RATIO = this.app.size.CURRENT.height/this.app.size.REF.height
        const OFFESET_Y = 0.3*this._getA(HEIGHT_RATIO)
        //--
        console.log("WIDTH_RATIO: ", WIDTH_RATIO+", X_OFFESET_X: ", OFFESET_X);
        this.camera.setViewOffset(
            this.app.size.CURRENT.width,    // fullWidth
            this.app.size.CURRENT.height,   // fullHeight
            this.app.size.CURRENT.width*OFFESET_X,        // offsetX
            this.app.size.CURRENT.height*OFFESET_Y,     // offsetY (negative moves view up)
            this.app.size.CURRENT.width,    // width of the sub-camera
            this.app.size.CURRENT.height    // height of the sub-camera
        );
        //--
        this.camera.fov = 22*(1/OFFESET_X)
    }
    _getA(B) {
        return 0.88 * B + 0.027;
    }
    _update_positions(){
        // console.log("this.STATE_FROM: ", this.STATE_FROM, " this.STATE_TO: ", this.STATE_TO);
        const stateFrom = this.cameraStates.get_state(this.STATE_FROM)
        const stateTo = this.cameraStates.get_state(this.STATE_TO)
        const targetFrom = this.targetStates.get_state(this.TARGET_FROM)
        const targetTo = this.targetStates.get_state(this.TARGET_TO)
        //--
        // const posX = stateFrom.position.x + (stateTo.position.x - stateFrom.position.x) * this.STATE_PROGRESS
        // // console.log("stateFrom.position.x: ", stateFrom.position.x);
        // // console.log("this.STATE_PROGRESS: ", this.STATE_PROGRESS);
        // // console.log("posX: ", posX);
        // const posY = (stateFrom.position.y + (stateTo.position.y - stateFrom.position.y) * this.STATE_PROGRESS)
        // const posZ = (stateFrom.position.z + (stateTo.position.z - stateFrom.position.z) * this.STATE_PROGRESS)
        // const fov = stateFrom.fov + (stateTo.fov - stateFrom.fov) * this.STATE_PROGRESS
        // this.camera.fov = fov
        // this.holder.position.set(posX, posY, posZ)
        // console.log("stateFrom: ", stateFrom);
        // console.log("stateTo: ", stateTo);
        //----------
        // console.log("---");
        // console.log("REF: ", this.app.size.REF.aspect);
        // console.log("CURRENT: ", this.app.size.CURRENT.aspect);
        // console.log("FACTOR: "+this.app.size.REF.aspect/this.app.size.CURRENT.aspect);
        // this.FOV_MODIFIER_1 = this.app.size.REF.aspect/this.app.size.CURRENT.aspect // Adjust FOV to diferent aspect ratios
        this.FOV_MODIFIER_1 = 1/this.app.size.CURRENT_REF_RATIO// Adjust FOV to diferent aspect ratios
        //----------
        this.camera.fov = THREE.MathUtils.lerp(stateFrom.fov, stateTo.fov, this.STATE_PROGRESS)*this.FOV_MODIFIER_1*this.FOV_MODIFIER_2
        // this.holder.position.lerpVectors(stateFrom.position, stateTo.position, this.STATE_PROGRESS)
        this.HOLDER_REF_POSITION.lerpVectors(stateFrom.position, stateTo.position, this.STATE_PROGRESS)
        this.lookingTarget.position.lerpVectors(targetFrom.position, targetTo.position, this.TARGET_PROGRESS)

        //this.holder.position.copy(this.HOLDER_REF_POSITION) // DEV ONLY

        // console.log("stateFrom.position: ", stateFrom.position);
        // console.log("stateTo.position: ", stateTo.position);
        // console.log("this.holder.position: ", this.holder.position);
    }
    _update_pan(){
        // console.log("this.stage.MOUSE_PAN_FACTOR_EASED.get()", this.stage.MOUSE_PAN_FACTOR_EASED.get());
        const rad180 = Math.PI*0.5

        const pan_azimuth_range = this.gsap_params.pan_azimuth_arch[1]-this.gsap_params.pan_azimuth_arch[0]
        const pan_azimuth_half = this.gsap_params.pan_azimuth_arch[0]+(pan_azimuth_range*0.5)
        const pan_azimuth_incr = (this.app.mouse.POSITION_EASED.x.get()*pan_azimuth_range*this.stage.MOUSE_PAN_FACTOR_EASED.get())
        const pan_azimuth = pan_azimuth_half + (pan_azimuth_incr)
        this.CURRENT_PAN_AZIMUTH = pan_azimuth
        // const pan_azimuth_half = this.gsap_params.pan_azimuth_arch[1]-this.gsap_params.pan_azimuth_arch[0]
        // const pan_azimuth = this.gsap_params.pan_azimuth_arch[0] + (this.app.mouse.POSITION2_EASED.x.get()*(this.gsap_params.pan_azimuth_arch[1] - this.gsap_params.pan_azimuth_arch[0])*this.stage.MOUSE_PAN_FACTOR_EASED.get() )
        
        const pan_elevation_range = this.gsap_params.pan_elevation_arch[1]-this.gsap_params.pan_elevation_arch[0]
        const pan_elevation_half  =this.gsap_params.pan_elevation_arch[0]+(pan_elevation_range*0.5)
        // const pan_elevation_incr = (this.app.mouse.POSITION_EASED.y.get()*pan_elevation_range*this.stage.MOUSE_PAN_FACTOR_EASED.get())
        const pan_elevation_incr = (this.app.mouse.POSITION_EASED.y.get()*pan_elevation_range*1)
        const pan_elevation = pan_elevation_half + (pan_elevation_incr)
        this.CURRENT_PAN_ELEVATION = pan_elevation

        const distance = this.HOLDER_REF_POSITION.distanceTo(this.lookingTarget.position)
        const holder_azimuth = -this._get_azimuth( this.lookingTarget.position, this.HOLDER_REF_POSITION)
        const holder_elevation = this._get_elevation(this.lookingTarget.position, this.HOLDER_REF_POSITION)
        this.holder.position.copy(this._get_star(this.lookingTarget.position, holder_azimuth+rad180+pan_azimuth, holder_elevation+pan_elevation, distance))
        // console.log("this.holder.position: ", this.holder.position);
    }

    _update_bgPlane(){
        // const fov = this.camera.fov * (Math.PI / 180); // Convert FOV to radians
        // const distance = Math.abs(this.bgPlane.position.z); // Distance from camera to plane
        // const aspect = this.app.size.CURRENT.aspect;
        
        // const height = 2 * distance * Math.tan(fov / 2);
        // const width = height * aspect;
        // this.bgPlane.scale.set(height, width, 1);
        // //--
        // const cameraWorldPosition = new THREE.Vector3();
        // this.camera.getWorldPosition(cameraWorldPosition);
        // console.log("cameraWorldPosition: ", cameraWorldPosition);
        // //--
        // this.mouseV2.x = this.app.mouse.POSITION_NORM.x
        // this.mouseV2.y = this.app.mouse.POSITION_NORM.y
        // this.raycaster.setFromCamera(this.mouseV2, this.camera)
        // this.intersects = this.raycaster.intersectObjects(this.holder);
        // console.log("intersects: ", this.intersects);
    }
    //----------------------------------------------
    // PRIVATE:
    _create_structure(){
        this.holder = new THREE.Object3D()
        this.parent3D.add(this.holder)
        this.holder.add(this.camera)
        // this.holder.position.set(0, 20, 300)
        //this.holder.position.set(-87, 126, -392)
        // x: -87.54139709472656, y: 126.45600128173828, z: -392.69500732421875
        // this.parent3D.add(this.holder)
        // //--
        // this.looker = new THREE.Object3D()
        // this.holder.add(this.looker)
        // //--
        // this.panX = new THREE.Object3D()
        // this.looker.add(this.panX)
        // //--
        // this.panY = new THREE.Object3D()
        // this.panX.add(this.panY)
        // //--
        // this.panY.add(this.camera)
        //----------
        //----------
        // this.planeGeometry = new THREE.PlaneGeometry(1, 1, 10, 10);
        // this.planeMaterial = new THREE.MeshBasicMaterial({
        //     color: 0x0000ff,
        //     wireframe: true,
        //     side: THREE.DoubleSide
        // });
        // this.bgPlane = new THREE.Mesh(this.planeGeometry, this.planeMaterial);
        // this.bgPlane.position.set(0, 0, -250)
        // this.bgPlane.rotation.z = Math.PI / 2; // Rotate to make it vertical
        // this.camera.add(this.bgPlane);
        //----------
        //----------
        this.lookingTarget = new THREE.Object3D()
        this.parent3D.add(this.lookingTarget)

        this.camera_helper = new THREE.CameraHelper( this.camera );
        this.parent3D.add( this.camera_helper );
        this.app.dev.register_helper(this.camera_helper)

        // if(this.app.dev_helpers){
        //     this.holder_test = MeshUtils.get_sphere(0.5, 10, 10, 0xffff00)
        //     this.holder.add(this.holder_test)
        //     this.app.dev.register_helper(this.holder_test)
        //     //--
        //     this.camera_helper = new THREE.CameraHelper( this.camera );
        //     this.parent3D.add( this.camera_helper );
        //     this.app.dev.register_helper(this.camera_helper)
        //     //--
        //     // --
        //     // --
        //     this.holder_helper = MeshUtils.get_box(2, 2, 2, 0xff0000)
        //     this.holder.add(this.holder_helper)
        //     this.app.dev.register_helper(this.holder_helper)
        //     // --
        //     this.panX_helper = MeshUtils.get_box(1, 2, 1, 0xff0000)
        //     this.panX.add(this.panX_helper)
        //     this.app.dev.register_helper(this.panX_helper)
        //     // --
        //     this.panY_helper = MeshUtils.get_box(1, 1, 1, 0xff0000)
        //     this.panY.add(this.panY_helper)
        //     this.app.dev.register_helper(this.panY_helper)
        //     // --
        //     this.lookingTarget_helper = MeshUtils.get_box(1, 1, 1, 0x0000ff)
        //     this.lookingTarget.add(this.lookingTarget_helper)
        //     this.app.dev.register_helper(this.lookingTarget_helper)
            
        // }
        this._update_camera_data()
    }
    _update_camera_data(){
        ////console.log("this.camera.rotation: ", this.camera.rotation);
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

    _get_azimuth(_center, _position) {
        /**
         * Calculate the azimuth angle (in radians) between a center point and a position in 3D space
         * relative to the x-z reference plane.
         * 
         * @param {THREE.Vector3} _center - The center point in 3D space (THREE.Vector3).
         * @param {THREE.Vector3} _position - The position point in 3D space (THREE.Vector3).
         * @returns {number} - The azimuth angle in radians.
         */
        // Calculate the vector from the center to the position
        const direction = new THREE.Vector3().subVectors(_position, _center);
        
        // Project the direction vector onto the x-z plane
        direction.y = 0;

        // Normalize the direction vector
        direction.normalize();

        // Calculate the azimuth angle
        // atan2 gives the angle in the range [-π, π]
        const azimuth = Math.atan2(direction.z, direction.x);

        // Return the azimuth angle in radians
        return azimuth;
    }
    _get_elevation(_center, _position) {
        /**
         * Calculate the elevation angle (in radians) between a center point and a position in 3D space
         * relative to the x-z reference plane.
         * 
         * @param {THREE.Vector3} _center - The center point in 3D space (THREE.Vector3).
         * @param {THREE.Vector3} _position - The position point in 3D space (THREE.Vector3).
         * @returns {number} - The elevation angle in radians.
         */
        // Calculate the vector from the center to the position
        const direction = new THREE.Vector3().subVectors(_position, _center);
        
        // Calculate the magnitude of the projection onto the x-z plane
        const projectedLength = Math.sqrt(direction.x ** 2 + direction.z ** 2);
        
        // Calculate the elevation angle
        // atan2 gives the angle in the range [-π/2, π/2]
        const elevation = Math.atan2(direction.y, projectedLength);

        // Return the elevation angle in radians
        return elevation;
    }
    _get_planeSizeAtDistance(camera, distance) {
        // Vertical field of view in radians
        const vFov = THREE.MathUtils.degToRad(camera.fov);
    
        // Height of the viewport at the given distance
        const height = 2 * Math.tan(vFov / 2) * distance;
    
        // Width is determined by the aspect ratio
        const width = height * camera.aspect;
    
        return { width, height };
    }
    //----------------------------------------------
    // AUX:

  
}
export default StageCamera