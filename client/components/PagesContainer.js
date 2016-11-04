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
    this.showLoadState()
    const newRoute = Router.getNewRoute()
    const oldRoute = Router.getOldRoute()
    if (oldRoute === undefined) {
      this.templateSelection(newRoute)
      setTimeout(Actions.appStart)
    } else {
      setTimeout(Actions.loadPageAssets, 0)
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
      type = Project
      break
    	default:
      type = Home
    }
    this.setupNewComponent(newRoute, type)
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
