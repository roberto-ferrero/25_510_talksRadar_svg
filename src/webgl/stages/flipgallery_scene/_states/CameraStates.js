//import gsap from "gsap"
//import * as THREE from 'three'

import Datos from "../../../core/utils/Datos"
import MeshUtils from "../../../core/utils/MeshUtils"

class CameraStates{
    constructor (obj){
        //console.log("(CameraStates.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        //-----------------------------
        this.data = new Datos()
        //-----------------------------
        this.helpers = new Datos()
    }
    //----------------------------------------------
    // PUBLIC:
    build(GLB_PROJECT){
        GLB_PROJECT.children.map((child)=>{
            if(child.name.includes("camera")){
                const itemId = child.name.split("_")[0]
                //console.log(itemId, child);
                const item = {
                    itemId: itemId,
                    position: child.position,
                    rotation: child.rotation,
                    fov: child.fov,
                }
                item.position.z = item.position.z
                this.data.nuevoItem(itemId, item)
                //--
                item.helper = MeshUtils.get_sphere(0.3, 32, 32, 0xff0000)
                item.helper.position.copy(item.position)
                this.app.register_helper(item.helper)
                this.stage.world3D.add(item.helper)
                // console.log("   item",item);
            }
        })
    }
    get_state(itemId){
        return this.data.getItem(itemId)
    }
    add_param(itemId, param, value){
        const item = this.data.getItem(itemId)
        item[param] = value
    }
    override_state_param(itemId, param, value){
        const item = this.data.getItem(itemId)
        if(item){
            item[param] = value
        }
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:

  
}
export default CameraStates