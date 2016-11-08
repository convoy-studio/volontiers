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
import {PagerActions} from '../../pager/Pager'

class Preview extends BaseComponent {
  constructor(props) {
    super(props)
    this.onPreviewsLoaded = this.onPreviewsLoaded.bind(this)
    this.onUpdatePreviewSlide = this.onUpdatePreviewSlide.bind(this)
    Store.on(Constants.PREVIEWS_LOADED, this.onPreviewsLoaded)
    Store.on(Constants.UPDATE_PREVIEW_SLIDE, this.onUpdatePreviewSlide)
    this.oldSlide = undefined
    this.currentSlide = undefined
    this.slides = []
    this.isEnteredPreview = false
    this.firstPreviewLoaded = false
    this.projects = Store.getHomeProjects()
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
      this.slides.push(slide(project.slug, this.container, project.image, i, 'preview', { from: Constants.CENTER, to: Constants.CENTER } ))
    })
    this.loadFirstSlide()
  }
  loadFirstSlide() {
    const currentSlide = this.getSlideById(Router.getNewRoute().target)
    this.slides[currentSlide.index].load(this.onFirstSlideLoaded)
    this.counter.set(currentSlide.index)
  }
  onFirstSlideLoaded() {
    const oldRoute = Router.getOldRoute()
    this.resize()
    this.updateCurrentSlide()
    Actions.previewsLoaded()
    this.loadNextPreviousSlide()
    if (oldRoute && oldRoute.type === Constants.PROJECT) Utils.setDefaultPlanePositions(this.currentSlide.plane, Constants.LEFT)
    this.firstPreviewLoaded = true
  }
  loadNextPreviousSlide() {
    const slides = this.getNextPreviousSlide()
    this.loadSlide(slides.prev)
    this.loadSlide(slides.next)
  }
  completeLoader() {
    this.resize()
  }
  loadSlide(s) {
    if (s.isLoaded) this.completeLoader()
    else s.load(this.completeLoader)
  }
  addListeners() {
    inertia.addCallback(this.onScroll)
    dom.event.on(this.parent, 'DOMMouseScroll', this.handleScroll)
    dom.event.on(this.parent, 'mousewheel', this.handleScroll)
  }
  resize() {
    const windowW = Store.Window.w
    const windowH = Store.Window.h
    this.slides.forEach((item, i) => {
      const resizeVars = item.resize()
      if (item.isLoaded) {
        item.mesh.position.x = (windowW >> 1) - (resizeVars.width >> 1)
        item.mesh.position.y = ((windowH >> 1) - (resizeVars.height >> 1)) + (i * windowH)
      }
    })
  }
  update() {
    if (this.currentSlide === undefined) return
    const nextNx = Math.max(Store.Mouse.nX - 0.4, 0) * 0.2
    this.mousePreviewActionHandler(nextNx)
    this.currentSlide.animate()
  }
  onUpdatePreviewSlide(id) {
    if (!this.firstPreviewLoaded) return
    for (let i = 0; i < this.slides.length; i++) {
      const s = this.slides[i]
      if (s.id === id) {
        this.counter.set(i)
        this.updateCurrentSlide()
        break
      }
    }
    PagerActions.pageTransitionDidFinish()
  }
  getSlideById(id) {
    let currentSlide = undefined
    for (let i = 0; i < this.slides.length; i++) {
      const s = this.slides[i]
      if (s.id === id) {
        currentSlide = s
        break
      }
    }
    return currentSlide
  }
  getNextPreviousSlide() {
    return {
      prev: this.slides[this.counter.props.prev],
      next: this.slides[this.counter.props.next]
    }
  }
  mousePreviewActionHandler(val) {
    if (val > 0) {
      if (this.isEnteredPreview) return // return is it's already entered, so avoid to send multiple actions
      Actions.mouseEnterPreview()
      this.isEnteredPreview = true
    } else {
      if (!this.isEnteredPreview) return // return is it's already not entered, so avoid to send multiple actions
      Actions.mouseLeavePreview()
      this.isEnteredPreview = false
    }
  }
  onPreviewsLoaded() {
    this.addListeners()
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
    Router.setRoute(`/home/${this.slides[this.counter.props.index].id}`)
  }
  updateCurrentSlide() {
    this.oldSlide = this.currentSlide
    this.currentSlide = this.slides[this.counter.props.index]
    if (this.oldSlide) this.oldSlide.deactivate()
    this.currentSlide.activate()
    this.animateContainer()
    setTimeout(() => { Actions.changePreview(this.counter.props.index) })
    if (this.firstPreviewLoaded) this.loadNextPreviousSlide()
  }
  animateContainer() {
    const windowH = Store.Window.h
    const position = this.counter.props.index * windowH
    if (this.firstPreviewLoaded) TweenMax.to(this.container.position, 0.6, {y: -position, ease: Expo.easeOut})
    else this.container.position.y = -position
  }
  transitionIn() {
    const oldRoute = Router.getOldRoute()
    if (oldRoute && oldRoute.type === Constants.PROJECT) {
      this.currentSlide.show({from: Constants.LEFT, to: Constants.CENTER})
    }
  }
  transitionOut() {
    this.currentSlide.hide({from: Constants.CENTER, to: Constants.LEFT})
  }
  componentWillUnmount() {
    this.slides.forEach((item) => { item.clear() })
    Store.off(Constants.PREVIEWS_LOADED, this.onPreviewsLoaded)
    Store.off(Constants.UPDATE_PREVIEW_SLIDE, this.onUpdatePreviewSlide)
    dom.event.off(this.parent, 'DOMMouseScroll', this.handleScroll)
    dom.event.off(this.parent, 'mousewheel', this.handleScroll)
    setTimeout(() => {Actions.removeFromCanvas(this.container)})
    this.slides.length = 0
    this.slides = undefined
  }
}

export default Preview
