import gsap from "gsap"


import Item from "./TalkItem"



class FakeData{
    constructor (obj){
        // console.log("(FakeData.CONSTRUCTORA): ", obj)
        this.app = obj.app
        this.project = obj.project
        //--
        this.NUM_ITEMS = 200
        this._createData(this.NUM_ITEMS) // Generar 50 ítems de ejemplo
    }
    //----------------------------------------------
    // PUBLIC:
    get_itemAt(idx){
        // Retorna el ítem de datos en la posición idx
        // Ejemplo: { id: 'talk_1', name: 'Future Grid', industries: ['ind_3'], foundries: ['fnd_1', 'fnd_4'], state: 0 }
        return this.database.talks[idx];
    }
    //----------------------------------------------
    // EVENTS:
    //----------------------------------------------
    // PRIVATE:
    _createData(numItems){
        // --- 1. Definición de Datos Maestros ---
        const INDUSTRIES_DATA = [
        { id: 'ind_1', name: 'Automotion', color: '#2ecc71' }, // Verde (Industries)
        { id: 'ind_2', name: 'CPG', color: '#2ecc71' },
        { id: 'ind_3', name: 'Infrastructures', color: '#2ecc71' },
        { id: 'ind_4', name: 'Logistic', color: '#2ecc71' },
        { id: 'ind_5', name: 'Pharma & Life Science', color: '#2ecc71' },
        { id: 'ind_6', name: 'Manufacturing', color: '#2ecc71' },
        { id: 'ind_7', name: 'Oil & Gas', color: '#2ecc71' },
        { id: 'ind_8', name: 'Natural Resource', color: '#2ecc71' },
        { id: 'ind_9', name: 'Retail', color: '#2ecc71' },
        { id: 'ind_10', name: 'Services', color: '#2ecc71' },
        { id: 'ind_11', name: 'Transport', color: '#2ecc71' },
        { id: 'ind_12', name: 'Travel', color: '#2ecc71' },
        { id: 'ind_13', name: 'Utilities', color: '#2ecc71' }
        ];

        const FOUNDRIES_DATA = [
        { id: 'fnd_1', name: 'Supply Chain', color: '#00d2d3' }, // Cyan (Foundries)
        { id: 'fnd_2', name: 'Trading', color: '#00d2d3' },
        { id: 'fnd_3', name: 'Sustainability', color: '#00d2d3' },
        { id: 'fnd_4', name: 'Engineering', color: '#00d2d3' },
        { id: 'fnd_5', name: 'Service Stations', color: '#00d2d3' },
        { id: 'fnd_6', name: 'Customer', color: '#00d2d3' }
        ];

        // --- 2. Helpers para generación aleatoria ---
        // Palabras para generar títulos cortos (< 20 chars)
        const prefixes = ["Future", "Smart", "Global", "Eco", "Auto", "Tech", "Lean", "Data", "Next", "Open"];
        const suffixes = ["Grid", "Flow", "AI", "Chain", "Hub", "Lab", "Ops", "Core", "Sync", "Wave"];

        const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
        const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

        // Función para obtener un sub-array aleatorio de IDs (para simular múltiples etiquetas)
        const getRandomIds = (sourceArray, maxCount = 2) => {
        const count = getRandomInt(1, maxCount); // Entre 1 y maxCount etiquetas
        const shuffled = [...sourceArray].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count).map(item => item.id);
        };

        // --- 3. Generación de las numItems Talks ---

        const talks = Array.from({ length: numItems }, (_, index) => {
            // Generar nombre corto
            const name = `${getRandomItem(prefixes)} ${getRandomItem(suffixes)}`;
            
            return {
                id: `talk_${index + 1}`,
                name: name.substring(0, 20), // Asegurar max 20 chars
                industries: getRandomIds(INDUSTRIES_DATA, 2), // 1 o 2 industrias por talk
                foundries: getRandomIds(FOUNDRIES_DATA, 2),   // 1 o 2 foundries por talk
                state: getRandomInt(0, 2) // Valores: 0, 1, 2
            };
        });

        // --- 4. Objeto Final ---

        this.database = {
            industries: INDUSTRIES_DATA,
            foundries: FOUNDRIES_DATA,
            talks: talks
        };

        console.log(JSON.stringify(this.database, null, 2));
    }
    //----------------------------------------------
    // AUX:

  
}
export default FakeData