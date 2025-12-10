//import gsap from "gsap"
import * as THREE from 'three'

import MeshUtils from '../../../core/utils/MeshUtils'
import GeomUtils from "../../../core/utils/GeomUtils"

class Sun{
    constructor (obj){
        // console.log("(Sun.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.parent3D = obj.parent3D
        this.mesh = obj.mesh
        this.mesh.position.copy(this.app.filter_blender_position(this.mesh.position))
        //--
        this.ORIGIN = new THREE.Vector3(0, 0, 0)
        this.POSITION = new THREE.Vector3().copy(this.app.filter_blender_position(this.mesh.position))
        // this.COLOR = new THREE.Color(0xffe92b)
        this.COLOR = new THREE.Color(0xff09ff)
        this.ELEVATION = GeomUtils.get_elevation(this.ORIGIN, this.POSITION)
        this.AZIMUTH = GeomUtils.get_azimuth(this.ORIGIN, this.POSITION)
        //--
        this.sun_helper = MeshUtils.get_sphere(0.3, 32, 32, this.COLOR)
        this.sun_helper.position.copy(this.POSITION)
        this.app.register_helper(this.sun_helper)
        this.parent3D.add(this.sun_helper)
        //------------
        this.sunLight = new THREE.DirectionalLight(this.COLOR, )
        this.sunLight.position.copy(this.POSITION)
        this.sunLight.target.position.copy(this.ORIGIN)
        this.sunLight.target.updateMatrixWorld()    
        this.sunLight.castShadow = true
        this.sunLight.shadow.mapSize.width = 1024
        this.sunLight.shadow.mapSize.height = 1024
        this.sunLight.shadow.camera.near = 0.5
        this.sunLight.shadow.camera.far = 50
        this.sunLight.shadow.camera.fov = 50
        this.sunLight.shadow.bias = -0.0001
        this.parent3D.add(this.sunLight.target)
        this.parent3D.add(this.sunLight)    
        //------------
        // this.app.dev.gui?.add(this, 'AZIMUTH', -Math.PI*2, Math.PI*2, 0.001).listen().onChange((value) => {
        //     this.POSITION = GeomUtils.get_star(this.ORIGIN, this.AZIMUTH, this.ELEVATION, this.get_distance2Origin())
        //     this.sun_helper.position.copy(this.POSITION)
        // });
        // this.app.dev.gui?.add(this, 'ELEVATION', 0, Math.PI*0.5, 0.001).listen().onChange((value) => {
        //     this.POSITION = GeomUtils.get_star(this.ORIGIN, this.AZIMUTH, this.ELEVATION, this.get_distance2Origin())
        //     this.sun_helper.position.copy(this.POSITION)
        // });
        //--
        // const azimuth_test = GeomUtils.get_azimuth(this.ORIGIN, this.POSITION)
        // console.log("azimuth_test: "+azimuth_test);
        // const star_test = GeomUtils.get_star(this.ORIGIN, azimuth_test, this.ELEVATION, this.get_distance2Origin())
        // console.log("star_test: ", star_test);
        // console.log("this.POSITION: ", this.POSITION);

        const azimuth_test = GeomUtils.get_azimuth(this.ORIGIN, this.POSITION);
        const elevation_test = GeomUtils.get_elevation(this.ORIGIN, this.POSITION);

        // Calculate distance
        const distance_test = this.POSITION.distanceTo(this.ORIGIN);

        // Use azimuth, elevation, and distance to calculate the star position
        const star_test = GeomUtils.get_star(this.ORIGIN, azimuth_test, elevation_test, distance_test);

        // Log results
        // console.log("azimuth_test: ", azimuth_test);
        // console.log("elevation_test: ", elevation_test);
        // console.log("distance_test: ", distance_test);
        // console.log("star_test: ", star_test);
        // console.log("this.POSITION: ", this.POSITION);

    }
    //----------------------------------------------
    // PUBLIC API:
    get_position(){
        return this.POSITION
    }
    get_distance2Origin(){
        return this.POSITION.distanceTo(this.ORIGIN)
    }   
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:
    _update(){
        this.ELEVATION = GeomUtils.get_elevation(this.ORIGIN, this.POSITION)
        this.AZIMUTH = GeomUtils.get_azimuth(this.ORIGIN, this.POSITION)
    }
    //----------------------------------------------
    // AUX:

  
}
export default Sun