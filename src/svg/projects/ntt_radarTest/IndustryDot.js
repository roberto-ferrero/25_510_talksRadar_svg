import gsap from "gsap"

import { SVG, Point } from '@svgdotjs/svg.js'

import TalkDot from "./TalkDot.js"

import EasedOutValue from "../../core/utils/EasedOutValue"



class IndustryDot{
    constructor (obj){
        console.log("(IndustryDot.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.industries_g = obj.industries_g
        this.index = obj.index
        this.angle = obj.angle
        this.radius = obj.radius
        //-------------------
        this.ITEM_POINT = new Point(0,0)
        this.ITEM_POINT.x = this.radius * Math.cos(this.angle)
        this.ITEM_POINT.y = this.radius * Math.sin(this.angle)
        //-------------------
        this.dot = this.app.draw
            .circle(20)
            .fill("#ffffffff") // Usamos la variable
            .center(this.ITEM_POINT.x, this.ITEM_POINT.y)
            .addTo(this.industries_g)
            .opacity(0.0)
    }
    //----------------------------------------------
    // PUBLIC:
    
    //----------------------------------------------
    // EVENTS:
    updateRAF(ctx){
        if(this.project.IN_OUTRO){
            const radius = this.radius +((1-this.project.OUTRO_PROGRESS)*50)
            const angle = this.angle - ((1-this.project.OUTRO_PROGRESS)*Math.PI*0.1)
            this.ITEM_POINT.x = radius * Math.cos(angle)
            this.ITEM_POINT.y = radius * Math.sin(angle)
            this.dot.show().center(this.ITEM_POINT.x, this.ITEM_POINT.y).opacity(this.project.OUTRO_PROGRESS)
        }else{
            this.dot.hide()
        }
        // console.log("++");
    }
    //----------------------------------------------
    // PRIVATE:
    
    
    //----------------------------------------------
    // AUX:

}
export default IndustryDot