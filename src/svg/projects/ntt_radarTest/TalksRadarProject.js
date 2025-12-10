import gsap from "gsap"


import TalkItem from "./TalkItem"
import Industries from "./Industries"
import FakeData from "./FakeData"

import FakePanel from './FakePanel.js';
import RadarDirector from "./RadarDirector.js";

import EasedOutValue from "../../core/utils/EasedOutValue.js";



class TalksRadarProject{
    constructor (obj){
        // console.log("(TalksRadarProject.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.id= obj.id
        this.parentSVG = obj.parentSVG
        //---
        this.draw = this.app.draw
        //-------------------
        this.ITEMS = []
        //-------------------
        this.TALK_ROLLOVER = false
        this.TALKS_SELECTED = false
        this.RADAR_INITIAL_ANGLE = -90
        this.RADAR_ROTATION_ANGLE = this.RADAR_INITIAL_ANGLE
        this.EASED_RADAR_ROTATION_ANGLE = new EasedOutValue(this.RADAR_INITIAL_ANGLE, 0.1, 0.001, this.app.emitter, "onUpdateRAF")
        this.RADAR_RAF_ANGLE_INCREMENT = 40; // degrees per second
        this.EASED_RADAR_RAF_ANGLE_INCREMENT = new EasedOutValue(this.RADAR_RAF_ANGLE_INCREMENT, 0.1, 0.001, this.app.emitter, "onUpdateRAF")
        //-------------------
        this.OUTRO_PROGRESS = 0
        //-------------------
        this.data = new FakeData({ app: this.app, project: this });
        this.panel = new FakePanel({ app: this.app, project: this });
        this.director = new RadarDirector({ app: this.app, project: this });
        //-------------------
        this.contSVG = this.draw.group().id("radar_g").addTo(this.parentSVG)
        this.lines_g = this.draw.group().id("lines_g").addTo(this.contSVG)
        this.lines_g.css({ 'will-change': 'transform' });
        this.dots_g = this.draw.group().id("dots_g").addTo(this.contSVG)
        this.dots_g.css({ 'will-change': 'transform' });
        this.buttons_g = this.draw.group().id("buttons_g").addTo(this.contSVG)
        this.industries_g = this.draw.group().id("industries_g").addTo(this.contSVG)
        this.tooltip_g = this.draw.group().id("tooltip_g").addTo(this.contSVG)
        //-------------------
        // console.log("this.app.size.RESPONSIVE_SCALE.x: ", this.app.size.RESPONSIVE_SCALE.x);
        this.contSVG.transform({ scale: this.app.size.RESPONSIVE_SCALE.x });
        //-------------------
        for (let i = 0; i < this.data.NUM_ITEMS; i++) {
            // console.log("*");
            const item = new TalkItem({
                app: this.app,
                project: this,
                itemIndex: i,
                data: this.data.get_itemAt(i),
                dots_g: this.dots_g,
                lines_g: this.lines_g,
            });
            this.ITEMS.push(item)
        }
        //-------------------
        this.industries = new Industries({
            app: this.app,
            project: this,
            industries_g: this.industries_g 
        });
        //-------------------
        this.director.init();
        //-------------------
        //--------------------------------------
        // Call this after the page loads
        // document.addEventListener('DOMContentLoaded', () => {
            //     createFakePanel();
            // });
        //--------------------------------------
        this.app.emitter.on("onDotRollover", (e) => {
            this.TALK_ROLLOVER = true
            this.EASED_RADAR_RAF_ANGLE_INCREMENT.set(0)
        })
        this.app.emitter.on("onDotRollout", (e) => {
            this.TALK_ROLLOVER = false
            this.EASED_RADAR_RAF_ANGLE_INCREMENT.set(60)
        })

    }
    //----------------------------------------------
    // PUBLIC:
    
    //----------------------------------------------
    // EVENTS:
    updateRAF(ctx){
        this.OUTRO_PROGRESS = this.app.scrolls.getItem("scroll_main").PROGRESS
        if(this.OUTRO_PROGRESS >0){
            this.IN_OUTRO = true
        }else{
            this.IN_OUTRO = false
        }
        //--
        const s = 1 - this.OUTRO_PROGRESS; // tu valor calculado
        this.dots_g.transform({ scale: s });
        this.lines_g.transform({ scale: s });
        //--
        // Multiply the increment by the Delta Time (ctx.delta)
        // ctx.delta is the time passed in seconds since the last frame
        const currentAngle = this.EASED_RADAR_ROTATION_ANGLE.get();
        const speedPerSecond = this.EASED_RADAR_RAF_ANGLE_INCREMENT.get();
        // Move: Position + (Velocity * Time)
        this.EASED_RADAR_ROTATION_ANGLE.set(currentAngle + (speedPerSecond * ctx.delta));


        for (let i = 0; i < this.data.NUM_ITEMS; i++) {
            const item = this.ITEMS[i];
            item.updateRAF(ctx);
        }
        this.industries.updateRAF(ctx);
    }
    //----------------------------------------------
    // PRIVATE:
    _stopRotation(){

    }
    //----------------------------------------------
    // AUX:

  
}
export default TalksRadarProject