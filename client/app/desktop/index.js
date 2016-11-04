require('../style/app.scss')

import Store from '../../store'
import Data from '../../data'
import Router from '../../services/router'
import Actions from '../../actions'
import Preloader from '../../services/preloader'
import { initGlobalEvents } from '../../services/global-events'
import AppTemplate from './template'

class App {
  constructor() {
    this.onAssetsLoaded = this.onAssetsLoaded.bind(this)
  }
  init() {
    this.router = new Router()
    this.router.init()
    Store.Preloader = new Preloader()
    Store.Language = Store.getLang()
    initGlobalEvents()
    this.router.beginRouting()
    this.loadInitialAssets()
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
