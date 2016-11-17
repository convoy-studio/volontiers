require('../style/app.scss')

import Store from '../../store'
import Data from '../../data'
import Router from '../../services/router'
import Actions from '../../actions'
import Utils from '../../utils/Utils'
import Constants from '../../constants'
import Preloader from '../../services/preloader'
import { initGlobalEvents } from '../../services/global-events'
import AppTemplate from './template'
import dom from 'dom-hand'

class App {
  constructor() {
    this.onAssetsLoaded = this.onAssetsLoaded.bind(this)
    this.setup = this.setup.bind(this)
    this.introAnimationCompleted = this.introAnimationCompleted.bind(this)
    this.introAnimation = this.introAnimation.bind(this)
    this.removeLanding = this.removeLanding.bind(this)
    Store.on(Constants.PREVIEWS_LOADED, this.removeLanding)
    Store.on(Constants.START_INTRO_ANIMATION_COMPLETED, this.introAnimationCompleted)
    Store.on(Constants.START_INTRO_ANIMATION, this.introAnimation)
  }
  init() {
    this.landingEl = dom.select('.landing')
    this.logoAnimation()
  }
  setup() {
    this.router = new Router()
    this.router.init()
    Store.Preloader = new Preloader()
    Store.Language = Store.getLang()
    initGlobalEvents()
    this.router.beginRouting()
    this.loadInitialAssets()
    this.route = Router.getNewRoute()
  }
  loadInitialAssets() {
    const manifest = Store.pageAssetsToLoad()
    Store.Preloader.load(manifest, this.onAssetsLoaded)
  }
  logoAnimation() {
    const baselineEl = dom.select('.landing__baseline')
    const delayLetters = 0.5
    this.logoAnim = new TimelineMax({onComplete: this.setup})
    this.logoAnim.to(this.landingEl, 0.4, { opacity: 1, ease: Expo.easeInOut}, 0)
    this.logoAnim.from(this.landingEl, 0.8, { scale: 0.8, ease: Expo.easeInOut}, 0)
    this.logoAnim.fromTo(dom.select('.letter-v'), 1, { x: 0, rotation: 360, transformOrigin: '50% 50%' }, { x: -400, rotation: 0, ease: Expo.easeInOut}, delayLetters)
    this.logoAnim.fromTo(dom.select('.letter-o_1'), 1, { x: 0, rotation: 360, transformOrigin: '50% 50%' }, { x: -306, rotation: 0, ease: Expo.easeInOut}, delayLetters)
    this.logoAnim.fromTo(dom.select('.letter-l'), 1, { x: 0, rotation: -360, transformOrigin: '50% 50%' }, { x: -204, rotation: 0, ease: Expo.easeInOut}, delayLetters)
    this.logoAnim.fromTo(dom.select('.letter-o_2'), 1, { x: 0, rotation: 360, transformOrigin: '50% 50%' }, { x: -102, rotation: 0, ease: Expo.easeInOut}, delayLetters)
    this.logoAnim.fromTo(dom.select('.letter-t'), 1, { x: 0, rotation: 360, transformOrigin: '50% 50%' }, { x: 100, rotation: 0, ease: Expo.easeInOut}, delayLetters)
    this.logoAnim.fromTo(dom.select('.letter-i'), 1, { x: 0, rotation: -360, transformOrigin: '50% 50%' }, { x: 167, rotation: 0, ease: Expo.easeInOut}, delayLetters)
    this.logoAnim.fromTo(dom.select('.letter-e'), 1, { x: 0, rotation: 360, transformOrigin: '50% 50%' }, { x: 234, rotation: 0, ease: Expo.easeInOut}, delayLetters)
    this.logoAnim.fromTo(dom.select('.letter-r'), 1, { x: 0, rotation: -360, transformOrigin: '50% 50%' }, { x: 336, rotation: 0, ease: Expo.easeInOut}, delayLetters)
    this.logoAnim.fromTo(dom.select('.letter-s'), 1, { x: 0, rotation: 360, transformOrigin: '50% 50%' }, { x: 439, rotation: 0, ease: Expo.easeInOut}, delayLetters)
    this.logoAnim.from(baselineEl, 0.6, { opacity: 0, y: 10, transformOrigin: '50% 50%', ease: Expo.easeOut}, delayLetters + 0.8)
    this.logoAnim.timeScale(1.2)
  }
  introAnimation() {
    dom.classes.add(this.landingEl, 'behind')
  }
  introAnimationCompleted() {
    this.logoAnim.clear()
    Store.off(Constants.PREVIEWS_LOADED, this.removeLanding)
    Store.off(Constants.START_INTRO_ANIMATION_COMPLETED, this.introAnimationCompleted)
    Store.off(Constants.START_INTRO_ANIMATION, this.introAnimation)
    TweenMax.to(this.landingEl, 0.8, { opacity: 0, ease: Expo.easeOut, onComplete: () => {
      dom.tree.remove(this.landingEl)
    }})
  }
  removeLanding() {
    setTimeout(Actions.startIntroAnimation)
  }
  onAssetsLoaded() {
    ReactDOM.render(<AppTemplate />, document.getElementById('app-container')) // Render the app
    setTimeout(Actions.appStart) // Dispatch that the app is ready
  }
}

export default App
