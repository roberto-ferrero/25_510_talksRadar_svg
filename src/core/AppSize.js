//import gsap from "gsap"
//import * as THREE from 'three'

class AppSize{
    constructor (obj){
        // console.log("(AppSize.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        //--
        this.CURRENT = {
            width:0,
            height:0,
            aspect:0,
        }
        this.ORIGINAL = {
            width: obj.width,
            height: obj.height
        }
        this.CURRENT.aspect = this.CURRENT.width / this.CURRENT.height
        //--
        this.REF = {
            width: 1920,
            height: 947,
        }
        this.REF.aspect = this.REF.width / this.REF.height
        //--
        this.RESPONSIVE_SCALE = {
            x:this.CURRENT.width / this.REF.width,
            y:this.CURRENT.height / this.REF.height
        }

        //--------------------------
        window.addEventListener('resize', this.listener_resize = ()=>{
            this.update()
        })

        //--
        this.update()

    }
    //----------------------------------------------
    // PUBLIC:
    update(){
        // console.log("(AppSize.update)!", )
        let newWidth = this.app.container.offsetWidth
        let newHeight = this.app.container.offsetHeight
        //----
        this.CURRENT.width = newWidth
        this.CURRENT.height = newHeight
        this.CURRENT.aspect = newWidth/newHeight
        //----
        this.ORIGINAL.width = newWidth
        this.ORIGINAL.height = newHeight
        this.ORIGINAL.aspect = newWidth/newHeight
        //----
        this.RESPONSIVE_SCALE = {
            x:this.CURRENT.width / this.REF.width,
            y:this.CURRENT.height / this.REF.height
        }
        console.log("  - RESPONSIVE_SCALE size: ", this.RESPONSIVE_SCALE)
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:

    //----------------------------------------------
    // AUX:

  
}
export default AppSize