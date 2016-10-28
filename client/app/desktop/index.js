require('../style/app.scss')

import Store from '../../store'
import Data from '../../data'
import Router from '../../services/router'
import Preloader from '../../services/preloader'
import { initGlobalEvents } from '../../services/global-events'
import AppTemplate from './template'

class App {
  constructor() {
  }
  init() {
    this.setupRoutes()
    this.router = new Router()
    this.router.init()
    Store.Preloader = new Preloader()
    Store.Language = Store.getLang()
    initGlobalEvents()

    ReactDOM.render(
			<AppTemplate />,
			document.getElementById('app-container')
		)

    this.router.beginRouting()
  }
  /**
   * [setupRoutes Add generated routes to the store]
   */
  setupRoutes() {
    let k = 0
    for (k in Data.projects) {
      if ({}.hasOwnProperty.call(Data.projects, k)) {
        Store.ProjectsSlugs.push(k)
        Data.routing[`/project/${k}`] = {
          name: Data.projects[k].name,
          assets: Data.projects[k].assets
        }
      }
    }
  }
}


export default App
