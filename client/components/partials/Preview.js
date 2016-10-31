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
    // this.planesVertices[idx] = this.planes[idx].mesh.vertices
    // console.log(this.planes)
  }
  addListeners() {
    TweenMax.ticker.addEventListener('tick', this.update.bind(this))
    // for (let i = 0; i < 8; i++) {
    //   this.planesInitialVertices[i] = this.planesVertices[this.currentPlaneIdx][i]
    // }
    dom.event.on(this.parent, 'mousemove', this.mouseMove)
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

    const ntlx = ((currentPlane.iverts[0] + Math.sin(Store.Mouse.nX - 0.5) * 50) - currentPlane.verts[0]) * 0.1
    const ntly = ((currentPlane.iverts[1] + Math.cos(Store.Mouse.nY) * 10) - currentPlane.verts[1]) * 0.1
    const ntrx = ((currentPlane.iverts[2] + Math.sin(Store.Mouse.nX + 0.5) * 50) - currentPlane.verts[2]) * 0.1
    const ntry = ((currentPlane.iverts[3] + Math.sin(Store.Mouse.nY) * 10) - currentPlane.verts[3]) * 0.1
    const nblx = ((currentPlane.iverts[4] + Math.sin(Store.Mouse.nX - 0.4) * 80) - currentPlane.verts[4]) * 0.1
    const nbly = ((currentPlane.iverts[5] + Math.cos(Store.Mouse.nY - 0.6) * 20) - currentPlane.verts[5]) * 0.1
    const nbrx = ((currentPlane.iverts[6] + Math.sin(Store.Mouse.nX + 0.4) * 80) - currentPlane.verts[6]) * 0.1
    const nbry = ((currentPlane.iverts[7] + Math.sin(Store.Mouse.nY - 0.6) * 20) - currentPlane.verts[7]) * 0.1
    currentPlane.verts[0] += ntlx
    currentPlane.verts[1] += ntly
    currentPlane.verts[2] += ntrx
    currentPlane.verts[3] += ntry
    currentPlane.verts[4] += nblx
    currentPlane.verts[5] += nbly
    currentPlane.verts[6] += nbrx
    currentPlane.verts[7] += nbry

    // const newTopRightX = ((currentPlane.iverts[2] + Math.sin(Store.Mouse.nX) * 200) - currentPlane.verts[2]) * 0.02
    // currentPlane.verts[2] += newTopRightX

    // // Give some circular movement to vertices
    // for (let k = 0; k < this.planes.length; k++) {
    //   for (let i = 0; i < this.planes[k].mesh.vertices.length; i++) {
    //     this.planes[k].mesh.vertices[i] = this.planesVertices[k][i] + (Math.sin((i * 0.9) + this.delta)) / 6
    //   }
    // }
    this.renderer.render(this.stage)
  }
  onPreviewsLoaded() {
    this.addListeners()
  }
  mouseMove() {
    if (Store.Mouse.y > this.halfMargin && Store.Mouse.y < Store.Window.h - (this.halfMargin) && Store.Mouse.x > Store.Window.w / 2) { // Test if on right preview area
      Store.Parent.style.cursor = 'pointer'
      if (!this.onceRight) { // Test if isn't already playing
        Actions.mouseEnterPreview()
        let planeIdx = this.currentPlaneIdx
        // TweenMax.to(this.tweenValue, 0.2, {
        //   v: this.hoverPreview,
        //   onUpdate: () => {
        //     for (let i = 0; i < 8; i++) {
        //       let factor = 1
        //       if (i % 2 === 0) {
        //         factor = 0.2
        //       }
        //       this.planesVertices[planeIdx][i] = this.planesInitialVertices[i] + this.tweenValue.v * factor * this.animSigns[i]
        //     }
        //   },
        //   onComplete: () => {
        //     // Reset animation
        //     this.onceRight = true
        //   }
        // })
      }
    } else {
      Store.Parent.style.cursor = 'auto'
      if (this.onceRight && this.tweenValue.v === this.hoverPreview) { // This animation done & completed
        Actions.mouseLeavePreview()
        let planeIdx = this.currentPlaneIdx
        // Values to be resetted
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
        // TweenMax.to(resetValues, 0.2, {
        //   tlx: this.planesInitialVertices[0],
        //   tly: this.planesInitialVertices[1],
        //   trx: this.planesInitialVertices[2],
        //   try: this.planesInitialVertices[3],
        //   blx: this.planesInitialVertices[4],
        //   bly: this.planesInitialVertices[5],
        //   brx: this.planesInitialVertices[6],
        //   bry: this.planesInitialVertices[7],
        //   onUpdate: () => {
        //     for (let i = 0; i < 8; i++) {
        //       let key = this.verticesOrder[i]
        //       this.planesVertices[planeIdx][i] = resetValues[key]
        //     }
        //   },
        //   onComplete: () => {
        //     this.onceRight = false // Animation can be played again
        //     this.tweenValue.v = 0
        //   }
        // })
      }
    }
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
  }
  animateContainer() {
    const windowH = Store.Window.h
    const position = this.counter.props.index * windowH
    TweenMax.to(this.container.position, 0.6, {y: -position, ease: Expo.easeOut})
  }
  componentWillUnmount() {
    Store.off(Constants.PREVIEWS_LOADED, this.addListeners)
    Store.off(Constants.WINDOW_RESIZE, this.resize)
    dom.event.off(this.parent, 'mousemove', this.mouseMove)
    dom.event.off(this.parent, 'click', this.mouseClick)
    dom.event.off(this.parent, 'DOMMouseScroll', this.handleScroll)
    dom.event.off(this.parent, 'mousewheel', this.handleScroll)
  }
}

export default Preview
