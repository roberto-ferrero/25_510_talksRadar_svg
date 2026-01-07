/**
 * FakePanel.js
 * Actualizado: Inicio vacío y comportamiento de toggle en las pestañas.
 */

class FakePanel {
    constructor(obj) {
        this.app = obj.app;
        this.project = obj.project;
        
        const db = this.project.data.database;
        if (!db) {
            console.error("FakePanel Error: Database not found.");
            this.data = { industries: [], foundries: [] };
        } else {
            this.data = db;
        }

        this.selectedIndustries = new Set();
        this.selectedFoundries = new Set();
        this.activeFamily = null; // Empieza en null (ninguna seleccionada)

        this.industryElements = {};
        this.foundryElements = {};
        this.container = null;
        this.contentContainer = null;
        this.tabButtons = {};

        this.init();
    }

    init() {
        this.injectStyles();
        this.createDOM();
        
        // COMENTADO/ELIMINADO: Ya no forzamos una familia al inicio.
        // this.switchFamily('industries'); 
    }

    // ... (injectStyles y createDOM se mantienen igual) ...
    // Solo asegúrate de incluir injectStyles y createDOM en tu archivo final 
    // tal como estaban en la versión anterior.

    injectStyles() {
        // ... (mismo código de estilos de la respuesta anterior) ...
        const styles = `
            #fake-panel-container {
                position: absolute;
                top: 60px;
                left: 20px;
                width: 380px;
                background-color: #050A14;
                border: 1px solid #1C2433;
                border-radius: 12px;
                padding: 24px;
                font-family: 'Inter', sans-serif;
                z-index: 1000;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                user-select: none;
            }
            .fp-tabs-container {
                display: flex;
                background-color: #161D2C;
                padding: 4px;
                border-radius: 8px;
                margin-bottom: 24px;
            }
            .fp-tab-btn {
                flex: 1;
                text-align: center;
                padding: 10px 0;
                font-size: 14px;
                font-weight: 500;
                color: #8B949E;
                cursor: pointer;
                border-radius: 6px;
                transition: all 0.2s ease;
            }
            .fp-tab-btn:hover { color: #E0E0E0; }
            .fp-tab-btn.active {
                background-color: #2A3649;
                color: #E0E0E0;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            .fp-content-area { min-height: 0px; } /* Ajuste para cuando esté vacío */
            .fp-section { margin-bottom: 0; animation: fadeIn 0.3s ease; }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(5px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .fp-header {
                display: flex; align-items: center; margin-bottom: 12px;
                font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.7;
            }
            .fp-dot { width: 8px; height: 8px; border-radius: 50%; margin-right: 8px; }
            .fp-tags-wrapper { display: flex; flex-wrap: wrap; gap: 8px; }
            .fp-tag {
                background-color: #161D2C; color: #E0E0E0; padding: 8px 14px;
                border-radius: 8px; font-size: 13px; cursor: pointer;
                border: 1px solid transparent; transition: all 0.2s ease;
            }
            .fp-tag:hover { background-color: #1F293A; border-color: #2A3649; }
            .fp-tag.industry-tag.selected {
                background-color: rgba(46, 204, 113, 0.15); border-color: #2ECC71; color: #4ADE80;
            }
            .fp-tag.foundry-tag.selected {
                background-color: rgba(34, 211, 238, 0.15); border-color: #22D3EE; color: #22D3EE;
            }
            .color-industries { color: #4ADE80; }
            .dot-industries { background-color: #2ECC71; }
            .color-foundries { color: #22D3EE; }
            .dot-foundries { background-color: #22D3EE; }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    createDOM() {
        this.container = document.createElement("div");
        this.container.id = "fake-panel-container";

        const tabsContainer = document.createElement("div");
        tabsContainer.className = "fp-tabs-container";

        const tabInd = document.createElement("div");
        tabInd.className = "fp-tab-btn";
        tabInd.innerText = "Industries";
        tabInd.onclick = () => this.switchFamily("industries");
        this.tabButtons['industries'] = tabInd;

        const tabFnd = document.createElement("div");
        tabFnd.className = "fp-tab-btn";
        tabFnd.innerText = "Foundries";
        tabFnd.onclick = () => this.switchFamily("foundries");
        this.tabButtons['foundries'] = tabFnd;

        tabsContainer.appendChild(tabInd);
        tabsContainer.appendChild(tabFnd);
        this.container.appendChild(tabsContainer);

        this.contentContainer = document.createElement("div");
        this.contentContainer.className = "fp-content-area";
        this.container.appendChild(this.contentContainer);

        document.body.appendChild(this.container);
    }

    // --- Core Logic: Switching Families with Toggle ---

    switchFamily(familyType) {
        // 1. COMPROBACIÓN DE TOGGLE (Apagar si ya está activo)
        if (this.activeFamily === familyType) {
            this.activeFamily = null;
            
            // Retirar clase visual 'active' de todos los botones
            Object.values(this.tabButtons).forEach(btn => btn.classList.remove('active'));
            
            // Limpiar el contenido (ocultar subcategorías)
            this.contentContainer.innerHTML = "";

            // Emitir evento con null para indicar que no hay familia seleccionada
            if (this.app.emitter && typeof this.app.emitter.emit === 'function') {
                this.app.emitter.emit("onFamilySelected", { family: null });
            }
            return; // Salimos de la función aquí
        }

        // 2. ACTIVACIÓN NORMAL (Si no estaba activo)
        this.activeFamily = familyType;

        // Emitir evento
        if (this.app.emitter && typeof this.app.emitter.emit === 'function') {
            this.app.emitter.emit("onFamilySelected", { family: familyType.toUpperCase() });
        }

        // Actualizar UI Tabs
        Object.values(this.tabButtons).forEach(btn => btn.classList.remove('active'));
        if (this.tabButtons[familyType]) {
            this.tabButtons[familyType].classList.add('active');
        }

        // Renderizar contenido
        this.renderContent(familyType);
    }

    renderContent(familyType) {
        this.contentContainer.innerHTML = "";

        if (familyType === 'industries') {
            if (this.data.industries && this.data.industries.length > 0) {
                const section = this.createSection(
                    "Select Industry", 
                    this.data.industries, 
                    "color-industries", 
                    "dot-industries",
                    "industry-tag",
                    (id, el) => this.handleIndustryClick(id, el)
                );
                this.contentContainer.appendChild(section);
                this.restoreSelectionState(this.selectedIndustries, this.industryElements);
            }
        } 
        else if (familyType === 'foundries') {
            if (this.data.foundries && this.data.foundries.length > 0) {
                const section = this.createSection(
                    "Select Foundry", 
                    this.data.foundries, 
                    "color-foundries", 
                    "dot-foundries",
                    "foundry-tag",
                    (id, el) => this.handleFoundryClick(id, el)
                );
                this.contentContainer.appendChild(section);
                this.restoreSelectionState(this.selectedFoundries, this.foundryElements);
            }
        }
    }

    restoreSelectionState(selectionSet, elementsMap) {
        selectionSet.forEach(id => {
            if (elementsMap[id]) {
                elementsMap[id].classList.add('selected');
            }
        });
    }

    createSection(title, items, headerColorClass, dotClass, tagTypeClass, clickHandler) {
        const sectionDiv = document.createElement("div");
        sectionDiv.className = "fp-section";

        const header = document.createElement("div");
        header.className = `fp-header ${headerColorClass}`;
        const dot = document.createElement("div");
        dot.className = `fp-dot ${dotClass}`;
        const titleText = document.createTextNode(title);
        header.appendChild(dot);
        header.appendChild(titleText);
        sectionDiv.appendChild(header);

        const tagsWrapper = document.createElement("div");
        tagsWrapper.className = "fp-tags-wrapper";

        items.forEach(item => {
            const tag = document.createElement("div");
            tag.className = `fp-tag ${tagTypeClass}`;
            tag.innerText = item.name;
            
            if(tagTypeClass === 'industry-tag') {
                this.industryElements[item.id] = tag;
            } else {
                this.foundryElements[item.id] = tag;
            }

            tag.onclick = () => clickHandler(item.id, tag);
            tagsWrapper.appendChild(tag);
        });

        sectionDiv.appendChild(tagsWrapper);
        return sectionDiv;
    }

    handleIndustryClick(id, element) {
        if (this.selectedFoundries.size > 0) this.clearAllFoundries();

        if (this.selectedIndustries.has(id)) {
            this.selectedIndustries.delete(id);
            element.classList.remove('selected');
            this.app.emitter.emit("onIndustryDeselected", { id: id });
        } else {
            this.selectedIndustries.add(id);
            element.classList.add('selected');
            this.app.emitter.emit("onIndustrySelected", { id: id });
        }
    }

    handleFoundryClick(id, element) {
        if (this.selectedIndustries.size > 0) this.clearAllIndustries();

        if (this.selectedFoundries.has(id)) {
            this.selectedFoundries.delete(id);
            element.classList.remove('selected');
            this.app.emitter.emit("onFoundryDeselected", { id: id });
        } else {
            this.selectedFoundries.add(id);
            element.classList.add('selected');
            this.app.emitter.emit("onFoundrySelected", { id: id });
        }
    }

    clearAllIndustries() {
        this.selectedIndustries.forEach(id => {
            if (this.industryElements[id]) this.industryElements[id].classList.remove('selected');
            this.app.emitter.emit("onIndustryDeselected", { id: id });
        });
        this.selectedIndustries.clear();
    }

    clearAllFoundries() {
        this.selectedFoundries.forEach(id => {
            if (this.foundryElements[id]) this.foundryElements[id].classList.remove('selected');
            this.app.emitter.emit("onFoundryDeselected", { id: id });
        });
        this.selectedFoundries.clear();
    }
}
export default FakePanel;