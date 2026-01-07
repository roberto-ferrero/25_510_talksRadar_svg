//import gsap from "gsap"

import IndustryDot from "./IndustryDot.js"

class Industries{
    constructor (obj){
        // console.log("(Industries.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        this.industries_g = obj.industries_g
        //--
        this.draw = this.app.draw
        //--
        this.NUM_INDUSTRIES = 14
        this.RADIUS = 370
        //--
        this.myText = this.draw
            .text("Industries")
            .move(0, -5) // Mueve el punto de anclaje a 0,0
            .fill('#FFFFFF')
            .font({
                anchor: 'middle',          // Centrado Horizontal (text-anchor)
                // 'dominant-baseline': 'bottom', // Centrado Vertical (aprox) o 'central'
                size: 60,
                family: 'Noto Serif', // <--- Nombre exacto
            })
            .opacity(0.0)
            .addTo(obj.industries_g);
        this.myText.css({ 
            'user-select': 'none', 
            'pointer-events': 'none' // Si no necesitas que sea clicable
        });
        //--
        this.ITEMS = []
        for (let i=0; i<this.NUM_INDUSTRIES; i++){
            const angle = (i / this.NUM_INDUSTRIES) * 360 - 90;
            const angle_rad = angle * (Math.PI / 180);
            const item = new IndustryDot({
                app: this.app,
                project: this.project,
                industries_g: this.industries_g,
                index: i,
                angle: angle_rad,
                angle_rad: angle_rad,
                radius: this.RADIUS,
            });
            this.ITEMS.push(item);
        }
    }
    //----------------------------------------------
    // PUBLIC:
    updateRAF(ctx){
        if(this.project.IN_OUTRO){
            this.myText.opacity(this.project.OUTRO_PROGRESS)
            this.ITEMS.forEach( (item) => {
                item.updateRAF(ctx)
            } )
        }
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:

  
}
export default Industries