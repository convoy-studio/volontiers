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
  }
  logoAnimation() {
    const windowW = window.innerWidth
    const windowH = window.innerHeight
    // const tl = new TimelineMax()
    // TweenMax.fromTo(dom.select('.landing__logo svg #v'), 0.3, { x: windowW / 2 - (dom.size(dom.select('.landing__logo svg #v'))[0] / 2) - dom.select('.landing__logo svg #v').getBoundingClientRect().left }, {x: 0, ease: Circ.easeOut, delay: 0.3 } )
    // TweenMax.to(dom.select('.landing__logo svg #v'), 0.3, { x: windowW / 2, ease: Circ.easeOut, delay: 0.3 } )
    // TweenMax.to(dom.select('.landing__logo svg #o'), 0.3, { left: (windowW / 2) - 100, ease: Circ.easeOut, delay: 0.3 } )
    // TweenMax.set(dom.select('.landing__logo svg #o'), { x:  })
  }
  removeLanding() {
    dom.classes.add(dom.select('.landing'), 'hide')
  }
  loadInitialAssets() {
    const manifest = Store.pageAssetsToLoad()
    Store.Preloader.load(manifest, this.onAssetsLoaded)
  }
  onAssetsLoaded() {
    ReactDOM.render(<AppTemplate />, document.getElementById('app-container')) // Render the app
    setTimeout(Actions.appStart) // Dispatch that the app is ready
  }
}

export default App
