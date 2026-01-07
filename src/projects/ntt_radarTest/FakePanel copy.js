/**
 * FakePanel.js
 * Generates a UI panel using the master data (industries/foundries)
 * defined in the FakeData instance attached to the App.
 */

class FakePanel {
    constructor(obj) {
        this.app = obj.app; // Store reference to access app.emitter and app.fakeData
        this.project = obj.project;
        
        // 1. Retrieve Data from the FakeData instance
        // We assume your main App class does: this.fakeData = new FakeData({app: this})
        // So we look for app.fakeData.database or app.data.database
        const db = this.project.data.database;

        if (!db) {
            console.error("FakePanel Error: Could not find 'database' in this.app.fakeData. Make sure FakeData is initialized before FakePanel.");
            this.data = { industries: [], foundries: [] }; // Fallback to prevent crash
        } else {
            this.data = db;
        }

        // 2. State tracking
        this.selectedIndustries = new Set();
        this.selectedFoundries = new Set();
        
        // 3. DOM References (mapped by ID for easy access)
        this.industryElements = {};
        this.foundryElements = {};

        this.init();
    }

    init() {
        this.injectStyles();
        this.createDOM();
    }

    injectStyles() {
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

            .fp-section { margin-bottom: 30px; }
            .fp-section:last-child { margin-bottom: 0; }

            .fp-header {
                display: flex;
                align-items: center;
                margin-bottom: 12px;
                font-size: 14px;
                font-weight: 500;
            }

            .fp-dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                margin-right: 10px;
            }

            .fp-tags-wrapper {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
            }

            .fp-tag {
                background-color: #161D2C;
                color: #E0E0E0;
                padding: 8px 16px;
                border-radius: 10px;
                font-size: 13px;
                cursor: pointer;
                border: 1px solid transparent;
                transition: all 0.2s ease;
            }

            .fp-tag:hover {
                background-color: #1F293A;
                border-color: #2A3649;
            }

            /* --- Selection States --- */
            .fp-tag.industry-tag.selected {
                background-color: rgba(46, 204, 113, 0.15);
                border-color: #2ECC71;
                color: #4ADE80;
            }

            .fp-tag.foundry-tag.selected {
                background-color: rgba(34, 211, 238, 0.15);
                border-color: #22D3EE;
                color: #22D3EE;
            }

            /* Colors */
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
        const container = document.createElement("div");
        container.id = "fake-panel-container";

        // Create Industries Section
        if (this.data.industries && this.data.industries.length > 0) {
            const industriesSection = this.createSection(
                "Industries", 
                this.data.industries, 
                "color-industries", 
                "dot-industries",
                "industry-tag",
                (id, el) => this.handleIndustryClick(id, el)
            );
            container.appendChild(industriesSection);
        }

        // Create Foundries Section
        if (this.data.foundries && this.data.foundries.length > 0) {
            const foundriesSection = this.createSection(
                "Foundries", 
                this.data.foundries, 
                "color-foundries", 
                "dot-foundries",
                "foundry-tag",
                (id, el) => this.handleFoundryClick(id, el)
            );
            container.appendChild(foundriesSection);
        }

        document.body.appendChild(container);
    }

    createSection(title, items, headerColorClass, dotClass, tagTypeClass, clickHandler) {
        const sectionDiv = document.createElement("div");
        sectionDiv.className = "fp-section";

        // Header
        const header = document.createElement("div");
        header.className = `fp-header ${headerColorClass}`;
        const dot = document.createElement("div");
        dot.className = `fp-dot ${dotClass}`;
        const titleText = document.createTextNode(title);
        header.appendChild(dot);
        header.appendChild(titleText);
        sectionDiv.appendChild(header);

        // Tags Wrapper
        const tagsWrapper = document.createElement("div");
        tagsWrapper.className = "fp-tags-wrapper";

        // Iterate over the objects from FakeData ({ id: 'ind_1', name: 'Automotion', ... })
        items.forEach(item => {
            const tag = document.createElement("div");
            tag.className = `fp-tag ${tagTypeClass}`;
            tag.innerText = item.name; // Display name
            
            // Store reference mapped by ID
            if(tagTypeClass === 'industry-tag') {
                this.industryElements[item.id] = tag;
            } else {
                this.foundryElements[item.id] = tag;
            }

            // Bind Click using the ID
            tag.onclick = () => clickHandler(item.id, tag);
            
            tagsWrapper.appendChild(tag);
        });

        sectionDiv.appendChild(tagsWrapper);
        return sectionDiv;
    }

    // --- Logic Handlers ---

    handleIndustryClick(id, element) {
        // 1. Check Mutual Exclusion: If Foundries are active, clear them
        if (this.selectedFoundries.size > 0) {
            this.clearAllFoundries();
        }

        // 2. Toggle Selection
        if (this.selectedIndustries.has(id)) {
            // Deselect
            this.selectedIndustries.delete(id);
            element.classList.remove('selected');
            this.app.emitter.emit("onIndustryDeselected", { id: id });
        } else {
            // Select
            this.selectedIndustries.add(id);
            element.classList.add('selected');
            this.app.emitter.emit("onIndustrySelected", { id: id });
        }
    }

    handleFoundryClick(id, element) {
        // 1. Check Mutual Exclusion: If Industries are active, clear them
        if (this.selectedIndustries.size > 0) {
            this.clearAllIndustries();
        }

        // 2. Toggle Selection
        if (this.selectedFoundries.has(id)) {
            // Deselect
            this.selectedFoundries.delete(id);
            element.classList.remove('selected');
            this.app.emitter.emit("onFoundryDeselected", { id: id });
        } else {
            // Select
            this.selectedFoundries.add(id);
            element.classList.add('selected');
            this.app.emitter.emit("onFoundrySelected", { id: id });
        }
    }

    // --- Helpers to clear groups ---

    clearAllIndustries() {
        this.selectedIndustries.forEach(id => {
            // Remove visual class
            if (this.industryElements[id]) {
                this.industryElements[id].classList.remove('selected');
            }
            // Emit deselect event
            this.app.emitter.emit("onIndustryDeselected", { id: id });
        });
        this.selectedIndustries.clear();
    }

    clearAllFoundries() {
        this.selectedFoundries.forEach(id => {
            // Remove visual class
            if (this.foundryElements[id]) {
                this.foundryElements[id].classList.remove('selected');
            }
            // Emit deselect event
            this.app.emitter.emit("onFoundryDeselected", { id: id });
        });
        this.selectedFoundries.clear();
    }
}
export default FakePanel;