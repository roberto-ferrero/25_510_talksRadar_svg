//import gsap from "gsap"
import * as THREE from 'three'

import NumberUtils from '../../../core/utils/NumberUtils' 
import MeshUtils from '../../../core/utils/MeshUtils' 
import Sections from '../../../core/utils/Sections'

import PortalItem from './PortalItem'
import OrtoResponsiveFrame from '../OrtoResponsiveFrame'

class PortalGallery{
    constructor (obj){
        console.log("(PortalGallery.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.parent3D = obj.parent3D
        //-----------------------------
        this.CURRENT_POS = 0
        this.ANGLE_S = -Math.PI*0.15// 27º Angle of selected item
        this.ANGLE_M = -Math.PI*0.5 // 90º
        this.ANGLE_F = -Math.PI*0.7 // 126º
        //--
        this.INCR_ANGLE_RAD = Math.PI * 0.035
        this.ANIM_PROGRESS = 0
        this.GENERAL_PROGRESS = 0
        this.HIDE_PROGRESS = 0
        //-----------------------------

        //------------------------------
        this.ARRAY_IMGS = this.stage.ARRAY_IMGS
        this.ARRAY_REFS = []
        this.NUM_ITEMS = this.ARRAY_IMGS.length
        //-----------------------------

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

        //-----------------------------
        this.cont3D = new THREE.Object3D()
        this.cont3D.name = "gallery3D"
        this.parent3D.add(this.cont3D)
        this.plane_helper = MeshUtils.get_plane(this.stage.ORIGINAL_STAGE_SIZE.width, this.stage.ORIGINAL_STAGE_SIZE.height)
        this.cont3D.add(this.plane_helper)
        this.app.register_helper(this.plane_helper)
        //-----------------------------
        this.responsiveFrame = new OrtoResponsiveFrame({
            app:this.app,
            project:this.project,
            scalableRef:this.cont3D,
            parent3D:this.cont3D,
            refWidth:this.stage.ORIGINAL_STAGE_SIZE.width,
            refHeight:this.stage.ORIGINAL_STAGE_SIZE.height,
        })
        //-----------------------------
        

        const TEST_SINGLE_MODE = false
        const testPos = 7
        //--
        if(TEST_SINGLE_MODE){
            this.testPortal = new PortalItem({
                app:this.app,
                project:this.project,
                stage:this.stage,
                gallery:this,
                parent3D:this.cont3D,
                ITEM_ID:this.stage.ARRAY_IMGS[testPos],
                ITEM_INDEX:testPos,
            })
            this.ARRAY_REFS.push(this.testPortal)
        }else{
            for(let i=0; i<this.ARRAY_IMGS.length; i++){
                const itemId = this.ARRAY_IMGS[i]
                const image = new PortalItem({
                    app:this.app,
                    project:this.project,
                    stage:this.stage,
                    scenario3D:this.scenario3D,
                    gallery:this,
                    parent3D:this.cont3D,
                    ITEM_ID:itemId,
                    ITEM_INDEX:i,
                })
                this.ARRAY_REFS.push(image)
            }
        }
        
        //-----------------------------
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
    }

    //----------------------------------------------
    // PUBLIC:
    
    //----------------------------------------------
    // EVENTS:
    update_RAF(){
        this.responsiveFrame?.update_RAF()
        this.ARRAY_REFS.forEach(item => {
            item.update_RAF()
        })
    }
    //----------------------------------------------
    // PRIVATE:
    //----------------------------------------------
    // AUX:
}
export default PortalGallery