import BaseComponent from '../../pager/components/BaseComponent'
import Store from '../../store'
import Actions from '../../actions'
import Constants from '../../constants'
import Router from '../../services/router'
import Utils from '../../utils/Utils'
import NextPreviousBtns from './NextPreviousBtns'
import Vid from './Vid'
import counter from 'ccounter'
import uuid from 'uuid/v4'

const activityHandler = Utils.countActivityHandler(650)

class Slideshow extends BaseComponent {
  constructor(props) {
    super(props)
    Store.on(Constants.KEYBOARD_TRIGGERED, this.keyboardTriggered)
    Store.on(Constants.SCROLL_TRIGGERED, this.onScroll)
    Store.on(Constants.FIRST_OVERVIEW_HOVERED, this.hideCurrentSlide)
    this.currentSlide = undefined
    this.firstPreviewLoaded = false
    this.needIntroAnimation = false
    this.introAnimationFinished = false
    this.counter = counter(this.props.data.length, 0, false)
    this.lastIndex = 0
    this.dir = 1
    this.scaleEase = CustomEase.create('custom', 'M0,0,C1,0.01,0.14,1.01,1,1')
    this.transitionEase = CustomEase.create('custom', 'M0,0,C1,0.13,0.7,0.89,1,1')
    this.isAnimating = false
    this.assets = this.props.data.map(asset => {
      return {
        id: uuid(),
        type: Utils.getFileExtension(asset),
        path: `assets/images/${this.props.slug}/${asset}`
      }
    })
  }
  render() {
    return (
      <div className="slideshow">
        <NextPreviousBtns
          ref='next-previous-btns'
          length={this.assets.length}
          next={this.onScroll.bind(null, 1)}
          previous={this.onScroll.bind(null, -1)}
        />
        <div ref="container"
          className="slideshow__container"
          style={{
            height: '100vh',
            width: `${this.assets.length * 100}vw`,
            opacity: 0
          }}
        >
        {
          this.assets.map((asset) => {
            const media = asset.type === 'mp4' ?
            <Vid src={asset.path} ref={`slideshow-media-${asset.id}`} className="slideshow__video" />
            : <img src={asset.path} ref={`slideshow-media-${asset.id}`} />
            return <div className="slideshow__item" key={`slide-${asset.id}`}>
              <div className="slideshow__block" ref={`slide-${asset.id}`}>
                {media}
              </div>
            </div>
          })
        }
        </div>
      </div>
    )
  }
  componentDidMount() {
    setTimeout(Actions.setSlideshowState, 0, Constants.SLIDESHOW.BEGIN)
    this.assets.forEach(asset => {
      TweenMax.set(this.refs[`slide-${asset.id}`], { xPercent: -50, yPercent: -50, left: '50%', top: '50%' })
    })
  }
  onScroll(direction) {
    if (Store.ProjectInfoIsOpened || Store.State === Constants.STATE.ABOUT || !activityHandler.isReady || this.isAnimating) return
    activityHandler.count()
    this.lastIndex = this.counter.props.index
    switch (direction) {
    case -1:
      this.counter.dec()
      this.dir = 1
      break
    case 1:
      this.counter.inc()
      this.dir = -1
      break
    default:
      this.counter.inc()
      this.dir = -1
    }
    if (this.counter.props.index === this.lastIndex) return
    this.updateCurrentSlide()
  }
  updateCurrentSlide() {
    if (this.counter.props.index >= this.counter.props.total - 1) setTimeout(Actions.setSlideshowState, 0, Constants.SLIDESHOW.END)
    else if (this.counter.props.index === 0) setTimeout(Actions.setSlideshowState, 0, Constants.SLIDESHOW.BEGIN)
    else setTimeout(Actions.setSlideshowState, 0, Constants.SLIDESHOW.MIDDLE)
    this.animateContainer()
    this.props.onUpdate()
  }
  animateContainer() {
    const windowW = Store.Window.w
    const position = this.counter.props.index * windowW
    const oldSlide = this.assets[this.lastIndex]
    const currentSlide = this.assets[this.counter.props.index]

    const lastSlide = this.refs[`slide-${oldSlide.id}`]
    const newSlide = this.refs[`slide-${currentSlide.id}`]

    if (oldSlide.type === 'mp4') this.refs[`slideshow-media-${oldSlide.id}`].pause()

    this.isAnimating = true

    const tl = new TimelineMax({ onComplete: () => {
      tl.clear()
      TweenMax.set([lastSlide, newSlide], { x: 0, scale: 1, rotationY: 0 })
      this.isAnimating = false
      if (currentSlide.type === 'mp4') this.refs[`slideshow-media-${currentSlide.id}`].play()
    }})
    tl.to(lastSlide, 0.5, { x: windowW * 1.5 * this.dir, scaleX: 1.5, scaleY: 0.75, rotationY: 20 * this.dir, ease: this.transitionEase }, 0)
    tl.to(this.refs.container, 0.6, {x: -position, ease: Expo.easeOut}, 0.5)
    tl.from(newSlide, 0.5, { x: -windowW * 1.5 * this.dir, scaleX: 1.5, scaleY: 0.75, rotationY: -20 * this.dir, ease: this.transitionEase}, 0.3)
  }
  transitionIn() {
    const windowW = Store.Window.w
    const currentSlide = this.assets[0]
    const current = this.refs[`slide-${currentSlide.id}`]
    const oldRoute = Router.getOldRoute()
    let sign = -1, duration = 0.8
    if (oldRoute && (oldRoute.type === Constants.HOME || oldRoute.type === Constants.PROJECT)) {
      sign = 1
      duration = 0.4
    }
    TweenMax.set(this.refs.container, { opacity: 1 })
    TweenMax.set(current, { x: windowW * 1.5 * sign, scaleX: 1.5, scaleY: 0.75, rotationY: 20 * sign })
    TweenMax.to(current, duration, { x: 0, scale: 1, rotationY: 0, ease: this.transitionEase, onComplete: () => {
      this.refs['next-previous-btns'].isActive = true
      if (currentSlide.type === 'mp4') this.refs[`slideshow-media-${currentSlide.id}`].play()
    }})
  }
  transitionOut() {
    const newRoute = Router.getNewRoute()
    const windowW = Store.Window.w
    const windowH = Store.Window.h

    const currentSlide = this.assets[this.counter.props.index]
    const current = this.refs[`slide-${currentSlide.id}`]

    this.refs['next-previous-btns'].hide()
    this.refs['next-previous-btns'].isActive = false

    if (currentSlide.type === 'mp4') this.refs[`slideshow-media-${currentSlide.id}`].pause()

    if (newRoute.type === Constants.HOME) TweenMax.to(current, 0.5, { x: windowW * 3, scaleX: 1.5, scaleY: 0.75, rotationY: -20, ease: this.transitionEase })
    else TweenMax.to(current, 0.3, { y: -windowH * 5, scaleX: 0.8, scaleY: 10, rotationX: 5, skewY: Utils.rand(5, 10, 1) * Utils.randomSign(), ease: this.transitionEase})
    // TweenMax.to(current, 0.3, { y: -windowH * 5, scaleX: 0.8, scaleY: 10, rotationX: 5, skewY: Utils.rand(5, 10, 1) * Utils.randomSign(), ease: this.transitionEase})
  }
  keyboardTriggered(key) {
    if (key === Constants.RIGHT) this.onScroll(1)
    else if (key === Constants.LEFT) this.onScroll(-1)
  }
  onToggleProjectInfos() {
    const currentSlide = this.assets[this.counter.props.index]
    const current = this.refs[`slide-${currentSlide.id}`]
    const windowH = Store.Window.h
    if (Store.ProjectInfoIsOpened) {
      TweenMax.to(current, 0.3, { y: -windowH * 5, scaleX: 0.8, scaleY: 10, rotationX: 5, skewY: Utils.rand(5, 10, 1) * Utils.randomSign(), ease: this.transitionEase })
      this.refs['next-previous-btns'].hide()
      this.refs['next-previous-btns'].isActive = false
      if (currentSlide.type === 'mp4') this.refs[`slideshow-media-${currentSlide.id}`].pause()
    } else {
      TweenMax.to(current, 0.5, { y: 0, scale: 1, rotationX: 0, skewY: 0, ease: this.transitionEase })
      this.refs['next-previous-btns'].isActive = true
      if (currentSlide.type === 'mp4') this.refs[`slideshow-media-${currentSlide.id}`].play()
    }
  }
  hideCurrentSlide = () => {
    const currentSlide = this.assets[this.counter.props.index]
    const current = this.refs[`slide-${currentSlide.id}`]
    TweenMax.set(current, { opacity: 0 })
  }
  onProjectsOverviewOpen() {
    const currentSlide = this.assets[this.counter.props.index]
    const current = this.refs[`slide-${currentSlide.id}`]
    if (currentSlide.type === 'mp4') this.refs[`slideshow-media-${currentSlide.id}`].pause()
    TweenMax.to(current, 0.6, { scale: 0.8, ease: this.scaleEase })
    this.refs['next-previous-btns'].hide(undefined, this.device)
    this.refs['next-previous-btns'].isActive = false
  }
  onProjectsOverviewClose() {
    const currentSlide = this.assets[this.counter.props.index]
    const current = this.refs[`slide-${currentSlide.id}`]
    TweenMax.set(current, { opacity: 1 })
    TweenMax.to(current, 0.6, { scale: 1, ease: this.scaleEase, onComplete: () => {
      if (currentSlide.type === 'mp4') this.refs[`slideshow-media-${currentSlide.id}`].play()
    } })
    this.refs['next-previous-btns'].isActive = true
  }
  resize() {
    const windowW = Store.Window.w
    const position = this.counter.props.index * windowW
    TweenMax.set(this.refs.container, {x: -position})
    this.refs['next-previous-btns'].resize()
  }
  componentWillUnmount() {
    Store.off(Constants.KEYBOARD_TRIGGERED, this.keyboardTriggered)
    Store.off(Constants.SCROLL_TRIGGERED, this.onScroll)
    Store.off(Constants.FIRST_OVERVIEW_HOVERED, this.hideCurrentSlide)
  }
}

export default Slideshow
