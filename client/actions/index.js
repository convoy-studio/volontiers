import Constants from '../constants'
import Dispatcher from '../dispatcher'
import Store from '../store'

function _proceedTransitionInAction(pageId) {
  Dispatcher.handleViewAction({
    actionType: Constants.PAGE_ASSETS_LOADED,
    item: pageId
  })
}
const Actions = {
  routeChanged: () => {
    Dispatcher.handleViewAction({
      actionType: Constants.ROUTE_CHANGED,
      item: undefined
    })
  },
  loadPageAssets: () => {
    const manifest = Store.pageAssetsToLoad()
    if (manifest.length < 1) {
      _proceedTransitionInAction()
    } else {
      Store.Preloader.load(manifest, ()=>{
        _proceedTransitionInAction()
      })
    }
  },
  previewsLoaded: () => {
    Dispatcher.handleViewAction({
      actionType: Constants.PREVIEWS_LOADED,
      item: undefined
    })
  },
  mouseEnterPreview: () => {
    Dispatcher.handleViewAction({
      actionType: Constants.MOUSEENTER_PREVIEW,
      item: undefined
    })
  },
  mouseLeavePreview: () => {
    Dispatcher.handleViewAction({
      actionType: Constants.MOUSELEAVE_PREVIEW,
      item: undefined
    })
  },
  changePreview: (idx) => {
    Dispatcher.handleViewAction({
      actionType: Constants.CHANGE_PREVIEW,
      item: { previewIdx: idx }
    })
  },
  windowResize: (windowW, windowH) => {
    Dispatcher.handleViewAction({
      actionType: Constants.WINDOW_RESIZE,
      item: { windowW: windowW, windowH: windowH }
    })
  },
  appStart: () => {
    Dispatcher.handleViewAction({
      actionType: Constants.APP_START,
      item: undefined
    })
  }
}

export default Actions
