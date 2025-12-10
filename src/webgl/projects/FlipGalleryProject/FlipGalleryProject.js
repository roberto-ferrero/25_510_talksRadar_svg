import gsap from "gsap"
import * as THREE from 'three'

import ProjectSuper from "../ProjectSuper";
// import HerosStage from "../../stages/pwc_heros/HerosStage";
import FlipGalleryStage from "../../stages/flipgallery_scene/FlipGalleryStage";
import PortalsStage from "../../stages/portals_scene/PortalsStage";

import SampleTransition from "../../transitions/SimpleTransitions/SampleTransition";




class FlipGalleryProject extends ProjectSuper{
    constructor (obj){ // Step 0: Instantiated in Platform and passed to WebGLApp by argument
        // console.log("(FlipGalleryProject.CONSTRUCTORA): ", obj)
        super(obj)
    }
    //---------------------------------------------
    // INTERNAL:
    init(){ // Step 1: Called directly by App on Construct
        // console.log("(FlipGalleryProject.init)!")

        //-------------------
        // PROJECT SHERED ASSETS MANISFEST:
        // this.loader.add_texture("sample", this.app.loader_pathPrefix+"/img/sample.jpg")
        // this.loader.add_texture("sample2", this.app.loader_pathPrefix+"/img/sample2.jpg")
        //-------------------
        // this.MODE = this.app.data.MODE
        // this.app.trace("STARTING_MODE: ", this.MODE);
        //-------------------
        // STAGES:

        // this._addStage(new FlipGalleryStage({
        //     id:"single_stage",
        //     app:this.app,
        //     project:this,
        //     autoLoad:true,
        //     autoActive:false,
        // }))

        this._addStage(new PortalsStage({
            id:"single_stage",
            app:this.app,
            project:this,
            autoLoad:true,
            autoActive:false,
        }))

        //--
        this._addTransition("simple_transition", new SampleTransition({app:this.app, project:this}))
        //--
        this.stage = this.stages.getItem("single_stage")
        //--
        this._activate_and_show_stage("single_stage")
    }
    build(){ // Step:4 Called by ProjectCore when it recieves onAppBuild
        // console.log("(FlipGalleryProject.build)!")
    }


    //----------------------------------------------
    // RAF UPDATES:
    update_RAF(){

    }
    //----------------------------------------------
    // PUBLIC API:
    setMode(mode){
        // this.app.trace("(FlipGalleryProject.setMode): "+mode);
        if(mode != this.MODE){
            this.MODE = mode
            this.emitter.emit("onProjectSetMode", {mode:mode})
        }
    }
    //----------------------------------------------
    // PRIVATE:
    //----------------------------------------------
    //----------------------------------------------
    // AUX:

}
export default FlipGalleryProject