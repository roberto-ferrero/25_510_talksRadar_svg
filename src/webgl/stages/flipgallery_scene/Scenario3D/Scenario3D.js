//import gsap from "gsap"
import * as THREE from 'three'

import Sun from "./Sun"
import Gallery from './Gallery/Gallery'

class Scenario3D{
    constructor (obj){
        // console.log("(Scenario3D.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.parent3D = obj.parent3D
        //-----------------------------
        this.cont3D = new THREE.Object3D()
        this.cont3D.name = "scene3D"
        this.parent3D.add(this.cont3D)
        //-----------------------------
        this.textId = this.stage.TEXT_ID
        //-----------------------------
        this.sun = new Sun({
            app:this.app,
            project:this.project,
            stage:this.stage,
            parent3D:this.cont3D,
            mesh:this.stage.get_mesh_from_GLB_PROJECT("sun")
        })
        //---
        // const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Soft white light
        // this.parent3D.add(ambientLight);
        // //---
        this.gallery = new Gallery({
            app:this.app,
            project:this.project,
            stage:this.stage,
            scenario3D:this,
            parent3D:this.cont3D,
        })
        // this.texts = new TextPlanesGroup({
        //     app:this.app,
        //     project:this.project,
        //     stage:this.stage,
        //     parent3D:this.cont3D,
        //     textId:this.textId
        // })


    }
    //----------------------------------------------
    // PUBLIC:
    update_RAF(){
        // // this.sun.update_RAF()
        this.gallery?.update_RAF()
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:

  
}
export default Scenario3D