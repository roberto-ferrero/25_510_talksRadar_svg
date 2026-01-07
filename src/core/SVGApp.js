// import gsap from "gsap"
import { SVG } from '@svgdotjs/svg.js'

import AppSize from './AppSize.js'
import AppScroll from './AppScroll.js'
import Datos from './utils/Datos.js'
import DevBackground from './utils/DevBackground/DevBackground.js'
import TalksRadarProject from '../projects/ntt_radarTest/TalksRadarProject.js'


import { EventEmitter } from 'events';

class SVGApp{
    constructor (obj){
        console.log("(SVGApp.CONSTRUCTORA): ", obj)
        this.app = this
        this.rnd = Math.random()
        this.id= obj.id
        this.container = obj.$container
        //-- 
        this.DEV_MODE = obj.DEV_MODE || false
        //-- RAF state
        this._rafId = null
        this._lastTime = null
        this._isRunning = false
        //--
        //----------------------
        this.emitter = new EventEmitter()
        this.emitter.setMaxListeners(2000)
        //----------------------
        // APP SIZE:
        this.size = new AppSize({
            app: this.app,
            width: obj.width,
            height: obj.height
        })
        // APP SIZE:
        //----------------------
        //----------------------
        // APP SCROLL:
        this.scrolls = new Datos()
        for(var i=0; i<obj.scrolls.length; i++){
            const scroll_id = obj.scrolls[i]
            const scroll_item = new AppScroll({app:this, id:scroll_id, emit:true})
            this.scrolls.nuevoItem(scroll_id, scroll_item)
        }
        // APP SCROLL:
        //----------------------



        this.draw = SVG().addTo(this.container)
            .size(this.size.ORIGINAL.width, this.size.ORIGINAL.height)
            .viewbox(-this.size.ORIGINAL.width*0.5, -this.size.ORIGINAL.height*0.5, this.size.ORIGINAL.width, this.size.ORIGINAL.height)

        this.draw.addClass('svg-darken')

        if(this.DEV_MODE){  
            this.bgGrid = new DevBackground({
                app: this.app,
                width: 500,
                height: 500
            })
        }

        this.project = new TalksRadarProject({
            app: this.app,
            id: "radarTest_project",
            parentSVG: this.draw
        })

        // bind once so rAF always has the right "this"
        this._onRAF = this._onRAF.bind(this)

        //--
        this.init()
    }

    //----------------------------------------------
    // PUBLIC:
    init(){ 
        // kick things off
        this.startRAF()
    }

    startRAF(){
        if (this._isRunning) return
        this._isRunning = true
        this._lastTime = null
        this._rafId = requestAnimationFrame(this._onRAF)
    }

    stopRAF(){
        this._isRunning = false
        if (this._rafId !== null){
            cancelAnimationFrame(this._rafId)
            this._rafId = null
        }
        this._lastTime = null
    }

    destroy(){
        // optional: call when tearing down the app
        this.stopRAF()
        // clean up anything else if your submodules expose destroy()
        this.project?.destroy?.()
        this.bgGrid?.destroy?.()
        this.draw?.remove?.()
    }
    update_scrollProgress(scrollId, progress, offsetY){
        this.scrolls.getItem(scrollId).update(progress, offsetY) // Emits: onAppScrollUpdate
    }

    //----------------------------------------------
    // EVENTS:
    updateRAF(ctx){
        /**
         * Called on every requestAnimationFrame tick.
         * @param {{ time:number, delta:number }} ctx - time in seconds and delta time in seconds
         */
        // console.log("updateRAF: ", ctx);
        this.project?.updateRAF(ctx)
        this.emitter.emit("onUpdateRAF", ctx)
    }

    //----------------------------------------------
    // PRIVATE:
    _onRAF(now){
        if (!this._isRunning) return

        // compute delta (seconds)
        const t = now * 0.001
        const dt = (this._lastTime == null) ? 0 : (t - this._lastTime)
        this._lastTime = t

        // call your per-frame update
        this.updateRAF({ time: t, delta: dt })

        // schedule next frame
        this._rafId = requestAnimationFrame(this._onRAF)
    } 

    //----------------------------------------------
    // AUX:
}

export default SVGApp
