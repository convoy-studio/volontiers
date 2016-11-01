import BaseComponent from '../../pager/components/BaseComponent'
import Store from '../../store'
import Actions from '../../actions'
import Constants from '../../constants'
import Router from '../../services/router'
import Utils from '../../utils/Utils'
import dom from 'dom-hand'
import inertia from 'wheel-inertia'
import counter from 'ccounter'
import slide from './Slide'
import slideshow from './Slideshow'

class Preview extends BaseComponent {
  constructor(props) {
    super(props)
    Store.on(Constants.PREVIEWS_LOADED, this.onPreviewsLoaded)
    this.delta = 0 // Used for update movement animation
    this.halfMargin = 80
    this.margin = 180
    this.currentSlide = undefined
    this.slides = [] // All slides array
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
    this.parent = this.refs.preview
    this.container = new PIXI.Container()
    setTimeout(() => {Actions.addToCanvas(this.container)})
    this.projects.forEach((project, i) => {
      this.slides.push(slide(this.container, project, i))
    })
    this.loadPreview()
  }
  loadPreview() {
    // TODO: Replace this.projects.length by desired number of projects to show on home page
    this.slides[this.previewLoadCounter].load(this.completeLoader)
  }
  completeLoader() {
    this.resize()
    if (!this.firstPreviewLoaded) {
      this.firstPreviewLoaded = true
      this.updateCurrentSlide()
      Actions.previewsLoaded()
    }
    this.previewLoadCounter++
    if (this.previewLoadCounter < this.projects.length) {
      this.slides[this.previewLoadCounter].load(this.completeLoader)
    }
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
    this.slides.forEach((item, i) => { item.resize(i) })
  }
  update() {
    if (this.currentSlide === undefined) return
    const nextNx = Math.max(Store.Mouse.nX - 0.4, 0) * 0.2
    this.mousePreviewActionHandler(nextNx)
    this.currentSlide.animate()
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
    if (this.isProject) return
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
    this.updateCurrentSlide()
  }
  updateCurrentSlide() {
    this.currentSlide = this.slides[this.counter.props.index]
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
    dom.event.off(this.parent, 'click', this.mouseClick)
    dom.event.off(this.parent, 'DOMMouseScroll', this.handleScroll)
    dom.event.off(this.parent, 'mousewheel', this.handleScroll)
    setTimeout(() => {Actions.removeFromCanvas(this.container)})
  }
}

export default Preview
