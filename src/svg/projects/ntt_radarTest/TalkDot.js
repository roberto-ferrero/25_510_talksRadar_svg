import gsap from "gsap"
import { SVG, Point } from '@svgdotjs/svg.js'
import EasedOutValue from "../../core/utils/EasedOutValue"

// ------------------------------------------------------
// HELPER: Extraído fuera de la clase para no recrearlo
// Parseamos una vez y devolvemos un objeto ligero.
// ------------------------------------------------------
const parseHexColor = (hex) => {
    const cleanHex = hex.replace('#', '');
    return {
        r: parseInt(cleanHex.substring(0, 2), 16),
        g: parseInt(cleanHex.substring(2, 4), 16),
        b: parseInt(cleanHex.substring(4, 6), 16),
        a: parseInt(cleanHex.substring(6, 8), 16)
    };
};

const lerp = (s, e, t) => s + (e - s) * t;
const toHex = (n) => Math.round(n).toString(16).padStart(2, '0');

class TalkDot {
    constructor(obj) {
        this.app = obj.app
        this.project = obj.project
        this.item = obj.item
        this.parentSVG = obj.parentSVG
        
        this.BASE_SIZE = 2.5
        
        // Colores base (Strings)
        this.hexStart = "#7656ebff"; 
        this.hexEnd = "#7656ebff";   

        // OPTIMIZACIÓN 1: Pre-calcular los valores numéricos
        // Así en el updateRAF no parseamos strings, solo interpolamos números.
        this._cStart = parseHexColor(this.hexStart);
        this._cEnd = parseHexColor(this.hexEnd);
        
        // Estado actual
        this.currentHex = this.hexStart;

        this.eased_size = new EasedOutValue(this.BASE_SIZE, 0.1, 0.001, this.app.emitter, "onUpdateRAF")
        this.POSITION = new Point(0, 0)

        // 1. VISUAL DOT
        this.color_dot = this.app.draw
            .circle(this.BASE_SIZE * 2)
            .fill(this.hexStart) // Usamos la variable
            .center(0, 0)
            .addTo(this.project.dots_g)
            // .opacity(1) // Opacity ya viene en el alpha del color (ff), redundante si usas #rrggbbaa

        // 2. HIT AREA
        this.button_dot = this.app.draw
            .circle(40)
            .fill("#00000000")
            .center(0, 0)
            .addTo(this.project.buttons_g)
            .on('mouseover', () => this._onRollover())
            .on('mouseout', () => this._onRollout())
            .css({ cursor: 'pointer' })

        // 3. TOOLTIP
        const labelText = this.item.name || "Item " + this.item.itemIndex;
    }

    //----------------------------------------------
    // PUBLIC:
    // Si necesitas cambiar el color base dinámicamente y recalcular
    colorTo(colorStr) {
        this.hexStart = colorStr;
        this._cStart = parseHexColor(colorStr); // Recalculamos caché
        this.color_dot.fill({ color: colorStr });
    }

    //----------------------------------------------
    // EVENTS:
    updateRAF() {
        this._updatePosition();
        this._updateTooltip()
        this._updateColor();
        this._updateSize();
    }

    _updatePosition(){
        if (this.project.IN_OUTRO){
            this.POSITION.x = this.item.ITEM_POINT.x*(1-this.project.OUTRO_PROGRESS)
            this.POSITION.y = this.item.ITEM_POINT.y*(1-this.project.OUTRO_PROGRESS)
            // // Update DOM positions
            this.color_dot.center(this.POSITION.x, this.POSITION.y)
            this.button_dot.hide()
        }else{
            this.POSITION.x = this.item.ITEM_POINT.x
            this.POSITION.y = this.item.ITEM_POINT.y
            // Update DOM positions
            this.color_dot.center(this.POSITION.x, this.POSITION.y)
            this.button_dot.show().center(this.POSITION.x, this.POSITION.y)
        }
    }
    _updateTooltip(){
        if (this.project.IN_OUTRO && this.tooltip) {
            this.tooltip.remove()
            this.tooltip = null
        }   
    }
    _updateColor(){
        if (this.project.IN_OUTRO){
            // Clamp simple para seguridad
            const t = this.project.OUTRO_PROGRESS
            // Interpolación Numérica (Muy rápida)
            // Solo construimos el string al final
            const r = toHex(lerp(this._cStart.r, this._cEnd.r, t));
            const g = toHex(lerp(this._cStart.g, this._cEnd.g, t));
            const b = toHex(lerp(this._cStart.b, this._cEnd.b, t));
            const a = toHex(lerp(this._cStart.a, this._cEnd.a, t));

            const newColor = `#${r}${g}${b}${a}`;

            // Pequeña guarda para evitar tocar el DOM si el color es idéntico al frame anterior (opcional pero bueno)
            if (this.currentHex !== newColor) {
                this.color_dot.fill({ color: newColor });
                this.currentHex = newColor;
            }
        }
    }
    _updateSize(){
        if (this.project.IN_OUTRO){
            this.color_dot.radius(this.BASE_SIZE*(1-this.project.OUTRO_PROGRESS))

        }else{
            this.color_dot.radius(this.eased_size.get())
        }
    }
    //----------------------------------------------
    // PRIVATE:
    _showTooltip() {
        if (!this.project.IN_OUTRO){
            // ... (Tu código existente del tooltip, sin cambios necesarios)
            this.tooltip = this.app.draw
                .text(this.item.data.name || "Info") // Fallback por seguridad
                .font({ size: 12, family: 'Arial', anchor: 'middle', weight: 'light' })
                .fill('#ffffff')
                .center(this.POSITION.x, this.POSITION.y - 29)
                .addTo(this.project.tooltip_g)
                .css({ pointerEvents: 'none', userSelect: 'none' })
        }
    }

    _hideTooltip() {
        if (!this.project.IN_OUTRO){
            if (this.tooltip) {
                this.tooltip.remove()
                this.tooltip = null
            }
        }
    }

    _

    _onRollover() {
        this.eased_size.set(20)
        this.app.emitter.emit("onDotRollover", { itemIndex: this.item.itemIndex })
        this._showTooltip()
    }

    _onRollout() {
        this.eased_size.set(this.BASE_SIZE)
        this.app.emitter.emit("onDotRollout", { itemIndex: this.item.itemIndex })
        this._hideTooltip()
    }

}

export default TalkDot