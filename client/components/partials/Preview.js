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
    Store.on(Constants.PREVIEWS_LOADED, this.generateSections)
    Store.on(Constants.WINDOW_RESIZE, this.resize)
    Store.Window.w = window.innerWidth
    Store.Window.h = window.innerHeight
    this.counter = 0
    this.delta = 0
    this.halfMargin = 80
    this.margin = 180
    this.planes = []
    this.planesVertices = []
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
    for (let i = 0; i < 1; i++) {
      loader.add(`preview-${i}`, `assets/${Store.Previews[i].image}`)
    }
    loader.on('progress', this.progressLoader)
    loader.on('complete', this.completeLoader)
    loader.load()
  }
  progressLoader() {
    let texture = new PIXI.Texture.fromImage(`assets/${Store.Previews[this.counter].image}`)
    this.createPlane(texture, this.counter)
    // this.counter++
  }
  completeLoader() {
    console.log('loaded')
    Actions.previewsLoaded()
  }

  createPlane(texture, counter) {
    let previewH = Store.Window.h - this.margin
    // this.ropes[counter] = {}
    // this.ropes[counter].ropeLength = Math.floor((((previewH) * texture.baseTexture.width) / texture.baseTexture.height) / 5)
    // this.ropes[counter].points = []
    // for (let i = 0; i < 5; i++) {
    //   this.ropes[counter].points.push(new PIXI.Point(i * this.ropes[counter].ropeLength, 0))
    // }
    // console.log(this.ropes[counter])
    // this.ropes[counter].mesh = new PIXI.mesh.Rope(texture, this.ropes[counter].points)
    // this.ropes[counter].mesh.height = previewH
    // this.ropes[counter].mesh.width = (this.ropes[counter].mesh.height * texture.baseTexture.width) / texture.baseTexture.height
    // this.ropes[counter].mesh.position.y = (previewH / 2) + (this.halfMargin)
    // this.ropes[counter].mesh.position.x = (Store.Window.w - this.ropes[counter].mesh.width) / 2
    // this.container.addChild(this.ropes[counter].mesh)
    let g = new PIXI.Graphics()
    g.beginFill(0xFF0000, 1)
    this.planes[counter] = {}
    this.planes[counter].mesh = new PIXI.mesh.Plane(texture, 2, 2)
    this.planes[counter].mesh.height = previewH
    this.planes[counter].mesh.width = (this.planes[counter].mesh.height * texture.baseTexture.width) / texture.baseTexture.height
    this.planes[counter].mesh.position.y = this.halfMargin + counter * previewH
    let left = ( Store.Window.w - this.planes[counter].mesh.width) / 2
    this.planes[counter].mesh.position.x = left
    for (let k = 0; k < this.planes[counter].mesh.vertices.length; k += 2) {
      g.drawCircle(((this.planes[counter].mesh.vertices[k] * this.planes[counter].mesh.width) / texture.baseTexture.width) + left, ((this.planes[counter].mesh.vertices[k + 1] * this.planes[counter].mesh.height) / texture.baseTexture.height) + (this.halfMargin), 5)
    }
    this.container.addChild(this.planes[counter].mesh)
    this.container.addChild(g)
    this.planesVertices[counter] = this.planes[counter].mesh.vertices
  }

  generateSections() {
    console.log('generate')
    dom.classes.remove(dom.select('#home-page'), 'page-wrapper--fixed')
    TweenMax.ticker.addEventListener('tick', this.update.bind(this))
    // dom.event.on(this.refs.preview, 'mousemove', () => {
      // console.log(this.ropes[0].points[4], Store.Mouse.y)
      // if (Store.Mouse.y > this.halfMargin && Store.Mouse.y < Store.Window.h - (this.halfMargin)) {
      //   if (Store.Mouse.y > (Store.Window.h / 2)) {
          // this.ropes[0].points[4].y = 5
          // this.ropes[0].points[3].y = 3
          // this.ropes[0].points[2].y = 2
          // for (let i = 0; i < this.ropes[0].points.length; i++) {
          //   this.ropes[0].points[i].y = Math.sin((i * 0.5) + 0.05) * 30
          // }
        // } else {
          // this.ropes[0].points[4].y = -5
          // this.ropes[0].points[3].y = -3
          // this.ropes[0].points[2].y = -2
          // for (let i = 0; i < this.ropes[0].points.length; i++) {
          //   this.ropes[0].points[i].y = Math.sin((i * 0.5) - 0.05) * 30
          // }
        // }
      // }
      // this.ropes[0].points[1].y = Math.sin((i * Math.random()) + this.delta) * 30
    // })
  }
  resize() {
    let windowW = Store.Window.w
    let windowH = Store.Window.h
    this.renderer.view.style.width = windowW + 'px'
    this.renderer.view.style.height = windowH + 'px'
    this.renderer.resize(windowW, windowH)
  }

  update() {
    this.delta += 0.01
    for (let i = 0; i < this.planes[0].mesh.vertices.length; i += 2) {
      this.planes[0].mesh.vertices[i] = this.planesVertices[0][i] + Math.sin((i * 0.9) + this.delta) / 6
      this.planes[0].mesh.vertices[i + 1] = this.planesVertices[0][i + 1] + Math.sin((i * 0.9) + this.delta) / 6
    }
    this.renderer.render(this.stage)
  }
}

export default Preview
