import BaseComponent from '../../pager/components/BaseComponent'
import Data from '../../data'
import Store from '../../store'
import Actions from '../../actions'
import Constants from '../../constants'
import Router from '../../services/router'
import utils from '../../utils/Utils'
import dom from 'dom-hand'

class Preview extends BaseComponent {
  constructor(props) {
    super(props)
    Store.on(Constants.PREVIEWS_LOADED, this.addListeners)
    Store.on(Constants.WINDOW_RESIZE, this.resize)
    Store.Window.w = window.innerWidth
    Store.Window.h = window.innerHeight
    this.lastPlaneIdx = 0
    this.currentPlaneIdx = 0
    this.currentScroll = 0
    this.isScrolling = false
    this.delta = 0 // Used for update movement animation
    this.halfMargin = 80
    this.margin = 180
    this.planes = [] // All planes array
    this.planesVertices = [] // All vertices of all planes
    this.planesInitialVertices = [] // All initial vertices of all planes
    this.onceRight = false // Used for mouseMove animation : test if transitioning
    this.hoverPreview = 50 // Used for mouseMove animation : movement max of vertex
    this.tweenValue = { // Used for mouseMove animation
      v: 0
    }
    this.animSigns = ['1', '-1', '-1', '1', '1', '1', '-1', '-1'] // Used for mouseMove animation : direction of vertices
    this.verticesOrder = ['tlx', 'tly', 'trx', 'try', 'blx', 'bly', 'brx', 'bry'] // Used for mouseMove animation : positions of vertices
  }
  render() {
    return (
      <div ref="preview" className="preview">
      </div>
    )
  }
  componentDidMount() {
    this.loadPreview()
    let windowW = Store.Window.w
    let windowH = Store.Window.h
    this.parent = this.refs.preview
    this.renderer = new PIXI.WebGLRenderer(windowW, windowH, {antialias: true, roundPixels: true})
    this.renderer.backgroundColor = 0xffffff
    this.parent.appendChild(this.renderer.view)
    this.stage = new PIXI.Container()
    this.container = new PIXI.Container()
    this.stage.addChild(this.container)
  }
  loadPreview() {
    let loader = new PIXI.loaders.Loader()
    for (let i = 0; i < Store.Previews.length; i++) {
      loader.add(`preview-${i}`, `assets/${Store.Previews[i].image}`)
    }
    loader.on('complete', this.completeLoader)
    loader.load()
  }
  completeLoader() {
    for (let i = 0; i < Store.Previews.length; i++) {
      let texture = new PIXI.Texture.fromImage(`assets/${Store.Previews[i].image}`)
      this.createPlane(texture, i)
    }
    Actions.previewsLoaded()
  }

  createPlane(texture, idx) {
    let previewH = Store.Window.h - this.margin
    this.planes[idx] = {}
    this.planes[idx].mesh = new PIXI.mesh.Plane(texture, 2, 2)
    this.planes[idx].mesh.height = previewH
    this.planes[idx].mesh.width = (this.planes[idx].mesh.height * texture.baseTexture.width) / texture.baseTexture.height
    this.planes[idx].mesh.position.y = this.halfMargin + ((3 * idx) * this.halfMargin) + (idx * previewH)
    let left = ( Store.Window.w - this.planes[idx].mesh.width) / 2
    this.planes[idx].mesh.position.x = left
    this.container.addChild(this.planes[idx].mesh)
    this.planesVertices[idx] = this.planes[idx].mesh.vertices
  }
  addListeners() {
    TweenMax.ticker.addEventListener('tick', this.update.bind(this))
    this.initialTopRightVertex = this.planesVertices[this.currentPlaneIdx][3]
    this.initialBottomRightVertex = this.planesVertices[this.currentPlaneIdx][7]
    this.initialTopLeftVertex = this.planesVertices[this.currentPlaneIdx][0]
    this.initialBottomLeftVertex = this.planesVertices[this.currentPlaneIdx][5]
    for (let i = 0; i < 8; i++) {
      this.planesInitialVertices[i] = this.planesVertices[this.currentPlaneIdx][i]
    }
    dom.event.on(this.refs.preview, 'mousemove', this.mouseMove)
    dom.event.on(this.refs.preview, 'click', this.mouseClick)
    this.scrolListener = require('mouse-wheel')(this.onScroll)
  }
  resize() {
    let windowW = Store.Window.w
    let windowH = Store.Window.h
    this.renderer.view.style.width = windowW + 'px'
    this.renderer.view.style.height = windowH + 'px'
    this.renderer.resize(windowW, windowH)
    for (let i = 0; i < Store.Previews.length; i++) {
      let previewH = windowH - this.margin
      this.planes[i].mesh.height = previewH
      this.planes[i].mesh.width = (this.planes[i].mesh.height * this.planes[i].mesh.texture.baseTexture.width) / this.planes[i].mesh.texture.baseTexture.height
      this.planes[i].mesh.position.y = this.halfMargin + ((3 * i) * this.halfMargin) + (i * previewH)
      let left = ( windowW - this.planes[i].mesh.width) / 2
      this.planes[i].mesh.position.x = left
    }
    // Reset scroll
    TweenMax.to(this.container.position, 0.5, {y: 0, ease: Circ.easeOut})
  }
  update() {
    this.delta += 0.01
    for (let k = 0; k < this.planes.length; k++) {
      for (let i = 0; i < this.planes[k].mesh.vertices.length; i++) {
        this.planes[k].mesh.vertices[i] = this.planesVertices[k][i] + (Math.sin((i * 0.9) + this.delta)) / 6
      }
    }
    this.renderer.render(this.stage)
  }
  mouseMove() {
    if (Store.Mouse.y > this.halfMargin && Store.Mouse.y < Store.Window.h - (this.halfMargin) && Store.Mouse.x > Store.Window.w / 2) { // Test if on right preview area
      Store.Parent.style.cursor = 'pointer'
      if (!this.onceRight) {
        Actions.mouseEnterPreview()
        let planeIdx = this.currentPlaneIdx
        TweenMax.to(this.tweenValue, 0.2, {
          v: this.hoverPreview,
          onUpdate: () => {
            for (let i = 0; i < 8; i++) {
              let factor = 1
              if (i % 2 === 0) {
                factor = 0.2
              }
              this.planesVertices[planeIdx][i] = this.planesInitialVertices[i] + this.tweenValue.v * factor * this.animSigns[i]
            }
          },
          onComplete: () => {
            this.onceRight = true
          }
        })
      }
    } else {
      Store.Parent.style.cursor = 'auto'
      if (this.onceRight && this.tweenValue.v === this.hoverPreview) {
        Actions.mouseLeavePreview()
        let planeIdx = this.currentPlaneIdx
        let resetValues = {
          tlx: this.planesVertices[planeIdx][0],
          tly: this.planesVertices[planeIdx][1],
          trx: this.planesVertices[planeIdx][2],
          try: this.planesVertices[planeIdx][3],
          blx: this.planesVertices[planeIdx][4],
          bly: this.planesVertices[planeIdx][5],
          brx: this.planesVertices[planeIdx][6],
          bry: this.planesVertices[planeIdx][7]
        }
        TweenMax.to(resetValues, 0.2, {
          tlx: this.planesInitialVertices[0],
          tly: this.planesInitialVertices[1],
          trx: this.planesInitialVertices[2],
          try: this.planesInitialVertices[3],
          blx: this.planesInitialVertices[4],
          bly: this.planesInitialVertices[5],
          brx: this.planesInitialVertices[6],
          bry: this.planesInitialVertices[7],
          onUpdate: () => {
            for (let i = 0; i < 8; i++) {
              let key = this.verticesOrder[i]
              this.planesVertices[planeIdx][i] = resetValues[key]
            }
          },
          onComplete: () => {
            this.onceRight = false
            this.tweenValue.v = 0
          }
        })
      }
    }
  }

  mouseClick(e) {
    if (Store.Mouse.y > this.halfMargin && Store.Mouse.y < Store.Window.h - (this.halfMargin) && Store.Mouse.x > Store.Window.w / 2) { // Test if on right preview area
      Router.setRoute(`/project/${Store.Previews[this.currentPlaneIdx].slug}`)
    }
  }

  onScroll(dx, dy) {
    let toScroll = 0
    let needScroll = false
    if (this.currentPlaneIdx >= 0 && this.currentPlaneIdx < this.planes.length && !this.isScrolling) {
      dom.event.off(this.refs.preview, 'mousemove', this.mouseMove)
      if (dy > 10 && this.currentPlaneIdx < this.planes.length - 1) {
        toScroll = - Math.floor(((this.halfMargin * 3) + (Store.Window.h - this.margin)))
        this.isScrolling = true
        this.lastPlaneIdx = this.currentPlaneIdx
        this.currentPlaneIdx++
        needScroll = true
        console.log('⬇️')
      } else if (dy < -10 && this.currentPlaneIdx > 0) {
        toScroll = Math.floor(((this.halfMargin * 3) + (Store.Window.h - this.margin)))
        this.isScrolling = true
        this.lastPlaneIdx = this.currentPlaneIdx
        this.currentPlaneIdx--
        needScroll = true
        console.log('🔼')
      }
      if (needScroll) {
        this.currentScroll = this.currentScroll + toScroll
        TweenMax.to(this.container.position, 0.2, {y: this.currentScroll, ease: Circ.easeOut, onComplete: () => {
          this.isScrolling = false

          // Reset plane vertices & add listener
          for (let i = 0; i < 8; i++) {
            this.planesVertices[this.lastPlaneIdx][i] = this.planesInitialVertices[i]
          }
          for (let i = 0; i < 8; i++) {
            this.planesInitialVertices[i] = this.planesVertices[this.currentPlaneIdx][i]
          }
          this.onceRight = false
          this.tweenValue.v = 0
          Actions.changePreview(this.currentPlaneIdx)
          dom.event.on(this.refs.preview, 'mousemove', this.mouseMove)
        }})
      }
    }
  }

  componentWillUnmount() {
    dom.event.off(window, 'wheel', this.scrolListener)
  }
}

export default Preview
