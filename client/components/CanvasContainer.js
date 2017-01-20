import BaseComponent from '../pager/components/BaseComponent'
import Store from '../store'
import Constants from '../constants'
import Router from '../services/router'
import dom from 'dom-hand'

export default class CanvasContainer extends BaseComponent {
  constructor(props) {
    super(props)
    this.addChild = this.addChild.bind(this)
    this.removeChild = this.removeChild.bind(this)
    this.testOrientation = this.testOrientation.bind(this)
    this.didPageChange = this.didPageChange.bind(this)
    this.route = Router.getNewRoute()
  }
  componentWillMount() {
    Store.on(Constants.ADD_TO_CANVAS, this.addChild)
    Store.on(Constants.REMOVE_FROM_CANVAS, this.removeChild)
    Store.on(Constants.WINDOW_RESIZE, this.testOrientation)
    Store.on(Constants.ROUTE_CHANGED, this.didPageChange)
  }
  render() {
    return (
      <div id='canvas-container' ref='canvas-container'></div>
    )
  }
  componentDidMount() {
    this.el = this.refs['canvas-container']
    this.pixelRatio = Math.min(Store.Detector.pixelRatio, 1.5)
    this.renderer = new PIXI.autoDetectRenderer(1, 1, {antialias: true, roundPixels: true, transparent: true, resolution: this.pixelRatio})
    this.el.appendChild(this.renderer.view)
    this.stage = new PIXI.Container()
  }
  didPageChange() {
    this.route = Router.getNewRoute()
    this.testOrientation()
  }
  testOrientation() {
    if (Store.Orientation === Constants.ORIENTATION.LANDSCAPE && Store.Detector.isMobile && Store.State !== Constants.STATE.ABOUT && this.route.type !== Constants.HOME) {
      this.refs['canvas-container'].style.zIndex = 999999
    } else {
      this.refs['canvas-container'].style.zIndex = 'initial'
    }
  }
  addChild(item) {
    this.stage.addChild(item.child)
  }
  removeChild(item) {
    this.stage.removeChild(item.child)
  }
  update() {
    this.renderer.render(this.stage)
  }
  resize() {
    const windowW = Store.Window.w
    const windowH = Store.Window.h
    this.renderer.resize(windowW * this.pixelRatio, windowH * this.pixelRatio)
    this.renderer.view.style.width = windowW + 'px'
    this.renderer.view.style.height = windowH + 'px'
  }
}
