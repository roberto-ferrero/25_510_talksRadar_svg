import gsap from "gsap"
class RadarDirector{
    constructor (obj){
        // console.log("(RadarDirector.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        //-------------------
        this.SELECTED_INDUSTRIES = []
        this.SELECTED_FOUNDRIES = []
        this.IS_SELECTION = false
        this.SELECTED_FAMILY = null // "INDUSTRIES" | "FOUNDRIES"
        //-------------------
        this.NUM_RADAR_ITEMS = this.project.ITEMS.length
        this.SELECTED_TALKS = []
        this.ORIGINAL_INDEX_SORTING = []
        this.CURRENT_INDEX_SORTING = []
        this.ITEMS_STATUS = []
        this.STATE = "INTRO" // "INTRO" | "INITIAL" | "FAMILY_SELECTED" | "SUB_FAMILY_SELECTED"
        //-------------------
        
        //-------------------
        this.app.emitter.on("onFamilySelected", (e) => {
            console.log("onFamilySelected: ", e.family);
            if(e.family == null){
                this.SELECTED_FAMILY = null
                this._update()
            }else{
                this.SELECTED_INDUSTRIES = []
                this.SELECTED_FOUNDRIES = []
                this.SELECTED_FAMILY = e.family
                this.STATE = "FAMILY_SELECTED"
                this._update()
            }
        })
        //--
        this.app.emitter.on("onIndustrySelected", (e) => {
            // console.log("onIndustrySelected: ", e);
            this.SELECTED_FOUNDRIES = []
            this.SELECTED_INDUSTRIES.push(e.id);
            //--
            this._update()
        });
        this.app.emitter.on("onIndustryDeselected", (e) => {
            const index = this.SELECTED_INDUSTRIES.indexOf(e.id);
            if (index > -1) {
                this.SELECTED_INDUSTRIES.splice(index, 1);  
            }
            //--
            this._update()
        });
        this.app.emitter.on("onFoundrySelected", (e) => {
            console.log("onFoundrySelected: ", e);
            this.SELECTED_INDUSTRIES = []
            this.SELECTED_FOUNDRIES.push(e.id);
            //--
            this._update()
        });
        this.app.emitter.on("onFoundryDeselected", (e) => {
            const index = this.SELECTED_FOUNDRIES.indexOf(e.id);
            if (index > -1) {
                this.SELECTED_FOUNDRIES.splice(index, 1);
            }
            //--
            this._update()
        });
        //---
        gsap.delayedCall(0.5, ()=>{
            this.STATE = "INITIAL"
            this.app.emitter.emit("onFilterChanged", {});
        })
        
    }
    //----------------------------------------------
    // PUBLIC:
    init(){
        for(let i=0; i<this.project.ITEMS.length; i++){
            const item = this.project.ITEMS[i];
            // console.log("item: ", item);
            this.ORIGINAL_INDEX_SORTING.push(item.itemIndex)
            this.CURRENT_INDEX_SORTING.push(item.itemIndex)
            this.ITEMS_STATUS.push(item.data.state)
        }
        ///--
        this._update()
    }
    //----------------------------------------------
    // EVENTS:

    //----------------------------------------------
    // PRIVATE:
    _update(){
        this._update_STATE()
        this._update_ARRAYS()
        this._print_SATE()
    }
    _print_SATE(){
        console.log("---");
        console.log("this.STATE: ", this.STATE);
        console.log("this.SELECTED_FAMILY: ", this.SELECTED_FAMILY);
        console.log("this.SELECTED_INDUSTRIES: ", this.SELECTED_INDUSTRIES);
        console.log("this.SELECTED_FOUNDRIES: ", this.SELECTED_FOUNDRIES);
        console.log("this.IS_SELECTION: ", this.IS_SELECTION);
        console.log("this.SELECTED_TALKS: ", this.SELECTED_TALKS);
        console.log("---");


    }
    _update_STATE(){
        if(this.STATE == "INTRO"){

        }else if(this.SELECTED_FAMILY == null){
            this.STATE = "INITIAL"
        }else if(this.SELECTED_INDUSTRIES.length>0 || this.SELECTED_FOUNDRIES.length>0){
            this.STATE = "SUB_FAMILY_SELECTED"
        }else{
            this.STATE = "FAMILY_SELECTED"
        }
    }
    _update_ARRAYS(){
        if(this.STATE == "INITIAL"){
            console.log("*0");
            this.SELECTED_FOUNDRIES = []
            this.SELECTED_INDUSTRIES = []
            this.SELECTED_TALKS = this.ORIGINAL_INDEX_SORTING.slice()
            this.IS_SELECTION = false
            this.CURRENT_INDEX_SORTING = []
        }else if(this.STATE == "INITIAL"){

        }else if(this.STATE == "FAMILY_SELECTED"){
            console.log("*2");
            this.SELECTED_TALKS = []
            if(this.SELECTED_FAMILY==="INDUSTRIES"){
                this.SELECTED_FOUNDRIES = []
                for(let i=0; i<this.project.ITEMS.length; i++){
                    const item = this.project.ITEMS[i];
                    if(item.data.industries.length>0){
                        this.IS_SELECTION = true
                        this.SELECTED_TALKS.push(item.itemIndex)
                    }
                }
            }else if(this.SELECTED_FAMILY==="FOUNDRIES"){
                this.SELECTED_INDUSTRIES = []
                for(let i=0; i<this.project.ITEMS.length; i++){
                    const item = this.project.ITEMS[i];
                    if(item.data.foundries.length>0){
                        this.IS_SELECTION = true                                                                                                                                                                                                                                                                                                                                                                                                                              
                        this.SELECTED_TALKS.push(item.itemIndex)
                    }
                }
            }
            
        }else if(this.STATE == "SUB_FAMILY_SELECTED"){
            console.log("*3");
            this.SELECTED_TALKS = []
            if(this.SELECTED_FAMILY==="INDUSTRIES"){
                console.log("*3.1");
                this.SELECTED_FOUNDRIES = []
                this.SELECTED_TALKS = []
                this.SELECTED_INDUSTRIES.forEach(element => {
                    console.log("   element: ", element);
                    for(let i=0; i<this.project.ITEMS.length; i++){
                        const item = this.project.ITEMS[i];
                        if(item.data.industries.includes(element)){
                            this.IS_SELECTION = true
                            this.SELECTED_TALKS.push(item.itemIndex)
                        }
                    }
                });
                    
            }else if(this.SELECTED_FAMILY==="FOUNDRIES"){
                console.log("*3.2");
                this.SELECTED_INDUSTRIES = []
                this.SELECTED_TALKS = []
                this.SELECTED_FOUNDRIES.forEach(element => {
                    for(let i=0; i<this.project.ITEMS.length; i++){
                        const item = this.project.ITEMS[i];
                        if(item.data.foundries.includes(element)){
                            this.IS_SELECTION = true
                            this.SELECTED_TALKS.push(item.itemIndex)
                        }
                    }
                });
            }
        }
        //--
        this.app.emitter.emit("onFilterChanged", {});
    }

//     _update_CURRENT_INDEX_SORTING() {
//         const selectedSet = new Set(this.SELECTED_TALKS);

//         // 1. Create buckets for each combination.
//         // We use objects to map the status (0, 1, 2) directly to an array.
//         const selected = { 2: [], 1: [], 0: [] };
//         const unselected = { 2: [], 1: [], 0: [] };

//         // 2. Single pass loop O(N)
//         // Since we iterate ORIGINAL_INDEX_SORTING (0, 1, 2...), the items 
//         // inside the buckets will naturally remain sorted by index ascending.
//         for (const index of this.ORIGINAL_INDEX_SORTING) {
            
//             // Retrieve status (0, 1, or 2)
//             const status = this.ITEMS_STATUS[index]; 
            
//             // Distribute to the correct bucket
//             if (selectedSet.has(index)) {
//                 selected[status].push(index);
//             } else {
//                 unselected[status].push(index);
//             }
//         }

//         // 3. Concatenate in the desired specific order:
//         // Selected (High to Low status) -> Unselected (High to Low status)
//         this.CURRENT_INDEX_SORTING = [
//             ...selected[2], 
//             ...selected[1], 
//             ...selected[0],
//             ...unselected[2], 
//             ...unselected[1], 
//             ...unselected[0]
//     ];
// }

//     _update_CURRENT_INDEX_SORTING_old() {
//         // 1. Creamos un Set para búsquedas instantáneas O(1)
//         // Esto es crucial para no recorrer el array de seleccionados en cada iteración
//         const selectedSet = new Set(this.SELECTED_TALKS);

//         const selected = [];
//         const unselected = [];

//         // 2. Recorremos la lista ORIGINAL que ya sabemos que es ascendente (0, 1, 2...)
//         for (const index of this.ORIGINAL_INDEX_SORTING) {
//             if (selectedSet.has(index)) {
//                 // Si está en el Set, va al grupo de cabecera
//                 selected.push(index);
//             } else {
//                 // Si no, va al grupo de cola
//                 unselected.push(index);
//             }
//         }

//         // 3. Concatenamos: Primero los seleccionados, luego el resto
//         this.CURRENT_INDEX_SORTING = [...selected, ...unselected];
//     }
    //----------------------------------------------
    // AUX:

  
}
export default RadarDirector