import BaseComponent from '../../pager/components/BaseComponent'
import Data from '../../data'
import Store from '../../store'
import Actions from '../../actions'
import Constants from '../../constants'
import utils from '../../utils/Utils'
import dom from 'dom-hand'

class Preview extends BaseComponent {
  constructor(props) {
    super(props)
    Store.on(Constants.PREVIEWS_LOADED, this.addListeners)
    Store.on(Constants.WINDOW_RESIZE, this.resize)
    Store.Window.w = window.innerWidth
    Store.Window.h = window.innerHeight
    this.currentPlaneIdx = 0
    this.currentScroll = 0
    this.delta = 0 // Used for update movement animation
    this.halfMargin = 80
    this.margin = 180
    this.planes = [] // All planes array
    this.planesVertices = [] // All initial vertices of all planes
    this.onceRight = false // Used for mouseMove animation
    this.hoverPreview = 150 // Used for mouseMove animation
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
    this.renderer.backgroundColor = 0xfffff
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
    // loader.on('progress', this.progressLoader)
    loader.on('complete', this.completeLoader)
    loader.load()
  }
  // progressLoader() {
  //   let texture = new PIXI.Texture.fromImage(`assets/${Store.Previews[this.counter].image}`)
  //   this.createPlane(texture, this.counter)
  //   this.counter++
  // }
  completeLoader() {
    console.log('loaded')
    for (let i = 0; i < Store.Previews.length; i++) {
      let texture = new PIXI.Texture.fromImage(`assets/${Store.Previews[i].image}`)
      this.createPlane(texture, i)
    }
    Actions.previewsLoaded()
  }

  createPlane(texture, idx) {
    console.log('plane')
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
    console.log('generate')
    TweenMax.ticker.addEventListener('tick', this.update.bind(this))
    this.mouseMove()
    this.onScroll()
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
      this.planes[i].mesh.position.y = (this.margin * 2) + (i * previewH)
      let left = ( windowW - this.planes[i].mesh.width) / 2
      this.planes[i].mesh.position.x = left
    }
  }

  update() {
    this.delta += 0.01
    for (let k = 0; k < this.planes.length; k++) {
      for (let i = 0; i < this.planes[k].mesh.vertices.length; i++) {
        this.planes[k].mesh.vertices[i] = this.planesVertices[k][i] + (Math.sin((i * 0.9) + this.delta)) / 8
      }
    }
    this.renderer.render(this.stage)
  }

  mouseMove() {
    let defaultTop = this.planesVertices[0][3]
    let defaultBottom = this.planesVertices[0][7]
    let tweenValue = {
      v: 0
    }
    dom.event.on(this.refs.preview, 'mousemove', () => {
      if (Store.Mouse.y > this.halfMargin && Store.Mouse.y < Store.Window.h - (this.halfMargin) && Store.Mouse.x > Store.Window.w / 2) { // Test if on left preview area
        if (!this.onceRight) {
          TweenMax.to(tweenValue, 1, {
            v: this.hoverPreview,
            ease: Sine.easeOut,
            onUpdate: () => {
              this.planesVertices[0][3] = defaultTop + tweenValue.v
              this.planesVertices[0][7] = defaultBottom - tweenValue.v
            },
            onComplete: () => {
              this.onceRight = true
            }
          })
        }
      } else {
        if (this.onceRight && tweenValue.v === this.hoverPreview) {
          let newTop = this.planesVertices[0][3]
          let newBottom = this.planesVertices[0][7]
          let resetValues = {
            t: this.planesVertices[0][3],
            b: this.planesVertices[0][7]
          }
          TweenMax.to(resetValues, 1, {
            t: defaultTop,
            b: defaultBottom,
            ease: Sine.easeOut,
            onUpdate: () => {
              this.planesVertices[0][3] = resetValues.t
              this.planesVertices[0][7] = resetValues.b
            },
            onComplete: () => {
              this.onceRight = false
              tweenValue.v = 0
            }
          })
        }
      }
    })
  }

  onScroll() {
    require('mouse-wheel')((dx, dy) => {
      let toScroll = 0
      if (this.currentPlaneIdx >= 0 && this.currentPlaneIdx < this.planes.length) {
        if (dy > 10 && this.currentPlaneIdx < this.planes.length - 1) {
          toScroll = - ((this.halfMargin * 3) + this.planes[this.currentPlaneIdx].mesh.height)
          this.currentPlaneIdx++
          console.log('down')
        } else if (dy < -10 && this.currentPlaneIdx > 0) {
          toScroll = ((this.halfMargin * 3) + this.planes[this.currentPlaneIdx].mesh.height)
          this.currentPlaneIdx--
          console.log('up')
        }
        this.currentScroll = this.currentScroll  + toScroll
        TweenMax.to(this.container.position, 1, {y: this.currentScroll, ease: Circ.easeOut, onComplete: () => {
          console.log('ended')
        }})
      }
    })
  }
}

export default Preview
