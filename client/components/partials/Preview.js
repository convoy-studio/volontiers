import BaseComponent from '../../pager/components/BaseComponent'
import Data from '../../data'
import Store from '../../store'
import Actions from '../../actions'
import Constants from '../../constants'
import Router from '../../services/router'
import Utils from '../../utils/Utils'
import dom from 'dom-hand'
import inertia from 'wheel-inertia'
import counter from 'ccounter'

class Preview extends BaseComponent {
  constructor(props) {
    super(props)
    Store.on(Constants.PREVIEWS_LOADED, this.onPreviewsLoaded)
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
    this.isEnteredPreview = false
    this.animSigns = ['1', '-1', '-1', '1', '1', '1', '-1', '-1'] // Used for mouseMove animation : direction of vertices
    this.verticesOrder = ['tlx', 'tly', 'trx', 'try', 'blx', 'bly', 'brx', 'bry'] // Used for mouseMove animation : positions of vertices
    this.firstPreviewLoaded = false
    this.previewLoadCounter = 0
    this.projects = Store.getProjects()
    this.counter = counter(this.projects.length)
  }
  render() {
    return (
      <div ref="preview" className="preview"></div>
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
    // TODO: Replace this.projects.length by desired number of projects to show on home page
    const loader = Utils.pixiLoad(`preview-${this.previewLoadCounter}`, `assets/${this.projects[this.previewLoadCounter].image}`, this.completeLoader)
  }
  completeLoader(data) {
    let texture = data.texture
    this.createPlane(texture, this.previewLoadCounter)
    this.resize()
    if (!this.firstPreviewLoaded) {
      this.firstPreviewLoaded = true
      Actions.previewsLoaded()
    }
    this.previewLoadCounter++
    if (this.previewLoadCounter < this.projects.length) {
      const newLoader = Utils.pixiLoad(`preview-${this.previewLoadCounter}`, `assets/${this.projects[this.previewLoadCounter].image}`, this.completeLoader)
    }
  }
  createPlane(texture, idx) {
    let previewH = Store.Window.h - this.margin
    const plane = {
      mesh: new PIXI.mesh.Plane(texture, 2, 2)
    }
    plane.verts = plane.mesh.vertices
    plane.iverts = plane.verts.slice(0)
    this.container.addChild(plane.mesh)
    this.planes.push(plane)
  }
  addListeners() {
    TweenMax.ticker.addEventListener('tick', this.update.bind(this))
    dom.event.on(this.parent, 'click', this.mouseClick)
    inertia.addCallback(this.onScroll)
    dom.event.on(this.parent, 'DOMMouseScroll', this.handleScroll)
    dom.event.on(this.parent, 'mousewheel', this.handleScroll)
  }
  resize() {
    const windowW = Store.Window.w
    const windowH = Store.Window.h
    const marginScale = 0.7
    const resizeVars = Utils.resizePositionProportionally(windowW * marginScale, windowH * marginScale, Constants.MEDIA_GLOBAL_W, Constants.MEDIA_GLOBAL_H)
    for (let i = 0; i < this.planes.length; i++) {
      this.planes[i].mesh.scale = new PIXI.Point(resizeVars.scale, resizeVars.scale)
      this.planes[i].mesh.position.x = (windowW >> 1) - (resizeVars.width >> 1)
      this.planes[i].mesh.position.y = ((windowH >> 1) - (resizeVars.height >> 1)) + (i * windowH)
    }
    this.renderer.resize(windowW, windowH)
  }
  update() {
    this.delta += 0.01
    const currentPlane = this.planes[this.counter.props.index]
    const nextNx = Math.max(Store.Mouse.nX - 0.4, 0) * 0.2
    const offsetX = nextNx * 400
    const offsetY = nextNx * 300
    const easing = Math.max(0.1 * nextNx * 13.6, 0.1)

    this.mousePreviewActionHandler(nextNx)

    const ntlx = ((currentPlane.iverts[0] + Math.sin(Store.Mouse.nX - 0.5) * 50) - currentPlane.verts[0] + offsetX) * easing
    const ntly = ((currentPlane.iverts[1] + Math.cos(Store.Mouse.nY) * 10) - currentPlane.verts[1] - offsetY) * easing
    const ntrx = ((currentPlane.iverts[2] + Math.sin(Store.Mouse.nX + 0.5) * 50) - currentPlane.verts[2] + offsetX) * easing
    const ntry = ((currentPlane.iverts[3] + Math.cos(Store.Mouse.nY) * 30) - currentPlane.verts[3] + offsetY) * easing
    const nblx = ((currentPlane.iverts[4] + Math.sin(Store.Mouse.nX - 0.4) * 80) - currentPlane.verts[4] + offsetX) * easing
    const nbly = ((currentPlane.iverts[5] + Math.cos(Store.Mouse.nY - 0.6) * 40) - currentPlane.verts[5] + offsetY) * easing
    const nbrx = ((currentPlane.iverts[6] + Math.sin(Store.Mouse.nX + 0.4) * 80) - currentPlane.verts[6] + offsetX) * easing
    const nbry = ((currentPlane.iverts[7] + Math.cos(Store.Mouse.nY - 0.6) * 20) - currentPlane.verts[7] - offsetY) * easing
    currentPlane.verts[0] += ntlx + Math.cos(this.delta) * 2
    currentPlane.verts[1] += ntly - Math.sin(this.delta) * 3
    currentPlane.verts[2] += ntrx - Math.cos(this.delta) * 1
    currentPlane.verts[3] += ntry + Math.sin(this.delta) * 4
    currentPlane.verts[4] += nblx + Math.cos(this.delta) * 1
    currentPlane.verts[5] += nbly - Math.sin(this.delta) * 2
    currentPlane.verts[6] += nbrx + Math.cos(this.delta) * 2
    currentPlane.verts[7] += nbry - Math.sin(this.delta) * 1
    this.renderer.render(this.stage)
  }
  mousePreviewActionHandler(val) {
    if (val > 0) {
      if (this.isEnteredPreview) return
      this.isEnteredPreview = true
      Actions.mouseEnterPreview()
    } else {
      if (!this.isEnteredPreview) return
      this.isEnteredPreview = false
      Actions.mouseLeavePreview()
    }
  }
  onPreviewsLoaded() {
    this.addListeners()
  }
  mouseClick(e) {
    // Test if on right preview area
    if (Store.Mouse.y > this.halfMargin && Store.Mouse.y < Store.Window.h - (this.halfMargin) && Store.Mouse.x > Store.Window.w / 2) {
      Router.setRoute(`/project/${this.projects[this.currentPlaneIdx].slug}`)
    }
  }
  handleScroll(e) {
    let delta = e.wheelDelta
    inertia.update(delta)
  }
  onScroll(direction) {
    switch (direction) {
    case 1:
      this.counter.dec()
      break
    case -1:
      this.counter.inc()
      break
    default:
      this.counter.inc()
    }
    this.animateContainer()
    Actions.changePreview(this.counter.props.index)
  }
  animateContainer() {
    const windowH = Store.Window.h
    const position = this.counter.props.index * windowH
    TweenMax.to(this.container.position, 0.6, {y: -position, ease: Expo.easeOut})
  }
  componentWillUnmount() {
    Store.off(Constants.PREVIEWS_LOADED, this.addListeners)
    Store.off(Constants.WINDOW_RESIZE, this.resize)
    dom.event.off(this.parent, 'click', this.mouseClick)
    dom.event.off(this.parent, 'DOMMouseScroll', this.handleScroll)
    dom.event.off(this.parent, 'mousewheel', this.handleScroll)
  }
}

export default Preview
