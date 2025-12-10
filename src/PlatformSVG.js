import gsap from "gsap"
import ScrollTrigger from 'gsap/ScrollTrigger';
//import * as THREE from 'three'

import SVGApp from './svg/core/SVGApp';


gsap.registerPlugin(ScrollTrigger);

class PlatformSVG{
    constructor (obj){
        console.log("(PlatformSVG.CONSTRUCTORA): ", obj)
        //--
        const $webglContainer = document.querySelector('#svg_app')
        const $mouseEvents = document.querySelector('#svg_app')

        this.svgApp = new SVGApp({
            id:"svgjs_app",
            $container: $webglContainer,
            width: 1920,
            height: 900,
            DEV_MODE: false,
            scrolls: ["scroll_main"]
        })
        gsap.delayedCall(1, ()=>{
            this.init_scrollTriger()
        })

    }
    //----------------------------------------------
    // PUBLIC:
    init_scrollTriger(){
        console.log("(PlatformSVG.init_scrollTriger)!");
        //--
        this.scroll_main = ScrollTrigger.create({
            trigger: document.querySelector('#content'),
            start: 'top top',
            end: 'bottom bottom',
            markers: true,
            onUpdate: (self) => {   
                // console.log("+");
                const progress = self.progress
                const offesetY = (self.end - self.start) * self.progress
                this.svgApp.update_scrollProgress("scroll_main", progress, offesetY);
            }
        });
        
        // window.addEventListener('resize', ()=>{ 
        //     this.webglApp.resize(this.__get_resize_data())
        // })

        // window.addEventListener('wheel', ()=>{
        //     // Your logic here
        //     // You can use event.deltaY to determine the scroll direction and speed
        
        //     // Example: Trigger some GSAP animation based on the wheel movement
        //     if(event.deltaY > 0) {
        //         // Scrolling down
        //         this.webglApp.emitter.emit("onMouseWheelDown")
        //         // this.webglApp.emitter.emit("onMouseWheel_down")
        //     } else {
        //         // Scrolling up
        //         this.webglApp.emitter.emit("onMouseWheelUp")
        //         // this.webglApp.emitter.emit("onMouseWheel_up")
        //     }
        // });
        
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:
    
    // __get_init_data(){
    //     const obj = {
    //         // mobileMode:this.__get_mobileMode(),
    //         mobileMode:false,
    //         iOS:this.__get_iOS(),
    //         mode: 'gallery',
    //         items: [
    //             "img1.jpg",
    //             "img2.jpg",
    //             "img3.jpg",
    //             "img4.jpg",
    //             "img5.jpg",
    //             "img6.jpg",
    //             "img7.jpg",
    //             "img8.jpg"
    //         ]
    //     }
    //     return obj
    // }

    // __get_resize_data(){
    //     const obj = {
    //         mobileMode:this.__get_mobileMode(),
    //         iOS:this.__get_iOS(),
    //         items:[

    //         ]
    //     }
    //     return obj
    // }

    // __get_mobileMode(){
    //     const width = document.querySelector('#webgl_app').offsetWidth
    //     const breakpoint = 750
    //     let mobileMode = false
    //     if(width <= breakpoint){
    //         mobileMode = true
    //     }
    //     return mobileMode
    // }

    // __get_iOS() {
    //     return [
    //       'iPad Simulator',
    //       'iPhone Simulator',
    //       'iPod Simulator',
    //       'iPad',
    //       'iPhone',
    //       'iPod'
    //     ].includes(navigator.platform)
    //     // iPad on iOS 13 detection
    //     || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    //   }
  
}
export default PlatformSVG