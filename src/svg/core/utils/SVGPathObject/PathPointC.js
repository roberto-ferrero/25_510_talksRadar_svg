import { SVG, Point } from '@svgdotjs/svg.js'

class PathPointC{
    constructor (obj){
        // console.log("(PathPointC.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.path = obj.path
        this.id= obj.id
        //--
        this.STATE_FROM = null
        this.STATE_TO = null
        this.PROGRESS = 0
        //--
        this.STATES = {}
        this.STATES._current = {
            p: new Point(0,0),
            c1: new Point(0,0),
            c2: new Point(0,0)
        }
        this.ARRAY_STATES = []
    }
    //----------------------------------------------
    // PUBLIC:
    addState(stateId, p, c1, c2){
        if(!this.ARRAY_STATES.includes(stateId)){
            this.ARRAY_STATES.push(stateId)   
        }
        this.STATES[stateId] = {
            p: p,
            c1: c1,
            c2: c2
        }
        //--
        // IN CASE NO STATE FROM IS DEFINED, WE SET IT TO THE FIRST ADDED STATE
        if(this.STATE_FROM == null){
            this.STATE_FROM = stateId
            this.STATE_TO = stateId
        }
    }
    // setStates(stateFrom, stateTo){
    //     this.STATE_FROM = stateFrom
    //     this.STATE_TO = stateTo
    // }
    setCurrentState(stateId){
        const state = this.STATES[stateId]
        this.STATES._current = {
            p: state.p,
            c1: state.c1,
            c2: state.c2
        }
    }
    getState(stateId){
        return this.STATES[stateId]
    }
    getCurrentState(stateFrom, stateTo, progress){
        return this.STATES._current
    }

    lerpStates(stateFrom, stateTo, progress){
        const fromState = this.STATES[stateFrom]
        const toState = this.STATES[stateTo]
        const pX = fromState.p.x + ((toState.p.x - fromState.p.x) * progress)
        const pY = fromState.p.y + ((toState.p.y - fromState.p.y) * progress)
        const c1X = fromState.c1.x + ((toState.c1.x - fromState.c1.x) * progress)
        const c1Y = fromState.c1.y + ((toState.c1.y - fromState.c1.y) * progress)
        const c2X = fromState.c2.x + ((toState.c2.x - fromState.c2.x) * progress)
        const c2Y = fromState.c2.y + ((toState.c2.y - fromState.c2.y) * progress)
        //--
        this.STATES._current = {
            p: new Point(pX, pY),
            c1: new Point(c1X, c1Y),
            c2: new Point(c2X, c2Y)
        }
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:

  
}
export default PathPointC