import gsap from "gsap"

import MathUtils from "../../MathUtils"

class GroupTransforms{
    constructor (obj){
        // console.log("(GroupTransforms.CONSTRUCTORA): ", obj)
        this.rnd = Math.random()
        this.path = obj.path
        //--
        this.translate_g = this.path.contSVG
        this.rotate_g = this.path.rotate_g
        this.scale_g = this.path.scale_g
        // console.log("       this.translate_g: ", this.translate_g);
        // console.log("       this.rotate_g: ", this.rotate_g);
        //--
        this.translateTo = null
        //--
        this.translateFrom = null
        this.scaleFrom = null
        this.rotateFrom = null
        //--
        this.translateCurrent = null
        this.scaleCurrent = null
        this.rotateCurrent = null
        //--
        this.gsapAnim = null
        //--
        this.ACTIVE = false
        this.PROGRESS = 0

    }
    //----------------------------------------------
    // PUBLIC:
    translate(translateTo, duration, delay, ease, animId){
        // console.log("(GroupTransforms.translate): ", duration, delay, ease);
        this.ACTIVE = true
        //--
        this.animId = animId
        this.translateTo = translateTo
        const currentTransform = this.translate_g.transform()
        // console.log("currentTransform: ", currentTransform);
        this.translateFrom = [currentTransform.translateX, currentTransform.translateY]
        //--
        this.gsapAnim = gsap.to(this, {
            PROGRESS: 1,
            duration: duration,
            delay: delay,
            ease: ease,
            onUpdate: ()=>{
                this._update_translate(this.PROGRESS)
            },
            onComplete: ()=>{
                // console.lsog(this.rnd);
                this.PROGRESS = 0
                this.ACTIVE = false
                this.gsapAnim = null
                this.path.emitter.emit("onTransitionComplete", this.animId)
            }
        })
    }
    translateFromTo(translateFrom, translateTo, progress){
        this.translateCurrent = MathUtils.lerpArray(translateFrom, translateTo, progress)
        this.translate_g.attr({ transform: `translate(${this.translateCurrent[0]}, ${this.translateCurrent[1]})` })
    }
    rotate(rotateTo, duration, delay,  ease, animId){
        this.ACTIVE = true
        //--
        this.animId = animId
        this.rotateTo = rotateTo
        const currentTransform = this.rotate_g.transform()
        this.rotateFrom = currentTransform.rotate
        // console.log(this.rotateFrom+" -> "+this.rotateTo);
        //--
        this.gsapAnim = gsap.to(this, {
            PROGRESS: 1,
            duration: duration,
            delay: delay,
            ease: ease,
            onUpdate: ()=>{
                this._update_rotate(this.PROGRESS)
            },
            onComplete: ()=>{
                // console.log("onComplete", this.rnd);
                this.PROGRESS = 0
                this.ACTIVE = false
                this.gsapAnim = null
                this.path.emitter.emit("onTransitionComplete", this.animId)
            }
        })
    }
    rotateFromTo(rotateFrom, rotateTo, progress){
        this.rotateCurrent = MathUtils.lerp(rotateFrom, rotateTo, progress)
        this.rotate_g.attr({ transform: "rotate("+this.rotateCurrent+")"})
    }

    scaleFromTo(scaleFrom, scaleTo, progress){
        this.scaleCurrent = MathUtils.lerpArray(scaleFrom, scaleTo, progress)
        this.path.scale_g.attr({ transform: `scale(${this.scaleCurrent[0]}, ${this.scaleCurrent[1]})` })
    }

    stop(){
        this.gsapAnim?.kill()
        this.ACTIVE = false
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:
    _update_rotate(progress) {
        this.rotateCurrent = MathUtils.lerp(this.rotateFrom, this.rotateTo, progress)
        // console.log("rotateCurrent: ", this.rotateCurrent);
        this.rotate_g.attr({ transform: "rotate("+this.rotateCurrent+")"})
    }
    _update_translate(progress) {
        this.translateCurrent = MathUtils.lerpArray(this.translateFrom, this.translateTo, progress)
        this.translate_g.attr({ transform: `translate(${this.translateCurrent[0]}, ${this.translateCurrent[1]})` })
    }
    //----------------------------------------------
    // AUX:

  
}
export default GroupTransforms