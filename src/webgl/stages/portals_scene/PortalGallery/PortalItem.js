//import gsap from "gsap"
import * as THREE from 'three'

import vertex from "./_shaders/basic_vertex.glsl"
import fragment from "./_shaders/portalAnim_fragment.glsl"

class PortalItem{
    constructor (obj){
        console.log("(PortalItem.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.stage = obj.stage
        this.gallery = obj.gallery
        this.parent3D = obj.parent3D
        this.ITEM_ID = obj.ITEM_ID
        this.ITEM_INDEX = obj.ITEM_INDEX
        //-----------------------------
        this.DEV_ITEM = false
        if(this.ITEM_INDEX == 7) this.DEV_ITEM = true
        //-----------------------------

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

        //-----------------------------
        this.SHADE_RATIO = 0
        this.REVERSED = 0
        this.ALPHA = 0
        //--
        this.PLANE_WIDTH = 670
        this.PLANE_HEIGHT = 440
        // this.Y_EXTRA_SCALE = 0.8
        this.Y_EXTRA_SCALE_L = 0.2
        this.Y_EXTRA_SCALE_R = 0.8
        //--
        this.OFFSET_X = 400
        this.OFFSET_Y = 0
        //--
        this.TL_IMAGE_DEG0_PX = new THREE.Vector2(336, 284)
        this.TR_IMAGE_DEG0_PX = new THREE.Vector2(1422, 284)
        this.BR_IMAGE_DEG0_PX = new THREE.Vector2(1422, -284)
        this.BL_IMAGE_DEG0_PX = new THREE.Vector2(336, -284)

        // this.TL_IMAGE_DEG90_PX = new THREE.Vector2(-633, 500)
        // this.TR_IMAGE_DEG90_PX = new THREE.Vector2(633, 500)
        // this.BR_IMAGE_DEG90_PX = new THREE.Vector2(633, -500)
        // this.BL_IMAGE_DEG90_PX = new THREE.Vector2(-633, -500)
        this.TL_IMAGE_DEG90_PX = new THREE.Vector2(0, 500)
        this.TR_IMAGE_DEG90_PX = new THREE.Vector2(1887, 500)
        this.BR_IMAGE_DEG90_PX = new THREE.Vector2(1887, -500)
        this.BL_IMAGE_DEG90_PX = new THREE.Vector2(0, -500)
        //--
        this.TL_IMAGE_PX = new THREE.Vector2(0, 0)
        this.TR_IMAGE_PX = new THREE.Vector2(0, 0)
        this.BR_IMAGE_PX = new THREE.Vector2(0, 0)
        this.BL_IMAGE_PX = new THREE.Vector2(0, 0)
        // //--
        // this.TL_DEG0_PX = new THREE.Vector2(590, 275)
        // this.TR_DEG0_PX = new THREE.Vector2(1360, 275)
        // this.BR_DEG0_PX = new THREE.Vector2(1360, -275)
        // this.BL_DEG0_PX = new THREE.Vector2(590, -275)
        //--
        this.TL_DEG0_PX = new THREE.Vector2(416, 250)
        this.TR_DEG0_PX = new THREE.Vector2(1360, 250)
        this.BR_DEG0_PX = new THREE.Vector2(1360, -250)
        this.BL_DEG0_PX = new THREE.Vector2(416, -250)
        //--
        this.TL_PX = new THREE.Vector2(0, 0)
        this.TR_PX = new THREE.Vector2(0, 0)
        this.BR_PX = new THREE.Vector2(0, 0)
        this.BL_PX = new THREE.Vector2(0, 0)
        //--
        this.TL_UV = new THREE.Vector2(0, 0)
        this.TR_UV = new THREE.Vector2(0, 0)
        this.BR_UV = new THREE.Vector2(0, 0)
        this.BL_UV = new THREE.Vector2(0, 0)
        //-----------------------------

        this.geometry = new THREE.PlaneGeometry(this.stage.ORIGINAL_STAGE_SIZE.width, this.stage.ORIGINAL_STAGE_SIZE.height, 1, 1);
        this.material = new THREE.ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms: {
                uBaseTexture: { value: this.stage.loader.get_texture(this.ITEM_ID)},
                uTL: { value: new THREE.Vector2(0, 0) },
                uTR: { value: new THREE.Vector2(0, 0) },
                uBR: { value: new THREE.Vector2(0, 0) },
                uBL: { value: new THREE.Vector2(0, 0) },
                uImageTL: { value: new THREE.Vector2(0, 0)},
                uImageTR: { value: new THREE.Vector2(0, 0)},
                uImageBR: { value: new THREE.Vector2(0, 0)},
                uImageBL: { value: new THREE.Vector2(0, 0)},
                uMousePan: { value: new THREE.Vector2(0, 0) },
                uShadeRatio: { value: 0.0 },
                uAlpha: { value: 0.0 },
                uReversed : { value: 0 },
                uReverseColor: {value: new THREE.Color().setHex(0x490d2e).convertLinearToSRGB()},
                uEdgeSoftness: { value: 0.001 },
            },
            transparent: true,
        }) 
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(0, 0, -this.ITEM_INDEX*10)
        this.parent3D.add(this.mesh);
    }
    //----------------------------------------------
    // PUBLIC:
    
    //----------------------------------------------
    // UPDATE RAF:
    update_RAF(){
        this._update_CURRENT_ANGLE_RAD()
        this._update_POINTS_PX()
        this._update_SHADE_RATIO()
        this._update_uniforms()
        
        // console.log(this.app.mouse.POSITION_EASED.x.get());
    }

    //----------------------------------------------
    // PRIVATE:
    _update_SHADE_RATIO(){
        
        const abs_current_angle = Math.abs(this.CURRENT_ANGLE_RAD)
        const abs_angle_s = Math.abs(this.gallery.ANGLE_S)
        const abs_angle_m = Math.abs(this.gallery.ANGLE_M)
        const abs_angle_f = Math.abs(this.gallery.ANGLE_F)

        console.log("abs_current_angle:", abs_current_angle);
        console.log("abs_angle_s: ", abs_angle_s);
        console.log("abs_angle_m: ", abs_angle_m);
        console.log("abs_angle_f: ", abs_angle_f);
        //--
        // Calculating shade ratio:

        if(abs_current_angle <= abs_angle_s){
            // console.log("*1");
            this.ALPHA = 1
            this.REVERSED = 0
            this.SHADE_RATIO = 1-(abs_current_angle/abs_angle_s)
        }else if(abs_current_angle > abs_angle_s && abs_current_angle <= abs_angle_m){
            // console.log("*2");
            this.ALPHA = 1
            this.REVERSED = 0
            const angleRange = abs_angle_m - abs_angle_s
            this.SHADE_RATIO = (abs_current_angle - abs_angle_s) / angleRange
        }else if(abs_current_angle > abs_angle_m){
            // console.log("*3");
            const angleRange = abs_angle_f - abs_angle_m
            this.ALPHA = 1 - ((abs_current_angle - abs_angle_m) / angleRange)
            this.REVERSED = 1
            this.SHADE_RATIO = 1
        }
        console.log("this.SHADE_RATIO: ", this.SHADE_RATIO);

    }
    _update_POINTS_PX(){
        // CALCULATING X COMPONENT:
        const temp_TL = this.TL_DEG0_PX.clone().rotateAround(new THREE.Vector2(0, this.TL_DEG0_PX.y), this.CURRENT_ANGLE_RAD)
        this.TL_PX.x = temp_TL.x
        //--
        const temp_TR = this.TR_DEG0_PX.clone().rotateAround(new THREE.Vector2(0, this.TR_DEG0_PX.y), this.CURRENT_ANGLE_RAD)
        this.TR_PX.x = temp_TR.x
        //--
        const temp_BR = this.BR_DEG0_PX.clone().rotateAround(new THREE.Vector2(0, this.BR_DEG0_PX.y), this.CURRENT_ANGLE_RAD)
        this.BR_PX.x = temp_BR.x
        //--
        const temp_BL = this.BL_DEG0_PX.clone().rotateAround(new THREE.Vector2(0, this.BL_DEG0_PX.y), this.CURRENT_ANGLE_RAD)
        this.BL_PX.x = temp_BL.x
        
        
        // CALCULATING Y COMPONENT:
        let ratio180 = -this.CURRENT_ANGLE_RAD / Math.PI // 0 to 1 in the 180º turn
        if(ratio180<=0) ratio180 = 0
        if(ratio180>=1) ratio180 = 1
        const proyectedRatio180 = this._proyectionMap(ratio180) // mapped in a cosine way
        const ratio90 = THREE.MathUtils.clamp(ratio180*2, 0, 1) // 0 to 1 in the first 90º turn

        // const axisOffsetRatio_L = this.TL_DEG0_PX.x/this.TR_DEG0_PX.x // ratio of the distance to axis. Foremost R points are 1 innermost are 0
        const rotationScale_L = 1+(this.Y_EXTRA_SCALE_L*proyectedRatio180)
        
        // const axisOffsetRatio_R = 1 // ratio of the distance to axis. Foremost R points are 1 innermost are 0
        const rotationScale_R = 1+(this.Y_EXTRA_SCALE_R*proyectedRatio180)

        // console.log("---");
        // console.log("");
        // console.log("ratio180: ", ratio180);
        // console.log("proyectedRatio180: ", proyectedRatio180);
        // console.log("axisOffsetRatio_L: ", axisOffsetRatio_L);
        // console.log("rotationScale_L: ", rotationScale_L);
        // console.log("axisOffsetRatio_R: ", axisOffsetRatio_R);
        // console.log("rotationScale_R: ", rotationScale_R);
        // console.log("this.CURRENT_ANGLE_RAD: ", this.CURRENT_ANGLE_RAD);
        // console.log("Math.degrees(this.CURRENT_ANGLE_RAD): ", THREE.MathUtils.radToDeg(this.CURRENT_ANGLE_RAD));
        //--
        const framePanning = this.app.mouse.POSITION_EASED.y.get()*ratio180*50
        this.TL_PX.y = (this.TL_DEG0_PX.y*rotationScale_L)+framePanning
        this.TR_PX.y = (this.TR_DEG0_PX.y*rotationScale_R)+framePanning
        this.BR_PX.y = (this.BR_DEG0_PX.y*rotationScale_R)+framePanning
        this.BL_PX.y = (this.BL_DEG0_PX.y*rotationScale_L)+framePanning
        //


        this.TL_IMAGE_PX.lerpVectors(this.TL_IMAGE_DEG0_PX, this.TL_IMAGE_DEG90_PX, ratio90)
        this.TR_IMAGE_PX.lerpVectors(this.TR_IMAGE_DEG0_PX, this.TR_IMAGE_DEG90_PX, ratio90)
        this.BR_IMAGE_PX.lerpVectors(this.BR_IMAGE_DEG0_PX, this.BR_IMAGE_DEG90_PX, ratio90)
        this.BL_IMAGE_PX.lerpVectors(this.BL_IMAGE_DEG0_PX, this.BL_IMAGE_DEG90_PX, ratio90)
    }
    _update_CURRENT_ANGLE_RAD(){
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
            if(this.CURRENT_ANGLE_RAD > 0){
                this.CURRENT_ANGLE_RAD = 0
            }

            //-------------------------- TEST!
            if(this.gallery.TEST_SINGLE_MODE) this.CURRENT_ANGLE_RAD *= 4 // to enhance the effect
            //--------------------------

            // console.log("this.CURRENT_ANGLE_RAD: ", this.CURRENT_ANGLE_RAD);
            if(this.DEV_ITEM){
                // console.log("---");
                // console.log("current_section: ", current_section);
                // console.log("current_section_progress: ", current_section_progress);
                // console.log("current_index_offset: ", current_index_offset);
                // console.log("this.CURRENT_ANGLE_RAD: ", this.CURRENT_ANGLE_RAD);
            }
        }
    _update_uniforms(){
        this.material.uniforms.uTL.value = this._PX_to_UV(this.TL_PX)
        this.material.uniforms.uTR.value = this._PX_to_UV(this.TR_PX)
        this.material.uniforms.uBR.value = this._PX_to_UV(this.BR_PX)
        this.material.uniforms.uBL.value = this._PX_to_UV(this.BL_PX)
        //--
        this.material.uniforms.uImageTL.value = this._PX_to_UV(this.TL_IMAGE_PX)
        this.material.uniforms.uImageTR.value = this._PX_to_UV(this.TR_IMAGE_PX)
        this.material.uniforms.uImageBR.value = this._PX_to_UV(this.BR_IMAGE_PX)
        this.material.uniforms.uImageBL.value = this._PX_to_UV(this.BL_IMAGE_PX)

        this.material.uniforms.uMousePan.value.x = this.app.mouse.POSITION_EASED.x.get()
        this.material.uniforms.uMousePan.value.y = this.app.mouse.POSITION_EASED.y.get()

        this.material.uniforms.uShadeRatio.value = this.SHADE_RATIO
        this.material.uniforms.uReversed.value = this.REVERSED
        this.material.uniforms.uAlpha.value = this.ALPHA

        // console.log("this.material.uniforms.uTL.value: ", this.material.uniforms.uTL.value);
        // console.log("this.material.uniforms.uTR.value: ", this.material.uniforms.uTR.value);
        // console.log("this.material.uniforms.uBR.value: ", this.material.uniforms.uBR.value);
        // console.log("this.material.uniforms.uBL.value: ", this.material.uniforms.uBL.value);
        // console.log("this.material.uniforms.uImageTL.value: ", this.material.uniforms.uImageTL.value);
        // console.log("this.material.uniforms.uImageTR.value: ", this.material.uniforms.uImageTR.value);
        // console.log("this.material.uniforms.uImageBR.value: ", this.material.uniforms.uImageBR.value);
        // console.log("this.material.uniforms.uImageBL.value: ", this.material.uniforms.uImageBL.value);
    }


    _PX_to_UV(px_point_v2){
        // console.log("---");
        
        const filtered_px_point = px_point_v2.clone()
        filtered_px_point.x = (filtered_px_point.x+(this.stage.STAGE_SIZE.width*0.5))-this.OFFSET_X
        filtered_px_point.y = filtered_px_point.y+(this.stage.STAGE_SIZE.height*0.5)-this.OFFSET_Y
        // console.log("this.stage.STAGE_SIZE: ", this.stage.STAGE_SIZE);
        // console.log("px_point_v2: ", px_point_v2);
        // console.log("filtered_px_point: ", filtered_px_point);
        const uv_point = new THREE.Vector2(0, 0)
        uv_point.x = filtered_px_point.x / this.stage.STAGE_SIZE.width
        uv_point.y = filtered_px_point.y / this.stage.STAGE_SIZE.height
        // console.log("uv_point: ", uv_point);
        return uv_point
    }

    //----------------------------------------------
    // AUX:
    _proyectionMap(t) {
        // // return Math.sin((Math.PI * 0.5) * t)
        return this._sinMap(t)
        return this._cosMap(t)
    }
    _sinMap(t) {
        return Math.sin(Math.PI * t);
    }
    _cosMap(t) {
        return 0.5 - 0.5 * Math.cos(2 * Math.PI * t);
    }
  
}
export default PortalItem