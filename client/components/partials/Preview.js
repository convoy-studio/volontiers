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
    this.delta = 0 // Used for update movement animation
    this.halfMargin = 80
    this.margin = 180
    this.planes = [] // All planes array
    this.isEnteredPreview = false
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
    this.parent = this.refs.preview
    this.renderer = new PIXI.WebGLRenderer(1, 1, {antialias: true, roundPixels: true})
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
    if (this.previewLoadCounter === 0) return
    this.delta += 0.01
    const currentPlane = this.planes[this.counter.props.index]
    const nextNx = Math.max(Store.Mouse.nX - 0.4, 0) * 0.2
    const offsetX = nextNx * 400
    const offsetY = nextNx * 300
    const easing = Math.max(0.1 * nextNx * 13.6, 0.1)
    this.mousePreviewActionHandler(nextNx)
    Utils.planeAnim(currentPlane, Store.Mouse, this.delta, offsetX, offsetY, easing)
    this.renderer.render(this.stage)
  }
  mousePreviewActionHandler(val) {
    if (val > 0) {
      if (this.isEnteredPreview) return // return is it's already entered, so avoid to send multiple actions
      this.isEnteredPreview = true
      Actions.mouseEnterPreview()
    } else {
      if (!this.isEnteredPreview) return // return is it's already not entered, so avoid to send multiple actions
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
      Router.setRoute(`/project/${this.projects[this.counter.props.index].slug}`)
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
