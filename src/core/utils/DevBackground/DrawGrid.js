class DrawGrid {
  constructor(obj) {
    console.log("(DrawGrid.CONSTRUCTORA): ", obj)
    this.app = obj.app
    this.draw = this.app.draw
    this.id = obj.id
    this.parentSVG = obj.parentSVG

    // Container group
    this.contSVG = this.draw.group().id(this.id).addTo(this.parentSVG)

    // Grid parameters
    const GRID_WIDTH = (obj.width || 500) - 1
    const GRID_HEIGHT = (obj.height || 500) - 1
    const COLS = obj.cols || 20
    const ROWS = obj.rows || 20
    const CELL_WIDTH = GRID_WIDTH / COLS
    const CELL_HEIGHT = GRID_HEIGHT / ROWS
    const W = COLS * CELL_WIDTH
    const H = ROWS * CELL_HEIGHT

    const stroke = { width: 1, color: '#dddddd' }

    // Group for grid lines
    this.translate_g = this.contSVG.group()

    // Vertical lines
    for (let c = 0; c <= COLS; c++) {
      const x = -W / 2 + c * CELL_WIDTH + 0.5
      this.draw.line(x, -H / 2, x, H / 2).stroke(stroke).addTo(this.translate_g)
    }

    // Horizontal lines
    for (let r = 0; r <= ROWS; r++) {
      const y = -H / 2 + r * CELL_HEIGHT + 0.5
      this.draw.line(-W / 2, y, W / 2, y).stroke(stroke).addTo(this.translate_g)
    }

    // --- AXES ---
    // X axis (red)
    this.draw.line(-W / 2, 0, W / 2, 0)
      .stroke({ width: 1, color: 'red', opacity: 0.2 })
      .addTo(this.translate_g)

    // Y axis (green)
    this.draw.line(0, -H / 2, 0, H / 2)
      .stroke({ width: 1, color: 'green', opacity: 0.2 })
      .addTo(this.translate_g)
  }
}

export default DrawGrid

