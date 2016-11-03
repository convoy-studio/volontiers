import BasePager from '../pager/components/BasePager'
import Constants from '../constants'
import Actions from '../actions'
import {PagerActions} from '../pager/Pager'
import Store from '../store'
import Router from '../services/router'
import Home from './pages/Home'
import About from './pages/About'
import Project from './pages/Project'

export default class PagesContainer extends BasePager {
  constructor() {
    super()
    this.didPageChange = this.didPageChange.bind(this)
    this.pageAssetsLoaded = this.pageAssetsLoaded.bind(this)
    this.firstTimeLaunch = true
  }
  componentWillMount() {
    Store.on(Constants.ROUTE_CHANGED, this.didPageChange)
    Store.on(Constants.PAGE_ASSETS_LOADED, this.pageAssetsLoaded)
    super.componentWillMount()
  }
  componentWillUnmount() {
    Store.off(Constants.ROUTE_CHANGED, this.didPageChange)
    Store.off(Constants.PAGE_ASSETS_LOADED, this.pageAssetsLoaded)
    super.componentWillUnmount()
  }
  didPageChange() {
    const oldRoute = Router.getOldRoute()
    const newRoute = Router.getNewRoute()
    this.templateSelection(newRoute)
    if (this.firstTimeLaunch) {
      setTimeout(Actions.appStart)
      this.firstTimeLaunch = false
    }
  }
  templateSelection(newRoute) {
    let type = undefined
    switch (newRoute.type) {
    	case Constants.HOME:
      type = Home
      break
    	case Constants.ABOUT:
      type = About
      break
    	case Constants.PROJECT:
      type = Home
      break
    	default:
      type = Home
    }
    this.components['old-component'] = this.components['new-component']
    if (this.components['new-component'] === undefined) {
      this.setupNewComponent(newRoute, type) // create one if is undefined
    } else {
      if (this.components['new-component'].props.hash.type !== this.components['old-component'].props.hash.type) { // check if we was on a same type components, now and before
        this.setupNewComponent(newRoute, type)
      }
    }
    if (newRoute.type === Constants.PROJECT) {
      setTimeout(Actions.openProject) // if is Project send an action so to update the slideshow
    }
  }
  pageAssetsLoaded() {
    const newRoute = Router.getNewRoute()
    this.templateSelection(newRoute)
    super.pageAssetsLoaded()
  }
  update() {
    if (this.components['new-component'] !== undefined) this.components['new-component'].update()
  }
  resize() {
    if (this.components['new-component'] !== undefined) this.components['new-component'].resize()
  }
}
