import gsap from "gsap"

import { SVG, Point } from '@svgdotjs/svg.js'

import TalkDot from "./TalkDot.js"

import EasedOutValue from "../../core/utils/EasedOutValue"



class TalkItem{
    constructor (obj){
        // console.log("(TalkItem.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.itemIndex = obj.itemIndex
        this.data = obj.data
        this.parentSVG = obj.parentSVG
        this.dots_g = obj.dots_g
        //---
        this.RND1 = (Math.random()*2)-1 // -1 a 1
        this.ANGLE_OFFSET = 0
        this.LINE_RADIUS = 350
        this.POINT_RADIUS = 300
        this.RND1 = Math.random()
        this.RND2 = Math.random()
        this.RND3 = Math.random()
        //---
        this.SELECTED = true
        this.STATE = "INTRO" // INTRO, INITIAL, FAMILY_SELECTED, FAMILY_UNSELECTED, SUB_FAMILY_SELECTED, SUB_FAMILY_UNSELECTED   
        //---
        this.BASE_ANGLE_RAD = ((Math.PI * 2) / this.project.data.NUM_ITEMS)* this.itemIndex
        this.CENTER_POINT = new Point(0,0)
        this.ITEM_POINT = new Point(0,0)
        //-------------------
        this.eased_index = new EasedOutValue(this.itemIndex, 0.1, 0.001, this.app.emitter, "onUpdateRAF")
        this.eased_point_radius = new EasedOutValue(0, 0.1, 0.001, this.app.emitter, "onUpdateRAF")
        this.eased_line_radius = new EasedOutValue(this.LINE_RADIUS, 0.1, 0.001, this.app.emitter, "onUpdateRAF")
        //-------------------
        this.line = this.app.draw
            .line(0, 0, 0, 0)
            .stroke({ width: 0.2, color: "#7656ebff" })
            .addTo(obj.lines_g)
        //--
        this.dot = new TalkDot({
            app: this.app,
            project: this.project,
            item: this,
            parentSVG: obj.dots_g,
        })
        // this.dot = this.app.draw
        //     .circle(4)
        //     .fill("#751d67ff")
        //     .center(0, 0)
        //     .addTo(obj.dots_g)
        //-------------------
        this._updateData()
        this._updateLine()
        // this._updateDot()   
        //-------------------
        this.app.emitter.on("onFilterChanged", (e) => {
            this._eval_state();
        })
        this.app.emitter.on("onAnimIntro", (e) => {
            this._animIntro();
        })
        //-------------------
        this.DEV_ITEM = false
        if(this.itemIndex === 10){
            this.DEV_ITEM = true
            console.log("ITEM:"+this.itemIndex+" DATA: ", this.data);
        }
        //-------------------
    }
    //----------------------------------------------
    // PUBLIC:
    
    //----------------------------------------------
    // EVENTS:
    updateRAF(ctx){
        this._updateData()
        // this._updateLine()
        this.dot.updateRAF()
    }
    //----------------------------------------------
    // PRIVATE:
    _eval_state(){
        if(this.project.director.STATE==="INTRO"){
            this.STATE = "INTRO"
        }else if(this.project.director.STATE==="INITIAL"){
            this.STATE = "INITIAL"
        }else if(this.project.director.STATE==="FAMILY_SELECTED"){
            if(this.project.director.SELECTED_TALKS.indexOf(this.itemIndex)!==-1){
                this.STATE = "FAMILY_SELECTED"
            }else{
                this.STATE = "FAMILY_UNSELECTED"
            }
        }else if(this.project.director.STATE==="SUB_FAMILY_SELECTED"){
            if(this.project.director.SELECTED_TALKS.indexOf(this.itemIndex)!==-1){
                this.STATE = "SUB_FAMILY_SELECTED"
            }else{
                this.STATE = "SUB_FAMILY_UNSELECTED"
            }
        }
        //--
        this._paint_state()
    }
    _paint_state(){
        console.log("STATE: " + this.STATE);
        let newPointRadius = 0
        let newLineRadius = this.LINE_RADIUS
        switch(this.STATE){
            case "INTRO":
                break;
            case "INITIAL":
                newLineRadius = this.LINE_RADIUS
                newPointRadius = this._filterRadiusByStatus(150, this.data.state, 90)
                // this.dot.fill({ color: "#751d67ff" })
                // this.dot.colorTo("#751d67ff")
                this._paint_status_color()
                break;
                
            case "FAMILY_SELECTED":
                newLineRadius = this.LINE_RADIUS
                newPointRadius = this._filterRadiusByStatus(150, this.data.state, 90)
                this._paint_status_color()
                break;
                
            case "FAMILY_UNSELECTED":
                newLineRadius = this.LINE_RADIUS
                newPointRadius = 0
                // this.dot.fill({ color: "#7656ebff" })
                this.dot.colorTo("#7656ebff")
                break;
                    
            case "SUB_FAMILY_SELECTED":
                newLineRadius = 400
                newPointRadius = this._filterRadiusByStatus(200, this.data.state, 100)
                this._paint_status_color()
                break;  
                
            case "SUB_FAMILY_UNSELECTED":
                newLineRadius = 400
                newPointRadius = 0
                // this.dot.fill({ color: "#7656ebff" })
                 this.dot.colorTo("#7656ebff")

        }

        this.eased_point_radius.set(newPointRadius)
        this.eased_line_radius.set(newLineRadius)

        this.eased_index.set(this.project.director.CURRENT_INDEX_SORTING.indexOf(this.itemIndex))
    }

    _paint_status_color(){
        if(this.data.state===2){
            // this.dot.fill({ color: "#76f2f5ff" })
            this.dot.colorTo("#76f2f5ff")
        }else if(this.data.state===1){
            // this.dot.fill({ color: "#3df393ff" })
            this.dot.colorTo("#3df393ff")
        }else if(this.data.state===0){
            // this.dot.fill({ color: "#fed35dff" })
            this.dot.colorTo("#fed35dff")
        }
    }

    _updateData() {
        // if(this.project.director.SELECTED_TALKS.length===0){
        //     // NO TALKS SELECTED
        //     this.this.CURRENT_ANGLE_RAD_OFFSET = 0
        // }else{
        //     this.this.CURRENT_ANGLE_RAD_OFFSET = Math.cos(ctx.time*0.1) 
        // }
        // this.BASE_ANGLE_RAD = ((Math.PI * 2) / this.project.data.NUM_ITEMS)* this.eased_index.get()
        this.BASE_ANGLE_RAD = ((Math.PI * 2) / this.project.data.NUM_ITEMS)* this.itemIndex
        // console.log("this.BASE_ANGLE_RAD: " + this.itemIndex + " ", this.BASE_ANGLE_RAD);
        this.CURRENT_ANGLE_RAD = this.BASE_ANGLE_RAD + this.project.EASED_RADAR_ROTATION_ANGLE.get() * (Math.PI / 180) 
        // console.log("sangle: ", angle);

        this.ITEM_POINT.x = this.CENTER_POINT.x + this.eased_point_radius.get() * Math.cos(this.CURRENT_ANGLE_RAD)
        this.ITEM_POINT.y = this.CENTER_POINT.y + this.eased_point_radius.get() * Math.sin(this.CURRENT_ANGLE_RAD)

        // console.log("this.ITEM_POINT: ", this.ITEM_POINT);

        
    }
    _updateLine() {
        const outsidePoint = new Point()
        outsidePoint.x = this.CENTER_POINT.x + (this.eased_line_radius.get()) * Math.cos(this.CURRENT_ANGLE_RAD)
        outsidePoint.y = this.CENTER_POINT.y + (this.eased_line_radius.get()) * Math.sin(this.CURRENT_ANGLE_RAD)

        this.line.plot(
            this.CENTER_POINT.x, this.CENTER_POINT.y,
            // this.ITEM_POINT.x,this.ITEM_POINT.y
            outsidePoint.x,outsidePoint.y
        )

        this.line.opacity(1-this.project.OUTRO_PROGRESS)

    }
    // _updateDot() {
    //     // this.dot.center(this.ITEM_POINT.x, this.ITEM_POINT.y)
        
        
    // }
    //----------------------------------------------
    // AUX:
    _get_3rdPoint(centerPoint, itemPoint, radius) {
        // 1. Calculate the vector from Center to Item
        const dx = itemPoint.x - centerPoint.x;
        const dy = itemPoint.y - centerPoint.y;

        // 2. Calculate the magnitude (length) of the vector
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Safety check to prevent division by zero if points are identical
        if (distance === 0) {
            return new Point(centerPoint.x, centerPoint.y);
        }

        // 3. Calculate the normalized unit vector components
        // and multiply by the desired radius immediately
        const ratio = radius / distance;
        
        // 4. Calculate the new coordinates
        // New = Center + (Direction * Ratio)
        const newX = centerPoint.x + (dx * ratio);
        const newY = centerPoint.y + (dy * ratio);

        // Return a new SVG.Point
        return new Point(newX, newY);
    }
    _filterRadiusByStatus(baseRadius, status, ringAmplitude){
        let newPointRadius = baseRadius  
        if(status===2){
            newPointRadius = (baseRadius + (ringAmplitude*1))+(ringAmplitude*this.RND1)
        }else if(status===1){
            newPointRadius = (baseRadius + (ringAmplitude*0))+(ringAmplitude*this.RND1)
        }else if(status===0){
            newPointRadius = (baseRadius + (ringAmplitude*-1))+(ringAmplitude*this.RND1)
        }
        return newPointRadius
    }
  
}
export default TalkItem