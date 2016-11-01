import BaseComponent from '../pager/components/BaseComponent'
import Store from '../store'
import Constants from '../constants'

export default class CanvasContainer extends BaseComponent {
  constructor(props) {
    super(props)
    this.addChild = this.addChild.bind(this)
    this.removeChild = this.removeChild.bind(this)
  }
  componentWillMount() {
    Store.on(Constants.ADD_TO_CANVAS, this.addChild)
    Store.on(Constants.REMOVE_FROM_CANVAS, this.removeChild)
  }
  render() {
    return (
      <div id='canvas-container' ref='canvas-container'></div>
    )
  }
  componentDidMount() {
    this.el = this.refs['canvas-container']
    this.renderer = new PIXI.WebGLRenderer(1, 1, {antialias: true, roundPixels: true})
    this.renderer.backgroundColor = 0xffffff
    this.el.appendChild(this.renderer.view)
    this.stage = new PIXI.Container()
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
    this.renderer.resize(windowW, windowH)
  }
}
