import BaseComponent from '../../pager/components/BaseComponent'
import Store from '../../store'
import Actions from '../../actions'
import Constants from '../../constants'
import Router from '../../services/router'
import dom from 'dom-hand'
import MainTitle from './MainTitle'
import {PagerStore, PagerActions, PagerConstants} from '../../pager/Pager'

const NEXT_IMAGE = 'NEXT_IMAGE'
const PREVIOUS_IMAGE = 'PREVIOUS_IMAGE'
const BACK = 'BACK'
const NEXT_PROJECT = 'NEXT_PROJECT'

class NextPreviousBtns extends BaseComponent {
  constructor(props) {
    super(props)
    this.onPreviousClicked = this.onPreviousClicked.bind(this)
    this.onNextClicked = this.onNextClicked.bind(this)
    this.slideshowStateChanged = this.slideshowStateChanged.bind(this)
    this.keyboardTriggered = this.keyboardTriggered.bind(this)
    this.scrollTriggered = this.scrollTriggered.bind(this)
    this.activateVideoButton = this.activateVideoButton.bind(this)
    this.desactivateVideoButton = this.desactivateVideoButton.bind(this)
    this.onVideoClick = this.onVideoClick.bind(this)
    this.changeIconVideo = this.changeIconVideo.bind(this)
    this.onTransitionInCompleted = this.onTransitionInCompleted.bind(this)
    this.isActive = false
    this.isVideoPlaying = true
    this.ready = false
    this.currentProject = Store.getCurrentProject()
    this.content = Store.getContent('project')
    this.isMobile = Store.Detector.isMobile
    this.margin = this.isMobile === true ? Constants.MOBILE_MARGIN : Constants.GLOBAL_MARGIN
    this.state = {
      videoClass: 'playing'
    }
  }
  componentWillMount() {
    Store.on(Constants.SLIDESHOW_STATE_CHANGED, this.slideshowStateChanged)
    if (!this.isMobile) {
      Store.on(Constants.KEYBOARD_TRIGGERED, this.keyboardTriggered)
      Store.on(Constants.SCROLL_TRIGGERED, this.scrollTriggered)
      PagerStore.on(PagerConstants.PAGE_TRANSITION_DID_FINISH, this.onTransitionInCompleted)
    }
  }
  render() {
    return (
      <div className='next-previous-container'>
        <MainTitle ref='previousBtn' rotation='-90deg' title={this.content.previousImg} eventId={PREVIOUS_IMAGE} onClick={this.onPreviousClicked} className='link previous' hasMouseEnterLeave={false}></MainTitle>
        <div ref='videoBtn' className={`video-btn ${this.state.videoClass}`} onClick={this.onVideoClick}></div>
        <MainTitle ref='nextBtn' rotation='90deg' title={this.content.nextImg} eventId={NEXT_IMAGE} onClick={this.onNextClicked} className='link next' hasMouseEnterLeave={false}></MainTitle>
      </div>
    )
  }
  componentDidMount() {
    setTimeout(() => {
      this.resize
      if (this.isMobile) {
        this.refs.previousBtn.show()
        this.refs.nextBtn.show()
      } else {
        Store.on(Constants.TOGGLE_ICON_VIDEO, this.changeIconVideo)
      }
      Store.on(Constants.SLIDE_VIDEO_ENTER, this.activateVideoButton)
      Store.on(Constants.SLIDE_VIDEO_LEAVE, this.desactivateVideoButton)
    }, 300)
  }
  onTransitionInCompleted() {
    this.ready = true
  }
  activateVideoButton() {
    dom.style(this.refs.videoBtn, {
      'pointer-events': 'auto'
    })
    dom.classes.add(this.refs.videoBtn, 'playing')
  }
  desactivateVideoButton() {
    dom.style(this.refs.videoBtn, {
      'pointer-events': 'none'
    })
    dom.classes.remove(this.refs.videoBtn, 'playing')
  }
  changeIconVideo() {
    let videoClass = ''
    if (this.isVideoPlaying) {
      this.isVideoPlaying = false
    } else {
      videoClass = 'playing'
      this.isVideoPlaying = true
    }
    const state = {
      videoClass: videoClass
    }
    this.setState(state)
  }
  onVideoClick() {
    if (!this.ready) return
    Actions.togglePlayVideo()
  }
  goBack() {
    const oldRoute = Router.getOldRoute()
    const currentRoute = Router.getNewRoute()
    if (oldRoute !== undefined && oldRoute.type === Constants.PROJECT) {
      Router.setRoute(`/project/${oldRoute.target}`)
    } else {
      Router.setRoute(`/home/${currentRoute.target}`)
    }
  }
  goNext() {
    const next = Store.nextProject()
    Router.setRoute(`/project/${next.slug}`)
  }
  onPreviousClicked(e) {
    switch (e) {
    case PREVIOUS_IMAGE:
      Actions.previousSlide()
      break
    case BACK:
      this.goBack()
      break
    default:
    }
  }
  onNextClicked(e) {
    switch (e) {
    case NEXT_IMAGE:
      Actions.nextSlide()
      break
    case NEXT_PROJECT:
      this.goNext()
      break
    default:
    }
  }
  show(side) {
    if (this.isMobile) {
      if (!this.refs.previousBtn.isVisible) this.refs.previousBtn.show()
      if (!this.refs.nextBtn.isVisible) this.refs.nextBtn.show()
    }
    if (!this.isActive) return
    switch (side) {
    case Constants.LEFT:
      if (!this.refs.previousBtn.isVisible) this.refs.previousBtn.show()
      break
    case Constants.RIGHT:
      if (!this.refs.nextBtn.isVisible) this.refs.nextBtn.show()
      break
    default:
    }
  }
  hide(side, type) {
    if (type && type === Constants.MOBILE) {
      if (this.refs.previousBtn.isVisible) this.refs.previousBtn.hide()
      if (this.refs.nextBtn.isVisible) this.refs.nextBtn.hide()
    }
    if (!this.isActive || this.isMobile) return
    if (side) {
      switch (side) {
      case Constants.LEFT:
        if (this.refs.previousBtn.isVisible) this.refs.previousBtn.hide()
        break
      case Constants.RIGHT:
        if (this.refs.nextBtn.isVisible) this.refs.nextBtn.hide()
        break
      default:
      }
    } else {
      if (this.refs.previousBtn.isVisible) this.refs.previousBtn.hide()
      if (this.refs.nextBtn.isVisible) this.refs.nextBtn.hide()
    }
  }
  slideshowStateChanged(state) {
    if (state === Constants.SLIDESHOW.BEGIN) {
      this.refs.previousBtn.updateState({
        title: this.content.back,
        eventId: BACK
      })
    } else if (state === Constants.SLIDESHOW.END) {
      if (this.currentProject.assets.length <= 1) {
        this.refs.previousBtn.updateState({
          title: this.content.back,
          eventId: BACK
        })
      }
      dom.classes.add(this.refs.nextBtn.refs.parent, 'last')
      this.refs.nextBtn.updateState({
        title: this.content.discover,
        eventId: NEXT_PROJECT
      })
    } else {
      if (dom.classes.has(this.refs.nextBtn.refs.parent, 'last')) dom.classes.remove(this.refs.nextBtn.refs.parent, 'last')
      this.refs.previousBtn.updateState({
        title: this.content.previousImg,
        eventId: PREVIOUS_IMAGE
      })
      this.refs.nextBtn.updateState({
        title: this.content.nextImg,
        eventId: NEXT_IMAGE
      })
    }
    this.resize()
  }
  keyboardTriggered(key) {
    if ((key === Constants.LEFT) && this.currentState === Constants.SLIDESHOW.BEGIN) this.goBack()
    else if ((key === Constants.RIGHT) && this.currentState === Constants.SLIDESHOW.END) this.goNext()
  }
  scrollTriggered(direction) {
    if (Store.State === Constants.STATE.PROJECTS) return
    if (direction === -1 && this.currentState === Constants.SLIDESHOW.BEGIN) this.goBack()
    else if (direction === 1 && this.currentState === Constants.SLIDESHOW.END) this.goNext()
    else {
      switch (direction) {
      case -1:
        setTimeout(Actions.previousSlide)
        break
      case 1:
        setTimeout(Actions.nextSlide)
        break
      default:
        setTimeout(Actions.nextSlide)
      }
    }
  }
  componentWillUnmount() {
    Store.off(Constants.SLIDESHOW_STATE_CHANGED, this.slideshowStateChanged)
    if (!this.isMobile) {
      Store.off(Constants.KEYBOARD_TRIGGERED, this.keyboardTriggered)
      Store.off(Constants.SCROLL_TRIGGERED, this.scrollTriggered)
      Store.off(Constants.TOGGLE_ICON_VIDEO, this.changeIconVideo)
    }
    Store.off(Constants.SLIDE_VIDEO_ENTER, this.activateVideoButton)
    Store.off(Constants.SLIDE_VIDEO_LEAVE, this.desactivateVideoButton)
  }
  resize() {
    const windowW = Store.Window.w
    const windowH = Store.Window.h
    this.refs.previousBtn.refs.parent.style.top = (windowH >> 1) - (this.refs.previousBtn.size[0] >> 1) + 'px'
    this.refs.previousBtn.refs.parent.style.left = this.margin + this.refs.previousBtn.size[1] + 'px'
    this.refs.nextBtn.refs.parent.style.top = (windowH >> 1) - (this.refs.nextBtn.size[0] >> 1) + 'px'
    this.refs.nextBtn.refs.parent.style.left = windowW - this.margin + 'px'
  }
}

export default NextPreviousBtns
