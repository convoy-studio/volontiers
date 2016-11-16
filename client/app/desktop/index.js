require('../style/app.scss')

import Store from '../../store'
import Data from '../../data'
import Router from '../../services/router'
import Actions from '../../actions'
import Constants from '../../constants'
import Preloader from '../../services/preloader'
import { initGlobalEvents } from '../../services/global-events'
import AppTemplate from './template'
import dom from 'dom-hand'

class App {
  constructor() {
    this.onAssetsLoaded = this.onAssetsLoaded.bind(this)
    Store.on(Constants.PREVIEWS_LOADED, this.removeLanding.bind(this))
    this.animationHasEnded = false
  }
  init() {
    this.router = new Router()
    this.router.init()
    Store.Preloader = new Preloader()
    Store.Language = Store.getLang()
    initGlobalEvents()
    this.router.beginRouting()
    this.loadInitialAssets()
    this.logoAnimation()
    this.route = Router.getNewRoute()
  }
  loadInitialAssets() {
    const manifest = Store.pageAssetsToLoad()
    Store.Preloader.load(manifest, this.onAssetsLoaded)
  }
  logoAnimation() {
    Store.off(Constants.PREVIEWS_LOADED, this.removeLanding)
    TweenMax.fromTo(dom.select('.letter-v'), 0.5, { x: 0, rotation: 360, transformOrigin: '50% 50%' }, { x: -400, rotation: 0, ease: Circ.easeOut, delay: 0.75 })
    TweenMax.fromTo(dom.select('.letter-o_1'), 0.5, { x: 0, rotation: 360, transformOrigin: '50% 50%' }, { x: -306, rotation: 0, ease: Circ.easeOut, delay: 0.75 })
    TweenMax.fromTo(dom.select('.letter-l'), 0.5, { x: 0, rotation: -360, transformOrigin: '50% 50%' }, { x: -204, rotation: 0, ease: Circ.easeOut, delay: 0.75 })
    TweenMax.fromTo(dom.select('.letter-o_2'), 0.5, { x: 0, rotation: 360, transformOrigin: '50% 50%' }, { x: -102, rotation: 0, ease: Circ.easeOut, delay: 0.75 })
    TweenMax.fromTo(dom.select('.letter-t'), 0.5, { x: 0, rotation: 360, transformOrigin: '50% 50%' }, { x: 100, rotation: 0, ease: Circ.easeOut, delay: 0.75 })
    TweenMax.fromTo(dom.select('.letter-i'), 0.5, { x: 0, rotation: -360, transformOrigin: '50% 50%' }, { x: 167, rotation: 0, ease: Circ.easeOut, delay: 0.75 })
    TweenMax.fromTo(dom.select('.letter-e'), 0.5, { x: 0, rotation: 360, transformOrigin: '50% 50%' }, { x: 234, rotation: 0, ease: Circ.easeOut, delay: 0.75 })
    TweenMax.fromTo(dom.select('.letter-r'), 0.5, { x: 0, rotation: -360, transformOrigin: '50% 50%' }, { x: 336, rotation: 0, ease: Circ.easeOut, delay: 0.75 })
    TweenMax.fromTo(dom.select('.letter-s'), 0.5, { x: 0, rotation: 360, transformOrigin: '50% 50%' }, { x: 439, rotation: 0, ease: Circ.easeOut, delay: 0.75 })
    TweenMax.to(dom.select('.landing__baseline'), 0.3, { opacity: 1, ease: Circ.easeOut, delay: 1.25, onComplete: () => {
      this.animationHasEnded = true
      if (this.route.type !== Constants.HOME) {
        const landing = dom.select('.landing')
        TweenMax.to(landing, 0.5, { opacity: 0, ease: Circ.easeOut, onComplete: () => {
          dom.classes.add(landing, 'behind')
        }})
      }
    } })
  }
  removeLanding() {
    if (this.animationHasEnded) {
      Actions.startIntroAnimation()
    } else {
      let interval = null
      interval = setInterval(() => {
        if (this.animationHasEnded) {
          Actions.startIntroAnimation()
          clearInterval(interval)
        }
      }, 100)
    }
  }
  onAssetsLoaded() {
    ReactDOM.render(<AppTemplate />, document.getElementById('app-container')) // Render the app
    setTimeout(Actions.appStart) // Dispatch that the app is ready
  }
}

export default App
