//import gsap from "gsap"
//import * as THREE from 'three'

class OrtoResponsiveFrame{
    constructor (obj){
        // console.log("(OrtoResponsiveFrame.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.scalableRef = obj.scalableRef
        this.refWidth = obj.refWidth
        this.refHeight = obj.refHeight
        this.MODE = obj.mode || "COVER"
        /* MODES:
           COVER: ASPECT SAFE. CONTENT OVERFLOW
           CONTAIN: ASPECT SAFE. SHOWS ALL CONTENT
           STRETCH: NO ASPECT SAFE. ADJUST
        */
        //--
        this.refAspect = this.refWidth / this.refHeight
    }
    //----------------------------------------------
    // PUBLIC:
    
    //----------------------------------------------
    // UPDATE RAF:
    update_RAF(){
        const currentAspect = this.app.size.CURRENT.aspect
        if(this.MODE == "COVER"){
            if(currentAspect > this.refAspect){
                // VIEWPORT MAS ANCHO
                this._adjust_frameWidth_to_VPWidth()
            }else{
                // VIEWPORT MAS ALTO
                this._adjust_frameHeight_to_VPHeight()
            }
            return
        }else if(this.MODE == "CONTAIN"){
            if(currentAspect > this.refAspect){
                // VIEWPORT MAS ANCHO
                this._adjust_frameHeight_to_VPHeight()
            }else{
                // VIEWPORT MAS ALTO
                this._adjust_frameWidth_to_VPWidth()
            }
            return
        } else if(this.MODE == "STRETCH"){
            this._adjust_both()
            return
        }
    }
    //----------------------------------------------
    // PRIVATE:
    _adjust_frameWidth_to_VPWidth(){
        this.scalableRef.scale.x = this.app.size.CURRENT.width / this.refWidth
        this.scalableRef.scale.y = this.scalableRef.scale.x
    }
    _adjust_frameHeight_to_VPHeight(){
        this.scalableRef.scale.y = this.app.size.CURRENT.height / this.refHeight
        this.scalableRef.scale.x = this.scalableRef.scale.y
    }
    _adjust_both(){
        this.scalableRef.scale.x = this.app.size.CURRENT.width / this.refWidth
        this.scalableRef.scale.y = this.app.size.CURRENT.height / this.refHeight
    }
    //----------------------------------------------
    // AUX:

  
}
export default OrtoResponsiveFrame