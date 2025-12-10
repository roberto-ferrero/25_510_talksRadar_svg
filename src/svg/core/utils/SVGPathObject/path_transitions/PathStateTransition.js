import gsap from "gsap"

class PathStateTransition{
    constructor (obj){
        // console.log("(PathStateTransition.CONSTRUCTORA): ", obj)
        this.transitionId = obj.transitionId
        this.path = obj.path
        this.points_array = obj.points // Array of point ids involved in the transition
        this.fromId = obj.fromId
        this.toId = obj.toId
        //--
        if(!this.points_array){
            this.points_array = this.path.POINTS_ARRAY
        }
        //--
        this.gsapAnim = null
        //--
        this.ACTIVE = false
        this.PROGRESS = 0

    }
    //----------------------------------------------
    // PUBLIC:
    playFromTo(duration, delay, ease, reset){
        this.play(duration, delay, ease, reset, 1)
    }
    // playToFrom(duration, delay, ease, reset){
    //     this.play(duration, delay, ease, reset, -1)
    // }
    play(duration, delay, ease, reset, direction){
        // console.log("(PathStateTransition.play): ", duration, delay, ease, reset, direction);
        // console.log("this.points_array: ", this.points_array);
        // direction 1: from -> to
        // direction -1: to -> from
        // resert: if true, restart from beginning
        this.ACTIVE = true
        let goalProgress = 0
        if(reset){
            if(direction == 1){
                this.PROGRESS = 0
                goalProgress = 1
            }else{
                this.PROGRESS = 1
                goalProgress = 0
            }
        }
        this.gsapAnim = gsap.to(this, {
            PROGRESS: goalProgress,
            duration: duration,
            delay: delay,
            ease: ease,
            onUpdate: ()=>{
                // console.log("onUpdate: "+this.transitionId);
                this._updatePoints(this.PROGRESS)
            },
            onComplete: ()=>{
                this.ACTIVE = false
                this.gsapAnim = null
                this.path.emitter.emit("onTransitionComplete", this.transitionId)
            }
        })
    }
    stop(){
        this.gsapAnim?.kill()
        this.ACTIVE = false
    }
    paintProgress(value){
        this.PROGRESS = value
        this._updatePoints(this.PROGRESS)
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:
    _updatePoints(progress){
        
        for (let i = 0; i < this.points_array.length; i++) {
            const pointId = this.points_array[i]
            const point = this.path.POINTS[pointId]
            point.lerpStates(this.fromId, this.toId, progress)
        }
        this.path._plot()
    }

    // _plot() {
    //     // Point in point array represent the point and the entering bezier and the exiting bezier
    //     // While SVG path C command: C x1,y1, x2,y2, x,y represent:
    //     // x1,y1: exit control point from previous point
    //     // x2,y2: entering control point to current point
    //     // x,y: current point
    //     //--
    //     const parts = []
    //     let path_str = ""
    //     //--
    //     // We create de initial M part:
    //     const p0 = this.path.POINTS[this.path.POINTS_ARRAY[0]].getCurrentState(this.fromId, this.toId, this.PROGRESS)
    //     parts.push("M" + p0.p.x + "," + p0.p.y)
    //     //--
    //     // We create the sucessive C parts:
    //     for (let i = 1; i < this.path.POINTS_ARRAY.length; i++) {
    //         const prev = this.path.POINTS[this.path.POINTS_ARRAY[i - 1]].getCurrentState(this.fromId, this.toId, this.PROGRESS)
    //         const curr = this.path.POINTS[this.path.POINTS_ARRAY[i]].getCurrentState(this.fromId, this.toId, this.PROGRESS)
    //         parts.push(
    //             "C" + prev.c2.x + "," + prev.c2.y + " " + curr.c1.x + "," + curr.c1.y + " " + curr.p.x + "," + curr.p.y
    //         )
    //     }
    //     //--
    //     // We create the final path string
    //     path_str = parts.join(" ")
    //     // And plot it:
    //     this.path.pathSVG.plot(path_str)


    // }
    //----------------------------------------------
    // AUX:

  
}
export default PathStateTransition