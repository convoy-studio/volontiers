import BaseComponent from '../../pager/components/BaseComponent'
import Store from '../../store'
import Actions from '../../actions'
import Constants from '../../constants'
import Router from '../../services/router'
import Utils from '../../utils/Utils'
import dom from 'dom-hand'
import counter from 'ccounter'
import {PagerActions} from '../../pager/Pager'

const activityHandler = Utils.countActivityHandler(650)

class Preview extends BaseComponent {
  constructor(props) {
    super(props)
    Store.on(Constants.UPDATE_PREVIEW_SLIDE, this.onUpdatePreviewSlide)
    Store.on(Constants.KEYBOARD_TRIGGERED, this.keyboardTriggered)
    Store.on(Constants.SCROLL_TRIGGERED, this.onScroll)
    Store.on(Constants.START_INTRO_ANIMATION, this.introAnimation)
    this.currentSlide = undefined
    this.isEnteredPreview = false
    this.firstPreviewLoaded = false
    this.needIntroAnimation = false
    this.introAnimationFinished = false
    this.cursor = 'auto'
    this.projects = Store.getHomeProjects()
    this.counter = counter(this.projects.length)
    this.loadingCounter = counter(this.projects.length)
    this.boundsShift = 50
    this.dir = 1
    this.scaleEase = CustomEase.create('custom', 'M0,0,C1,0.01,0.14,1.01,1,1')
    this.transitionEase = CustomEase.create('custom', 'M0,0,C1,0.13,0.7,0.89,1,1')
  }
  render() {
    return (
      <div ref="preview" className="preview">
        <div ref="container" className="preview__container" style={{height: `${this.projects.length * 100}vh`, opacity: 0}}>
        {
          this.projects.map((project) => {
            return <div className="preview__cover" key={project.slug}>
              <div  className="preview__block" ref={`preview-${project.slug}`}>
                <img src={`assets/${project.image}`}/>
                <div className="preview__top" onClick={this.goToProject.bind(null, 'up')}></div>
                <div className="preview__bottom" onClick={this.goToProject.bind(null, 'down')}></div>
              </div>
            </div>
          })
        }
        </div>
      </div>
    )
  }
  setFirstSlide(done) {
    const currentSlide = this.getSlideById(Router.getNewRoute().target)
    this.counter.set(currentSlide.index)
    this.firstPreviewLoaded = true
    done()
  }
  setSlides(done) {
    const currentSlide = this.getSlideById(Router.getNewRoute().target)
    this.counter.set(currentSlide.index)
    this.firstPreviewLoaded = true
    this.needIntroAnimation = true
    this.previewsLoadedCb = done
  }
  goToProject = (dir) => {
    if (activityHandler.isReady === false || Store.State === Constants.STATE.ABOUT) return
    activityHandler.count()
    if (dir === 'down') {
      this.counter.inc()
      this.dir = 1
    } else {
      this.counter.dec()
      this.dir = -1
    }
    Router.setRoute(`/home/${this.projects[this.counter.props.index].slug}`)
  }
  onUpdatePreviewSlide(id) {
    if (!this.firstPreviewLoaded) return
    for (let i = 0; i < this.projects.length; i++) {
      const p = this.projects[i]
      if (p.slug === id) {
        this.counter.set(i)
        this.updateCurrentSlide()
        break
      }
    }
    PagerActions.pageTransitionDidFinish()
  }
  getSlideById(id) {
    let currentSlide = undefined
    for (let i = 0; i < this.projects.length; i++) {
      const p = this.projects[i]
      if (p.slug === id) {
        currentSlide = p
        break
      }
    }
    return currentSlide
  }
  onScroll(direction) {
    if (!activityHandler.isReady) return
    activityHandler.count()
    switch (direction) {
    case -1:
      this.counter.dec()
      this.dir = -1
      break
    case 1:
      this.counter.inc()
      this.dir = 1
      break
    default:
      this.counter.inc()
      this.dir = 1
    }
    Router.setRoute(`/home/${this.projects[this.counter.props.index].slug}`)
  }
  updateCurrentSlide() {
    this.currentSlide = this.projects[this.counter.props.index]
    this.animateContainer()
    setTimeout(() => { Actions.changePreview(this.counter.props.index) })
  }
  animateContainer() {
    if (!this.introAnimationFinished && Router.getOldRoute() === undefined) return
    const windowH = Store.Window.h
    const position = this.counter.props.index * windowH
    if (this.firstPreviewLoaded) TweenMax.to(this.refs.container, 0.6, {y: -position, ease: Expo.easeOut})
    else TweenMax.set(this.refs.container, { y: -position })
  }
  introAnimation() {
    const windowH = Store.Window.h
    const position = this.counter.props.index * windowH
    TweenMax.set(this.refs.container, { y: -this.projects.length * windowH })
    this.introAnimationFinished = true
    this.refs.container.style.opacity = 1
    const tl = new TimelineMax({ onComplete: () => {
      tl.clear()
      this.introAnimationCompleted()
      if (this.previewsLoadedCb) this.previewsLoadedCb()
    }})
    tl.set(this.refs.container, {opacity: 1}, 0)
    tl.to(this.refs.container, 2.5, {y: 0, force3D: true, ease: Expo.easeInOut}, 0)
    tl.to(this.refs.container, 1, {y: -position, ease: Expo.easeInOut}, 2.3)
  }
  introAnimationCompleted() {
    this.updateCurrentSlide()
    setTimeout(Actions.introAnimationCompleted)
  }
  transitionIn() {
    if (!this.currentSlide) return
    const oldRoute = Router.getOldRoute()
    if (oldRoute && oldRoute.type === Constants.PROJECT) {
      const windowW = Store.Window.w
      const current = this.refs[`preview-${this.currentSlide.slug}`]
      TweenMax.set(this.refs.container, { opacity: 1 })
      TweenMax.set(current, { x: -windowW * 2, scaleX: 1.5, rotateY: '10deg' })
      TweenMax.to(current, 0.8, { x: 0, scaleX: 1, rotateY: 0, ease: this.transitionEase })
    }
  }
  transitionOut() {
    if (!this.currentSlide) return
    const windowW = Store.Window.w
    const current = this.refs[`preview-${this.currentSlide.slug}`]
    TweenMax.to(current, 0.5, { x: -windowW * 3, scaleX: 1.5, rotateY: '-10deg', ease: this.transitionEase })
  }
  keyboardTriggered(key) {
    if (key === Constants.DOWN) this.onScroll(1)
    else if (key === Constants.UP) this.onScroll(-1)
  }
  onProjectsOverviewOpen() {
    const current = this.refs[`preview-${this.currentSlide.slug}`]
    const windowW = Store.Window.w
    TweenMax.to(current, 0.6, { scale: 0.8, ease: this.scaleEase, onComplete: () => {
      TweenMax.set(current, { opacity: 0, delay: 0.05 })
    } })
  }
  onProjectsOverviewClose() {
    const current = this.refs[`preview-${this.currentSlide.slug}`]
    const windowW = Store.Window.w
    TweenMax.set(current, { opacity: 1 })
    TweenMax.to(current, 0.6, { scale: 1, ease: this.scaleEase })
  }
  resize() {
  }
  componentWillUnmount() {
    Store.off(Constants.UPDATE_PREVIEW_SLIDE, this.onUpdatePreviewSlide)
    Store.off(Constants.KEYBOARD_TRIGGERED, this.keyboardTriggered)
    Store.off(Constants.SCROLL_TRIGGERED, this.onScroll)
    Store.off(Constants.START_INTRO_ANIMATION, this.introAnimation)
    dom.event.off(this.refs.preview, 'click', this.goToProject)
  }
}

export default Preview
