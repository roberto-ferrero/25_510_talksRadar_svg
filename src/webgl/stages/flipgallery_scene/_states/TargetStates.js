//import gsap from "gsap"
//import * as THREE from 'three'

import Datos from "../../../core/utils/Datos"

class TargetStates{
    constructor (obj){
        //console.log("(TargetStates.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        //-----------------------------
        this.data = new Datos()
        //-----------------------------
    }
    //----------------------------------------------
    // PUBLIC:
    build(GLB_PROJECT){
        GLB_PROJECT.children.map((child)=>{
            if(child.name.includes("target")){
                const itemId = child.name.split("_")[0]
                //console.log(itemId, child);
                const item = {
                    itemId: itemId,
                    position: child.position,
                }
                item.position.z = -item.position.z
                this.data.nuevoItem(itemId, item)
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
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:

  
}
export default TargetStates