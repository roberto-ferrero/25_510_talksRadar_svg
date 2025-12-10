import DrawGrid from "./DrawGrid"

class DevBackground{
    constructor (obj){
        console.log("(DevBackground.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.draw = this.app.draw
        this.parentSVG = this.draw 
        this.width = obj.width || 500
        this.height = obj.height || 500
        //--
        this.contSVG = this.draw.group().id("devBackground").addTo(this.parentSVG)
        this.translate_g = this.draw.group().addTo(this.contSVG)
        //--
        this.backgroundColor = this.draw.rect(this.width, this.height).move(-this.width*0.5, -this.height*0.5).addTo(this.contSVG).fill('rgba(0,0,0,0.02)')
        //--
        this.grid = new DrawGrid({
            app: this.app,
            id: "devBackground_grid",
            parentSVG: this.translate_g,
            width: this.width,
            height: this.height,
            cols: 10,
            rows: 10
        })
        //--
        // //--

    }
    //----------------------------------------------
    // PUBLIC:
    
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:

  
}
export default DevBackground