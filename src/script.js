
import './style.css';
import gsap from "gsap"
import ScrollTrigger from 'gsap/ScrollTrigger';
import "fpsmeter"

import PlatformSVG from './PlatformSVG';

gsap.registerPlugin(ScrollTrigger);


window.platform = new PlatformSVG()

const meter = new FPSMeter({
    position: 'fixed',
})

update_RAF()


function update_RAF(){
    //console.log("*");
    meter.tick()
    window.requestAnimationFrame( () =>{
        update_RAF()
    })
}

