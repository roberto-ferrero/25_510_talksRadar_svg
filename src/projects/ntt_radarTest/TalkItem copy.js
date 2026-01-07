import gsap from "gsap"

import { SVG, Point } from '@svgdotjs/svg.js'

import EasedOutValue from "../../core/utils/EasedOutValue"



class TalkItem{
    constructor (obj){
        console.log("(TalkItem.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.itemIndex = obj.itemIndex
        this.data = obj.data
        this.parentSVG = obj.parentSVG
        //---
        this.ANGLE_OFFSET = 0
        this.RADIUS = 300
        this.RND1 = Math.random()
        this.RND2 = Math.random()
        this.RND3 = Math.random()
        //---
        this.SELECTED = true
        this.STATE = "NORMAL" // NORMAL, SELECTED, UNSELECTED   
        //---
        this.BASE_ANGLE_RAD = ((Math.PI * 2) / this.project.data.NUM_ITEMS)* this.itemIndex
        this.CENTER_POINT = new Point(0,0)
        this.ITEM_POINT = new Point(0,0)
        //-------------------
        this.eased_index = new EasedOutValue(this.itemIndex, 0.1, 0.001, this.app.emitter, "onUpdateRAF")
        this.eased_radius = new EasedOutValue(this.RADIUS, 0.1, 0.001, this.app.emitter, "onUpdateRAF")
        //-------------------
        this.line = this.app.draw
            .line(0, 0, 0, 0)
            .stroke({ width: 0.2, color: "#7656ebff" })
            .addTo(obj.lines_g)
        this.dot = this.app.draw
            .circle(4)
            .fill("#751d67ff")
            .center(0, 0)
            .addTo(obj.dots_g)
        //-------------------
        this._updateLine()
        this._updateDot()   
        //-------------------
        this.app.emitter.on("onFilterChanged", (e) => {
            this._eval_state();
        })
    }
    //----------------------------------------------
    // PUBLIC:
    
    //----------------------------------------------
    // EVENTS:
    updateRAF(ctx){
        // console.log("(TalkItem.updateRAF): ", ctx);
        // this.ANGLE_OFFSET += 0.01          // animate rotation
        //this.ANGLE_OFFSET = Math.cos(ctx.time*0.1)          // animate rotation
        //this.RADIUS = 400*this.RND1 + Math.sin(ctx.time * 0.9*this.RND3) * 200**this.RND2  // animate radius pulsation

        //--
        this._updateLine()
        this._updateDot()
    }
    //----------------------------------------------
    // PRIVATE:
    _eval_state(){
        if(this.project.director.SELECTED_TALKS.length===0){
            this.STATE = "NORMAL"
        }else{
            if(this.project.director.SELECTED_TALKS.indexOf(this.itemIndex)!==-1){
                this.STATE = "SELECTED"
            }else{
                this.STATE = "UNSELECTED"
            }
        }
        this._paint_state()
    }
    _paint_state(){
        let newRadius = this.RADIUS
        switch(this.STATE){
            case "NORMAL":
                
                this.dot.fill({ color: "#751d67ff" })
                break;
            case "SELECTED":
                // console.log("SELECTED: ", this.itemIndex);
                newRadius = this.RADIUS+30
                if(this.project.director.SELECTION_TYPE==="INDUSTRIES"){
                    this.dot.fill({ color: "#2ecc71ff" }) // Verde (Industries)
                }else if(this.project.director.SELECTION_TYPE==="FOUNDRIES"){
                    this.dot.fill({ color: "#00d2d3ff" }) // Cyan (Foundries)
                }
                // this.dot.fill({ color: "#ff0000ff" })
                break;
            case "UNSELECTED":
                newRadius = this.RADIUS-100
                this.dot.fill({ color: "#aaaaaaff" })
                break;
        }
        newRadius = newRadius + (this.data.state*10)
        this.eased_radius.set(newRadius)

        this.eased_index.set(this.project.director.CURRENT_INDEX_SORTING.indexOf(this.itemIndex))
    }
    // _eval_state_old(){
    //     const selectedIndustries = this.project.director.SELECTED_INDUSTRIES;
    //     const selectedFoundries = this.project.director.SELECTED_FOUNDRIES;
    //     const itemIndustries = this.data.industries; // Array of industry IDs for this item
    //     const itemFoundries = this.data.foundries;   // Array of foundry IDs for this item
    //     //-----
    //     // console.log("--");
    //     // console.log("Selected Industries:", selectedIndustries, "Selected Foundries:", selectedFoundries);
    //     // console.log("Item Industries:", itemIndustries, "Item Foundries:", itemFoundries);
    //     //-----
    //     let selected = false;
    //     if ((!selectedIndustries || selectedIndustries.length === 0) && (!selectedFoundries || selectedFoundries.length === 0)){
    //         selected = true;
    //     } else {
    //         const constainsIndustries = this._containsOR(selectedIndustries, itemIndustries);
    //         const constainsFoundries = this._containsOR(selectedFoundries, itemFoundries);
    //         // console.log("Contains Industries:", constainsIndustries, "Contains Foundries:", constainsFoundries);
    //         if(constainsFoundries || constainsIndustries){
    //             selected = true;
    //         }else{
    //             selected = false;
    //         }
    //     }
    //     this.selected = selected; // Assuming you want to store the result
    //     // console.log("Item selected state:", selected);

    //     if(selected){
    //         this.dot.fill({ color: "#ff0000ff" }) // Highlight color when selected
    //     } else {
    //         this.dot.fill({ color: "#751d67ff" }) // Default color when not selected
    //     }
    // }

    // _eval_state(){

    // }

    _updateLine() {
        // if(this.project.director.SELECTED_TALKS.length===0){
        //     // NO TALKS SELECTED
        //     this.ANGLE_OFFSET = 0
        // }else{
        //     this.ANGLE_OFFSET = Math.cos(ctx.time*0.1) 
        // }
        this.BASE_ANGLE_RAD = ((Math.PI * 2) / this.project.data.NUM_ITEMS)* this.eased_index.get()
        const angle = this.BASE_ANGLE_RAD + this.project.EASED_RADAR_ROTATION_ANGLE.get() * (Math.PI / 180) 
        // console.log("angle: ", angle);

        this.ITEM_POINT.x = this.CENTER_POINT.x + this.eased_radius.get() * Math.cos(angle)
        this.ITEM_POINT.y = this.CENTER_POINT.y + this.eased_radius.get() * Math.sin(angle)

        // console.log("this.ITEM_POINT: ", this.ITEM_POINT);

        this.line.plot(
            this.CENTER_POINT.x, this.CENTER_POINT.y,
            this.ITEM_POINT.x,this.ITEM_POINT.y
        )
    }
    _updateDot() {
        this.dot.center(this.ITEM_POINT.x, this.ITEM_POINT.y)
    }
    //----------------------------------------------
    // AUX:
    _containsOR = (targetArray, checkArray) => {
        // Convert the target array to a Set for O(1) lookups
        const targetSet = new Set(targetArray);
        return checkArray.some(item => targetSet.has(item));
    };
  
}
export default TalkItem