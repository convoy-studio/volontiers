import BaseComponent from '../../pager/components/BaseComponent'
import Store from '../../store'
import Actions from '../../actions'
import Constants from '../../constants'
import Router from '../../services/router'
import Utils from '../../utils/Utils'
import dom from 'dom-hand'
import Hammer from 'hammerjs'
import counter from 'ccounter'
import slide from './Slide'
import slideshow from './Slideshow'
import {PagerActions} from '../../pager/Pager'

const activityHandler = Utils.countActivityHandler(650)
const hammer = new Hammer(dom.select('html'))

class Preview extends BaseComponent {
  constructor(props) {
    super(props)
    Store.on(Constants.UPDATE_PREVIEW_SLIDE, this.onUpdatePreviewSlide)
    Store.on(Constants.KEYBOARD_TRIGGERED, this.keyboardTriggered)
    Store.on(Constants.SCROLL_TRIGGERED, this.onScroll)
    Store.on(Constants.START_INTRO_ANIMATION, this.introAnimation)
    this.oldSlide = undefined
    this.currentSlide = undefined
    this.slides = []
    this.isEnteredPreview = false
    this.firstPreviewLoaded = false
    this.needIntroAnimation = false
    this.introAnimationFinished = false
    this.cursor = 'auto'
    this.pixelRatio = Math.min(Store.Detector.pixelRatio, 1.5)
    this.allPreviewsLoaded = Store.AllPreviewsLoaded
    this.projects = Store.getHomeProjects()
    this.counter = counter(this.projects.length)
    this.loadingCounter = counter(this.projects.length)
  }
  render() {
    return (
      <div ref="preview" className="preview" onClick={this.goToProject}></div>
    )
  }
  componentDidMount() {
    this.parent = this.refs.preview
    this.container = new PIXI.Container()
    setTimeout(() => {Actions.addToCanvas(this.container)})
    const oldRoute = Router.getOldRoute()
    if (oldRoute !== undefined) {
      TweenMax.to(dom.select('#canvas-container'), 0.5, {backgroundColor: '#ececec', delay: 0.2 })
      TweenMax.to(dom.select('html'), 0.5, {backgroundColor: '#ececec', delay: 0.2 })
    }
    this.projects.forEach((project, i) => {
      this.slides.push(slide(project.slug, this.container, project.image, i, 'preview', { from: Constants.CENTER, to: Constants.CENTER } ))
    })
  }
  loadFirstSlide(done) {
    const currentSlide = this.getSlideById(Router.getNewRoute().target)
    this.slides[currentSlide.index].load(() => {
      this.slidesLoaded()
      done()
    })
    this.counter.set(currentSlide.index)
  }
  loadSlides(done) {
    const currentSlide = this.getSlideById(Router.getNewRoute().target)
    this.counter.set(currentSlide.index)
    this.firstPreviewLoaded = true
    this.projects.forEach((project, i) => {
      this.loadSlide(this.slides[i])
    })
    this.previewsLoadedCb = done
    this.needIntroAnimation = true
  }
  goToProject(e) {
    if (activityHandler.isReady === false) return
    activityHandler.count()
    const bounds = this.currentSlide.plane.mesh.getBounds()
    const boundsWidth = bounds.width + bounds.x
    const boundsHeight = bounds.height + bounds.y
    let posX = 0
    let posY = 0
    if (Store.Detector.isMobile) {
      posX = e.center.x * this.pixelRatio
      posY = e.center.y * this.pixelRatio
    } else {
      posX = Store.Mouse.x * this.pixelRatio
      posY = Store.Mouse.y * this.pixelRatio
    }
    if (posX > bounds.x - 50 && posY > bounds.y - 50) {
      if (this.cursor === 'down') {
        this.counter.inc()
        Router.setRoute(`/home/${this.slides[this.counter.props.index].id}`)
      } else {
        Router.setRoute(`/project/${this.slides[this.counter.props.index].id}`)
      }
    }
  }
  slidesLoaded() {
    const oldRoute = Router.getOldRoute()
    this.resize()
    this.updateCurrentSlide()
    if (this.needIntroAnimation) Actions.previewsLoaded()
    if (!this.needIntroAnimation) this.loadNextPreviousSlide()
    if (oldRoute && (oldRoute.type === Constants.PROJECT || oldRoute.type === Constants.ABOUT)) Utils.setDefaultPlanePositions(this.currentSlide.plane, Constants.LEFT)
    if (Store.Detector.isMobile) {
      hammer.on('tap', this.goToProject)
    }
    this.firstPreviewLoaded = true
  }
  loadNextPreviousSlide() {
    const slides = this.getNextPreviousSlide()
    this.loadSlide(slides.prev)
    this.loadSlide(slides.next)
  }
  completeLoader() {
    if (this.needIntroAnimation) {
      if (this.loadingCounter.props.index === 4) {
        this.slidesLoaded()
        this.previewsLoadedCb()
      }
      this.loadingCounter.inc()
    }
    this.resize()
  }
  loadSlide(s) {
    if (s.isLoaded) this.completeLoader()
    else s.load(this.completeLoader)
  }
  update() {
    if (this.currentSlide === undefined) return
    const nextNx = Math.max(Store.Mouse.nX - 0.4, 0) * 0.2
    this.mousePreviewActionHandler(nextNx)
    this.mouseMoveHandler()
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
  mouseMoveHandler(val) {
    if (this.currentSlide.plane === undefined || activityHandler.isReady === false) return
    const bounds = this.currentSlide.plane.mesh.getBounds()
    const boundsWidth = bounds.width + bounds.x
    const boundsHeight = bounds.height + bounds.y
    const boundsTop = boundsHeight * 0.7
    const posX = Store.Mouse.x * this.pixelRatio
    const posY = Store.Mouse.y * this.pixelRatio
    if (posX > bounds.x - 50 && posY > bounds.y - 50) {
      if (posY < boundsTop && this.cursor !== 'right') {
        this.cursor = 'right'
        dom.style(this.refs.preview, {
          'cursor': 'url(assets/images/arrow-right.svg), auto'
        })
      } else if (posY > boundsTop && !this.cursor !== 'down') {
        this.cursor = 'down'
        dom.style(this.refs.preview, {
          'cursor': 'url(assets/images/arrow-down.svg), auto'
        })
      } else {
        return
      }
    } else {
      this.cursor = 'auto'
      dom.style(this.refs.preview, {
        'cursor': 'url(assets/images/cursor.svg), auto'
      })
    }
  }
  onScroll(direction) {
    if (activityHandler.isReady === false) return
    activityHandler.count()
    switch (direction) {
    case -1:
      this.counter.dec()
      break
    case 1:
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
    if (this.firstPreviewLoaded) this.currentSlide.activate()
    this.animateContainer()
    setTimeout(() => { Actions.changePreview(this.counter.props.index) })
    if (this.firstPreviewLoaded && !this.needIntroAnimation) this.loadNextPreviousSlide()
  }
  animateContainer() {
    if (!this.introAnimationFinished && Router.getOldRoute() === undefined) return
    const windowH = Store.Window.h * this.pixelRatio
    const position = this.counter.props.index * windowH
    if (this.firstPreviewLoaded) TweenMax.to(this.container.position, 0.6, {y: -position, ease: Expo.easeOut})
    else this.container.position.y = -position
  }
  introAnimation() {
    const windowH = Store.Window.h
    const position = this.counter.props.index * windowH
    this.container.position.y = -this.projects.length * windowH * this.pixelRatio
    this.introAnimationFinished = true
    const tl = new TimelineMax({ onComplete: () => {
      tl.clear()
      this.introAnimationCompleted()
    }})
    tl.to(this.container.position, 2.5, {y: 0, force3D: true, ease: Expo.easeInOut}, 0)
    tl.to(this.container.position, 1, {y: -position, ease: Expo.easeInOut}, 2.3)
  }
  introAnimationCompleted() {
    setTimeout(Actions.introAnimationCompleted)
  }
  transitionIn() {
    if (!this.currentSlide) return
    const oldRoute = Router.getOldRoute()
    if (oldRoute && (oldRoute.type === Constants.PROJECT || oldRoute.type === Constants.ABOUT)) this.currentSlide.show({from: Constants.LEFT, to: Constants.CENTER})
    else this.currentSlide.activate()
  }
  transitionOut() {
    if (!this.currentSlide) return
    this.currentSlide.hide({from: Constants.CENTER, to: Constants.LEFT})
  }
  keyboardTriggered(key) {
    if (key === Constants.RIGHT || key === Constants.DOWN) this.onScroll(1)
    else if (key === Constants.LEFT || key === Constants.UP) this.onScroll(-1)
    else Router.setRoute(`/project/${this.slides[this.counter.props.index].id}`)
  }
  resize() {
    if (!this.slides || this.slides.length < 1) return
    const windowW = Store.Window.w * this.pixelRatio
    const windowH = Store.Window.h * this.pixelRatio
    this.slides.forEach((item, i) => {
      const resizeVars = item.resize()
      if (item.isLoaded) {
        item.mesh.position.x = (windowW >> 1) - (resizeVars.width >> 1)
        item.mesh.position.y = ((windowH >> 1) - (resizeVars.height >> 1)) + (i * windowH)
      }
    })
  }
  componentWillUnmount() {
    this.slides.forEach((item) => { item.clear() })
    Store.off(Constants.UPDATE_PREVIEW_SLIDE, this.onUpdatePreviewSlide)
    Store.off(Constants.KEYBOARD_TRIGGERED, this.keyboardTriggered)
    Store.off(Constants.SCROLL_TRIGGERED, this.onScroll)
    Store.off(Constants.START_INTRO_ANIMATION, this.introAnimation)
    dom.event.off(this.refs.preview, 'click', this.goToProject)
    hammer.off('tap', this.goToProject)
    setTimeout(() => {Actions.removeFromCanvas(this.container)})
    this.slides.length = 0
    this.slides = undefined
  }
}

export default Preview
