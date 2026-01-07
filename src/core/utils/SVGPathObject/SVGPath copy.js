//import gsap from "gsap"

class SVGPath{
    constructor (obj){
        // console.log("(SVGPath.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.draw = this.app.draw
        this.id= obj.id
        this.parentSVG = obj.parentSVG
        //--
        this.FROM_STATE = "_current"
        this.TO_STATE = "_current"
        this.ANIM_PROGRESS = 0
        //--
        this.SVG_STRING = ""
        this.STATES = [
            {
                id: "_current",
                points: []
            }
        ]
        this.CURRENT_STATE = this.STATES[0]
        
        //--
        this.pathSVG = this.draw.path().id(this.id).addTo(this.parentSVG).fill('none').stroke({ width: 2, color: '#000000' })
    }
    //----------------------------------------------
    // PUBLIC:
    addCubicPoint_rc(pointId, p, rc1, rc2, stateId="_current"){
        // p: point in absolut coordinates
        // rc: control points relative to p [0] entering bezier [1] exit bezier
        const state = this.STATES.find(s => s.id === stateId)
        if(state){
            state.points.push({
                id: pointId,
                type: 'C',
                px: p[0],
                py: p[1],
                c1x: p[0]+rc1[0],
                c1y: p[1]+rc1[1],
                c2x: p[0]+rc2[0],
                c2y: p[1]+rc2[1]
            })
        }else{
            // we create the state
            this.STATES.push({

                id: stateId,
                points: [{
                    id: pointId,
                    type: 'C',
                    px: p[0],
                    py: p[1],
                    c1x: p[0]+rc1[0],
                    c1y: p[1]+rc1[1],
                    c2x: p[0]+rc2[0],
                    c2y: p[1]+rc2[1]
                }]
            })
        }
        if(stateId == "_current"){
            this._plot(stateId)
        }
    }
    addCubicPoint_ac(pointId, p, ac1, ac2, stateId="_current"){
        // p: point in absolut coordinates
        // ac: control points absolute coordinates. [0] entering bezier [1] exit bezier
        // rc: control points relative to p.  [0] entering bezier [1] exit bezier
        const rc1x = ac1[0] - p[0]
        const rc1y = ac1[1] - p[1]
        const rc2x = ac2[0] - p[0]
        const rc2y = ac2[1] - p[1]
        const state = this.STATES.find(s => s.id === stateId)
        if(state){
            state.points.push({
                id: pointId,
                type: 'C',
                px: p[0],
                py: p[1],
                c1x: p[0]+rc1x,
                c1y: p[1]+rc1y,
                c2x: p[0]+rc2x,
                c2y: p[1]+rc2y
            })
        }else{
            // we create the state
            this.STATES.push({
                id: stateId,
                points: [{
                    id: pointId,
                    type: 'C',
                    px: p[0],
                    py: p[1],
                    c1x: p[0]+rc1x,
                    c1y: p[1]+rc1y,
                    c2x: p[0]+rc2x,
                    c2y: p[1]+rc2y
                }]
            })
        }
        if(stateId == "_current"){
            this._plot(stateId)
        }
    }

    animateToState(stateId="_current", duration=1000){
        // TO DO: implement animation between current path and target path (stateId)
    }
    //----------------------------------------------
    // EVENTS:
    plotState(stateId){
        const state = this.STATES.find(s => s.id === stateId)
        this.CURRENT_STATE.points = []
        // for(let i=0; i<state.points.length; i++){
            


        this._plot(stateId)
    }
    //----------------------------------------------
    // PRIVATE:
    _plot(stateId = "_current") {
        // Point in point array represent the point and the entering bezier and the exiting bezier
        // While SVG path C command: C x1,y1, x2,y2, x,y represent:
        // x1,y1: exit control point from previous point
        // x2,y2: entering control point to current point
        // x,y: current point
        const state = this.STATES.find(s => s.id === stateId)
        if (!state) return

        const pts = state.points
        if (!pts || pts.length === 0) {
            // nothing to draw
            this.pathSVG.plot("")
            return
        }

        // If only one point, move to it (no segments to draw)
        if (pts.length === 1) {
            const p0 = pts[0]
            const d = `M${p0.px},${p0.py}`
            this.pathSVG.plot(d)
            return
        }

        // Build path: M firstPoint, then C for each subsequent point
        const parts = []
        const p0 = pts[0]
        parts.push(`M${p0.px},${p0.py}`)

        for (let i = 1; i < pts.length; i++) {
            const prev = pts[i - 1]
            const curr = pts[i]
            parts.push(
                `C${prev.c2x},${prev.c2y} ${curr.c1x},${curr.c1y} ${curr.px},${curr.py}`
            )
        }

        const d = parts.join(" ")
        this.SVG_STRING = d
        //--
        this.pathSVG.plot(d)
    }
    //----------------------------------------------
    // AUX:
  
}
export default SVGPath





