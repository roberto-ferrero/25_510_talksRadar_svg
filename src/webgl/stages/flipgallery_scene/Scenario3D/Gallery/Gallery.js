import gsap from "gsap"
import * as THREE from 'three'

import Sections from '../../../../core/utils/Sections'

import ImagePlane from "./ImagePlane"

class Gallery{
    constructor (obj){
        // console.log("(Gallery.CONSTRUCTORA): ", obj)
        // console.log("this.textId: ", obj.textId);
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.scenario3D = obj.scenario3D
        this.parent3D = obj.parent3D
        //-----------------------------
        this.CURRENT_POS = 0
        this.ANGLE_S = -Math.PI*0.35// 0.35
        this.ANGLE_M = -Math.PI*0.5
        // this.ANGLE_F = -Math.PI
        this.ANGLE_F = -Math.PI*0.7
        // this.INITIAL_ANGLE_RAD = this.ANGLE_S
        this.INCR_ANGLE_RAD = Math.PI * 0.05
        this.ANIM_PROGRESS = 0
        this.GENERAL_PROGRESS = 0
        this.HIDE_PROGRESS = 0
        //------------------------------
        this.ARRAY_IMGS = this.stage.ARRAY_IMGS
        this.ARRAY_REFS = []
        this.NUM_ITEMS = this.ARRAY_IMGS.length
        //-----------------------------
        const incr_section = 1/(this.NUM_ITEMS-1)
        let base = 0
        const section_array = []
        for(var i=0; i<this.NUM_ITEMS; i++){
            section_array.push(base)
            base += incr_section
        }
        this.SECTIONS = new Sections(section_array)
        //-----------------------------
        this.cont3D = new THREE.Object3D()
        this.cont3D.name = "gallery3D"
        this.parent3D.add(this.cont3D)
        // this.cont3D.position.set(-1.7, 0, 0)s
        //-----------------------------
        // for(let i=0; i<this.ARRAY_IMGS.length; i++){
        //     const itemId = this.ARRAY_IMGS[i]
        //     const image = new ImagePlane({
        //         app:this.app,
        //         project:this.project,
        //         stage:this.stage,
        //         scenario3D:this.scenario3D,
        //         gallery:this,
        //         parent3D:this.cont3D,
        //         ITEM_ID:itemId,
        //         ITEM_INDEX:i,
        //     })
        //     this.ARRAY_REFS.push(image)
        // }

        const pos = 5
        const itemId = this.ARRAY_IMGS[pos]
        const image = new ImagePlane({
            app:this.app,
            project:this.project,
            stage:this.stage,
            scenario3D:this.scenario3D,
            gallery:this,
            parent3D:this.cont3D,
            ITEM_ID:itemId,
            ITEM_INDEX:pos,
        })
        this.ARRAY_REFS.push(image)
        
        //------------------------------------
        this.app.dev.gui?.add(this, 'advance').name("ADVANCE")
        this.app.dev.gui?.add(this, 'rewind').name('REWIND')
        //------------------------------------
        this.app.emitter.on("onAppScrollUpdate",(e)=>{
            if(!this.stage.MOBILE_MODE){
                if(e.id == "scroll_gallery"){
                    this.GENERAL_PROGRESS = e.scroll.PROGRESS
                    if(this.GENERAL_PROGRESS == 1) this.GENERAL_PROGRESS = 0.99999
                }else if(e.id == "scroll_gallery2"){
                    this.HIDE_PROGRESS= e.scroll.PROGRESS
                }
            }
        })
        //------------------------------------
        // gsap.delayedCall(1, ()=>{
        //     this.advance()
        // })
    }
    //----------------------------------------------
    // PUBLIC:
    advance(){
        // console.log("(Gallery.advance)!");
        let new_pos = this.CURRENT_POS + 1
        if (new_pos >= this.NUM_ITEMS){
            new_pos = this.NUM_ITEMS-1
        }
        this.CURRENT_POS = new_pos
        // console.log("this.CURRENT_POS: ", this.CURRENT_POS);
        this._init_animation()
        this.app.emitter.emit("onGalleryUpdate", {})
    }
    rewind(){
        let new_pos = this.CURRENT_POS - 1
        if (new_pos < 0){
            new_pos = 0
        }
        this.CURRENT_POS = new_pos
        this._init_animation()
        this.app.emitter.emit("onGalleryUpdate", {})
    }

    //----------------------------------------------
    // EVENTS:
    update_RAF(){
        this.ARRAY_REFS.map((image)=>{
            image.update_RAF()  
        })
    }
    //----------------------------------------------
    // PRIVATE:
    _init_animation(){
        const incr_section = 1/(this.NUM_ITEMS-1)
        let new_progress = this.CURRENT_POS * incr_section
        //---
        this.anim?.kill()
        this.anim = gsap.to(this, {
            GENERAL_PROGRESS: new_progress,
            duration: 2,
            ease: "power2.inOut",
            onUpdate: () => {
                console.log("GENERAL_PROGRESS: ", this.GENERAL_PROGRESS);
                if(this.GENERAL_PROGRESS >= 1){
                    this.GENERAL_PROGRESS = 0.99999
                }
            },
            onComplete: () => {
                
            }
        })
    }
    //----------------------------------------------
    // AUX:

  
}
export default Gallery