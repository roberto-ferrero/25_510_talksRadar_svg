//import gsap from "gsap"
import { SVG, Point } from '@svgdotjs/svg.js'
import { EventEmitter } from 'events';

import PathPointC from './PathPointC'
import { Group } from 'three';
import GroupTransforms from './g_transitions/GroupTransforms';

class SVGPath{
    constructor (obj){
        // console.log("(SVGPath.CONSsTRUCTORA): ", obj)
        this.app = obj.app
        this.draw = this.app.draw
        this.id= obj.id
        this.fill = obj.fill 
        this.stroke = obj.stroke 
        this.parentSVG = obj.parentSVG
        //--
        
        //--
        this.emitter = new EventEmitter()
        //--
        this.POINTS = {}
        this.POINTS_ARRAY = []  
        //--
        this.TRANSITIONS = []
        this.TRANSITIONS_ARRAY = []
        this.CURRENT_TRANSITION = null
        //--
        this.contSVG = this.draw.group().id(this.id).addTo(this.parentSVG)
        this.rotate_g = this.draw.group().id("rotate_g").addTo(this.contSVG)
        this.scale_g = this.draw.group().id("scale_g").addTo(this.rotate_g)
        this.pathSVG = this.draw.path().id(this.id).addTo(this.scale_g)
            .fill(this.fill)
            .stroke(this.stroke)
            // .stroke({ width: 2, color: '#000000' })
        //----
        this.translate_animator = new GroupTransforms({
            path: this
        })
        this.rotate_animator = new GroupTransforms({
            path: this
        })
        this.scale_animator = new GroupTransforms({
            path: this
        })

    }
    //----------------------------------------------
    // PUBLIC:
    paintTransitionProgress(transitionId, progress){
        const transition = this.TRANSITIONS[transitionId]
        transition.paintProgress(progress)
    }
    paintState(stateId){
        this.plotStateId(stateId)
    }


    translate(positionArray, duration=0, delay=0, ease="none", animId="onEndTranslation"){
        this.translate_animator.translate(positionArray, duration, delay, ease, animId)
    }
    rotate(rotateTo, duration=0, delay=0, ease="none", animId="onEndRotation"){
        this.rotate_animator.rotate(rotateTo,duration, delay, ease, animId)
    }
    show(){
        this.contSVG.show()
    }
    hide(){
        this.contSVG.hide()
    }
    addPoint(pointId){
        if(!this.POINTS_ARRAY.includes(pointId)){
            this.POINTS_ARRAY.push(pointId)   
        }
        this.POINTS[pointId] = new PathPointC({
            app: this.app,
            path: this,
            id: pointId
        })
    }
    addPointState(pointId, stateId, _p, _c1=[0,0], _c2=[0,0], type="rc"){
        // types: rc (relative control points), ac (absolute control points)
        const p = new Point()
        const c1 = new Point()
        const c2 = new Point()
        //--
        if(type == "rc"){
            // relative control points
            p.x = _p[0]
            p.y = _p[1]
            c1.x = _p[0]+_c1[0]
            c1.y = _p[1]+_c1[1]
            c2.x = _p[0]+_c2[0]
            c2.y = _p[1]+_c2[1]

        }else if(type == "ac"){
            // absolute control points
            p.x = _p[0]
            p.y = _p[1]
            c1.x = _p[0]+ (_c1[0] - _p[0])
            c1.y = _p[1]+ (_c1[1] - _p[1])
            c2.x = _p[0]+ (_c2[0] - _p[0])
            c2.y = _p[1]+ (_c2[1] - _p[1])
        }
        //--
        if(!this.POINTS[pointId]){
            this.addPoint(pointId)
        }
        this.POINTS[pointId].addState(stateId, p, c1, c2)
    }

    addTransition(transitionObj){
        // console.log("(SVGPath.addTransition): ", transitionObj);
        // TO DO: store transitions for future use
        if(!this.TRANSITIONS_ARRAY.includes(transitionObj.transitionId)){
            this.TRANSITIONS_ARRAY.push(transitionObj.transitionId)   
        }
        this.TRANSITIONS[transitionObj.transitionId] = transitionObj
    }

    animateTransition(transitionId, duration, delay, ease, reset){
        // console.log("(SVGPath.animateTransition): ", transitionId, duration, delay, ease, reset);
        // console.log("this.TRANSITIONS_ARRAY: ", this.TRANSITIONS_ARRAY);
        this.TRANSITIONS_ARRAY.forEach(element => {
            // console.log("element: ", element);
            const transition = this.TRANSITIONS[element]
            if(element == transitionId){
                this.CURRENT_TRANSITION = transition
                this.CURRENT_TRANSITION.playFromTo(duration, delay, ease, reset)
            }else{
                //transition.stop()
            }
        });
    }

    animateToState(stateId="_current", duration=1000){
        // TO DO: implement animation between current path and target path (stateId)
    }
    //----------------------------------------------
    // EVENTS:
    plotStateId(stateId){
        for (let i = 0; i < this.POINTS_ARRAY.length; i++) {
            const point = this.POINTS[this.POINTS_ARRAY[i]]
            point.setCurrentState(stateId)
        }
        this._plot()
    }
    //----------------------------------------------
    // PRIVATE:
    _plot() {
        // Point in point array represent the point and the entering bezier and the exiting bezier
        // While SVG path C command: C x1,y1, x2,y2, x,y represent:
        // x1,y1: exit control point from previous point
        // x2,y2: entering control point to current point
        // x,y: current point
        //--
        const parts = []
        let path_str = ""
        //--
        // We create de initial M part:
        const p0 = this.POINTS[this.POINTS_ARRAY[0]].getState("_current")
        parts.push("M" + p0.p.x + "," + p0.p.y)
        //--
        // We create the sucessive C parts:
        for (let i = 1; i < this.POINTS_ARRAY.length; i++) {
            const prev = this.POINTS[this.POINTS_ARRAY[i - 1]].getState("_current")
            const curr = this.POINTS[this.POINTS_ARRAY[i]].getState("_current")
            parts.push(
                "C" + prev.c2.x + "," + prev.c2.y + " " + curr.c1.x + "," + curr.c1.y + " " + curr.p.x + "," + curr.p.y
            )
        }
        //--
        // We create the final path string
        path_str = parts.join(" ")
        // And plot it:
        this.pathSVG.plot(path_str)
    }

    //----------------------------------------------
    // AUX:
  
}
export default SVGPath
