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
    this.onPreviewsLoaded = this.onPreviewsLoaded.bind(this)
    this.nextSlide = this.nextSlide.bind(this)
    this.previousSlide = this.previousSlide.bind(this)
    Store.on(Constants.PREVIEWS_LOADED, this.onPreviewsLoaded)
    Store.on(Constants.NEXT_SLIDE, this.nextSlide)
    Store.on(Constants.PREVIOUS_SLIDE, this.previousSlide)
    this.delta = 0 // Used for update movement animation
    this.halfMargin = 80
    this.margin = 180
    this.oldPreviewSlide = undefined
    this.currentPreviewSlide = undefined
    this.oldSlideshowSlide = undefined
    this.currentSlideshowSlide = undefined
    this.isRendering = false
    this.slides = [] // All slides array
    this.isEnteredPreview = false
    this.firstPreviewLoaded = false
    this.isProject = false
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
    this.slideshowContainer = new PIXI.Container()
    this.slideshow = slideshow(this.slideshowContainer)
    setTimeout(() => {Actions.addToCanvas(this.slideshowContainer)})
    setTimeout(() => {Actions.addToCanvas(this.container)})
    this.projects.forEach((project, i) => {
      this.slides.push(slide(this.container, project.image, i))
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
    this.slides.forEach((item, i) => {
      const resizeVars = item.resize()
      if (item.isLoaded) {
        item.mesh.position.x = (windowW >> 1) - (resizeVars.width >> 1)
        item.mesh.position.y = ((windowH >> 1) - (resizeVars.height >> 1)) + (i * windowH)
      }
    })
  }
  update() {
    if (!this.isRendering) return
    if (this.currentPreviewSlide === undefined) return
    const nextNx = Math.max(Store.Mouse.nX - 0.4, 0) * 0.2
    this.mousePreviewActionHandler(nextNx)
    const route = Router.getNewRoute()
    if (route.type === Constants.PROJECT) {
      if (this.oldSlideshowSlide) this.oldSlideshowSlide.animate()
      this.currentSlideshowSlide.animate()
    } else {
      this.currentPreviewSlide.animate()
    }
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
    this.oldPreviewSlide = this.currentPreviewSlide
    this.currentPreviewSlide = this.currentSlideshowSlide = this.slides[this.counter.props.index]
    if (this.oldPreviewSlide) this.oldPreviewSlide.deactivate()
    this.currentPreviewSlide.activate()
    this.animateContainer()
    Actions.changePreview(this.counter.props.index)
  }
  animateContainer() {
    const windowH = Store.Window.h
    const position = this.counter.props.index * windowH
    TweenMax.to(this.container.position, 0.6, {y: -position, ease: Expo.easeOut})
  }
  openProject() {
    this.isRendering = false
    this.isProject = true
    this.slideshow.updateSlides(() => {
      this.isRendering = true
    })
  }
  closeProject() {
    this.isProject = false
  }
  nextSlide() {
    this.slideshow.next()
    // update slideshow state if it's in the end of the slides
    if (this.slideshow.lastProject) setTimeout(() => {Actions.setSlideshowState(Constants.SLIDESHOW.END)})
    else setTimeout(() => {Actions.setSlideshowState(Constants.SLIDESHOW.MIDDLE)})
    const index = this.slideshow.counter.props.index
    if (index === 1) {
      this.oldSlideshowSlide = this.slides[this.counter.props.index]
      this.currentSlideshowSlide = this.slideshow.slides[this.slideshow.counter.props.prev]
    } else {
      this.oldSlideshowSlide = this.slideshow.slides[this.slideshow.counter.props.prev - 1]
      this.currentSlideshowSlide = this.slideshow.slides[this.slideshow.counter.props.prev]
    }
    this.oldSlideshowSlide.hide({from: Constants.CENTER, to: Constants.LEFT})
    this.currentSlideshowSlide.show({from: Constants.RIGHT, to: Constants.CENTER})
  }
  previousSlide() {
    this.slideshow.previous()
    // update slideshow state if it's in the begin of the slides
    if (this.slideshow.counter.props.index === 0) setTimeout(() => {Actions.setSlideshowState(Constants.SLIDESHOW.BEGIN)})
    else setTimeout(() => {Actions.setSlideshowState(Constants.SLIDESHOW.MIDDLE)})
    const index = this.slideshow.counter.props.index
    if (index === 0) {
      this.oldSlideshowSlide = this.slideshow.slides[this.slideshow.counter.props.index]
      this.currentSlideshowSlide = this.slides[this.counter.props.index]
    } else {
      this.oldSlideshowSlide = this.slideshow.slides[this.slideshow.counter.props.index]
      this.currentSlideshowSlide = this.slideshow.slides[this.slideshow.counter.props.prev]
    }
    this.oldSlideshowSlide.hide({from: Constants.CENTER, to: Constants.RIGHT})
    this.currentSlideshowSlide.show({from: Constants.LEFT, to: Constants.CENTER})
  }
  componentWillUnmount() {
    Store.off(Constants.PREVIEWS_LOADED, this.onPreviewsLoaded)
    Store.off(Constants.NEXT_SLIDE, this.nextSlide)
    Store.off(Constants.PREVIOUS_SLIDE, this.previousSlide)
    dom.event.off(this.parent, 'click', this.mouseClick)
    dom.event.off(this.parent, 'DOMMouseScroll', this.handleScroll)
    dom.event.off(this.parent, 'mousewheel', this.handleScroll)
    setTimeout(() => {Actions.removeFromCanvas(this.container)})
    setTimeout(() => {Actions.removeFromCanvas(this.slideshowContainer)})
  }
}

export default Preview
