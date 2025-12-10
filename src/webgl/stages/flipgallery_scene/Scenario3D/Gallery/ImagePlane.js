//import gsap from "gsap"
import * as THREE from 'three'    


import vertex from "./_shaders/image_vertex.glsl"
import fragment from "./_shaders/image_fragment.glsl"

class ImagePlane{
    constructor (obj){
        // console.log("(ImagePlane.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.scenario3D = obj.scenario3D
        this.gallery = obj.gallery
        this.parent3D = obj.parent3D
        this.ITEM_ID = obj.ITEM_ID
        this.ITEM_INDEX = obj.ITEM_INDEX
        //-----------------------------
        this.DEV_ITEM = false
        if(this.ITEM_INDEX == 6) this.DEV_ITEM = true
        //-----------------------------
        // this.X_OFFSET = 1.55
        this.X_OFFSET = 2.5
        //-----------------------------
        this.CURRENT_POS_OFFSET = 0
        this.START_POS_OFFSET = this.ITEM_INDEX
        this.FINAL_POS_OFFSET = this.ITEM_INDEX
        this.CURRENT_ANGLE_RAD = this.gallery.ANGLE_S + (this.CURRENT_POS_OFFSET * this.gallery.INCR_ANGLE_RAD)
        this.START_ANGLE_RAD = 0
        this.FINAL_ANGLE_RAD = this.CURRENT_ANGLE_RAD
        if(!this.app.state.MOBILE_MODE){
            // DESKTOP!
            this.IMAGE_ASPECT_RATIO = 1.4 // 1.7
        }else{
            // MOBILE!
            this.IMAGE_ASPECT_RATIO = 1.0 // 1.7
        }
        //-----------------------------
        // this.mesh = this.stage.get_mesh_from_GLB_PROJECT("plane")
        //-----------------------------
        this.flipPlane3D = new THREE.Object3D()
        // this.flipPlane3D.visible = false
        this.parent3D.add(this.flipPlane3D)
        //--
        this.image_texture = this.stage.loader.get_texture(this.ITEM_ID)
        this.image_texture.encoding = THREE.SRGBColorSpace;
        this.plane_geometry = new THREE.PlaneGeometry( this.IMAGE_ASPECT_RATIO, 1, 1, 1 )

        // this.plane_material = new THREE.MeshBasicMaterial( {
        //     map: this.image_texture,
        //     // color: 0xffffff,
        //     side: THREE.DoubleSide,
        //     // emis
        // } )
        this.plane_material = new THREE.ShaderMaterial( {
            side: THREE.DoubleSide,
            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms: {
                // uBagroundColor: {value: new THREE.Color().setHex(0x1e0814)},
                uAngleS: {value: this.gallery.ANGLE_S},
                uAngleM: {value: this.gallery.ANGLE_M},
                uAngleF: {value: this.gallery.ANGLE_F},
                uBagroundColor: {value: new THREE.Color().setHex(0x1e0814).convertLinearToSRGB()},
                uReverseColor: {value: new THREE.Color().setHex(0x490d2e).convertLinearToSRGB()},
                uTexture: {value: this.image_texture},
                uPlaneDimensions: {value: [this.IMAGE_ASPECT_RATIO, 1]},
                uTextureDimensions: {value: [this.image_texture.image.width, this.image_texture.image.height]},
                uPosOffset: {value: this.CURRENT_POS_OFFSET},
                uCurrentAngleRad: {value: this.CURRENT_ANGLE_RAD},

            }
        })

        this.plane = new THREE.Mesh( this.plane_geometry, this.plane_material )
        this.plane.position.set(this.X_OFFSET, 0, 0)
        //--
        this.flipPlane3D.add(this.plane)
        //--
        

        //----------------------------
        //-----------------------------
        this.app.emitter.on("onGalleryUpdate", (data)=>{
            // this.flipPlane3D.visible = true
            this.START_POS_OFFSET = this.CURRENT_POS_OFFSET
            this.FINAL_POS_OFFSET = this.gallery.CURRENT_POS+this.ITEM_INDEX
            if(this.FINAL_POS_OFFSET < -1){
                this.FINAL_POS_OFFSET = -1
            }
            this.START_ANGLE_RAD = this.CURRENT_ANGLE_RAD
            if(this.FINAL_POS_OFFSET == -1){
                this.FINAL_ANGLE_RAD = this.gallery.ANGLE_F
            }else{
                this.FINAL_ANGLE_RAD = this.gallery.ANGLE_S + (this.FINAL_POS_OFFSET * this.gallery.INCR_ANGLE_RAD)
            }
            
        })

    }
    //----------------------------------------------
    // PUBLIC:
    advance(){
        
    }
    
    //----------------------------------------------
    // EVENTS:
    update_RAF(){
        if(this.DEV_ITEM) console.log("this.CURRENT_ANGLE_RAD: ", this.CURRENT_ANGLE_RAD);
        this._update_rotation()
        this._update_uniforms()
        // this._update_data()
        this._draw_data()
        // // this.flipPlane3D.rotation.y = this.gallery.ANGLE_S + (this.ITEM_INDEX * this.gallery.INCR_ANGLE_RAD)
        // // console.log("this.flipPlane3D.rotation.y: ", this.flipPlane3D.rotation.y);
        // //----
        // // ROTATION:
    }
    _update_rotation(){
        const current_section = this.gallery.SECTIONS.get_section(this.gallery.GENERAL_PROGRESS)
        const current_section_progress = this.gallery.SECTIONS.get_sectionProgress(this.gallery.GENERAL_PROGRESS)
        const current_index_offset = current_section- this.ITEM_INDEX 
        if(current_index_offset > 0){
            this.CURRENT_ANGLE_RAD = this.gallery.ANGLE_F
        }else if(current_index_offset == 0){
            this.CURRENT_ANGLE_RAD = THREE.MathUtils.lerp(this.gallery.ANGLE_S, this.gallery.ANGLE_F, current_section_progress)
        } else  if(current_index_offset < 0){
            const angle_to = this.gallery.ANGLE_S - (this.gallery.INCR_ANGLE_RAD*(current_index_offset+1))
            const angle_from = this.gallery.ANGLE_S - (this.gallery.INCR_ANGLE_RAD*current_index_offset)
            this.CURRENT_ANGLE_RAD = THREE.MathUtils.lerp(angle_from, angle_to, current_section_progress)
        }
        if(this.ITEM_INDEX == this.gallery.NUM_ITEMS-1 && this.gallery.HIDE_PROGRESS > 0){
            this.CURRENT_ANGLE_RAD = THREE.MathUtils.lerp(this.gallery.ANGLE_S, this.gallery.ANGLE_F, this.gallery.HIDE_PROGRESS)
        }
        if(this.DEV_ITEM){
            // console.log("---");
            // console.log("current_section: ", current_section);
            // console.log("current_section_progress: ", current_section_progress);
            // console.log("current_index_offset: ", current_index_offset);
            // console.log("this.CURRENT_ANGLE_RAD: ", this.CURRENT_ANGLE_RAD);
        }
    }
    // _update_data(){
    //     this.CURRENT_POS_OFFSET = THREE.MathUtils.lerp(this.START_POS_OFFSET, this.FINAL_POS_OFFSET, this.gallery.ANIM_PROGRESS)
    //     this.CURRENT_ANGLE_RAD = THREE.MathUtils.lerp(this.START_ANGLE_RAD, this.FINAL_ANGLE_RAD, this.gallery.ANIM_PROGRESS)
    // }
    _update_uniforms(){
        this.plane_material.uniforms.uCurrentAngleRad.value = this.CURRENT_ANGLE_RAD
    }
    _draw_data(){
        // this.plane_material.uniforms.uPosOffset.value = this.CURRENT_POS_OFFSET
        this.flipPlane3D.rotation.set(0, this.CURRENT_ANGLE_RAD, 0)
    }
    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:
    _lerpAngle(a, b, t) {
        let delta = ((((b - a) % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
        return a + delta * t;
    }
  
}
export default ImagePlane