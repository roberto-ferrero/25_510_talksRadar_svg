//import gsap from "gsap"
//import * as THREE from 'three'

class AppState{
    constructor (obj){
        //console.log("(AppState.CONSTRUCTORA): ", obj)
        this.app = obj.app
        //--
        this.ACTIVE = true
        this.BUILT = false
        this.MOBILE_MODE = obj.data.mobileMode
        this.READY = false
        this.RENDER_COUNT = 0
        //--
        this.app.emitter.on("onAppBuilt", ()=>{
            if(this.BUILT) //console.warn("WebGLApp SHOULD ONLY BE BUILT ONCE!!")
            this.BUILT = true
        })
    }
    //----------------------------------------------
    // PUBLIC:
    activate(){
        let hasChanged = false
        if(!this.ACTIVE){
            hasChanged = true
        }
        this.ACTIVE = true
        if(hasChanged) this.app.emitter.emit("onAppStateActivate")
    }
    deactivate(){
        let hasChanged = false
        if(this.ACTIVE){
            hasChanged = true
        }
        this.ACTIVE = false
        if(hasChanged) this.app.emitter.emit("onAppStateDeactivate")
    }

    update_MOBILE_MODE(value){
        let hasChanged = false
        if(value != this.MOBILE_MODE){
            hasChanged = true
        }
        this.MOBILE_MODE = value
        if(hasChanged) this.app.emitter.emit("onAppStateNewMobileMode")
    }
    set_ready(){
        if(this.READY) //console.warn("WebGLApp SHOULD ONLY SET TO READY ONCE!!")
        this.READY = true
        this.app.emitter.emit("onAppStateReady")
    }
    update_RAF(){
        this.RENDER_COUNT++
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:

  
}
export default AppState