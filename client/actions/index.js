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
  projectImagesLoaded: () => {
    Dispatcher.handleViewAction({
      actionType: Constants.PROJECT_IMAGES_LOADED,
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
  mouseEnterRightProject: () => {
    Dispatcher.handleViewAction({
      actionType: Constants.MOUSEENTER_RIGHT_PROJECT,
      item: undefined
    })
  },
  mouseLeaveRightProject: () => {
    Dispatcher.handleViewAction({
      actionType: Constants.MOUSELEAVE_RIGHT_PROJECT,
      item: undefined
    })
  },
  mouseEnterLeftProject: () => {
    Dispatcher.handleViewAction({
      actionType: Constants.MOUSEENTER_LEFT_PROJECT,
      item: undefined
    })
  },
  mouseLeaveLeftProject: () => {
    Dispatcher.handleViewAction({
      actionType: Constants.MOUSELEAVE_LEFT_PROJECT,
      item: undefined
    })
  },
  changePreview: (idx) => {
    Dispatcher.handleViewAction({
      actionType: Constants.PREVIEW_CHANGED,
      item: { previewIdx: idx }
    })
  },
  changeProjectSlide: (idx) => {
    Dispatcher.handleViewAction({
      actionType: Constants.PROJECT_SLIDE_CHANGED,
      item: { projectSlideIdx: idx }
    })
  },
  toggleProjectInfos: () => {
    Dispatcher.handleViewAction({
      actionType: Constants.TOGGLE_PROJECT_INFOS,
      item: undefined
    })
  },
  changeLang: (lang) => {
    Dispatcher.handleViewAction({
      actionType: Constants.LANGUAGE_CHANGED,
      item: { lang: lang }
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
  },
  addToCanvas: (child) => {
    Dispatcher.handleViewAction({
      actionType: Constants.ADD_TO_CANVAS,
      item: {child}
    })
  },
  removeFromCanvas: (child) => {
    Dispatcher.handleViewAction({
      actionType: Constants.REMOVE_FROM_CANVAS,
      item: {child}
    })
  },
  openProject: () => {
    Dispatcher.handleViewAction({
      actionType: Constants.OPEN_PROJECT,
      item: undefined
    })
  },
  closeProject: () => {
    Dispatcher.handleViewAction({
      actionType: Constants.CLOSE_PROJECT,
      item: undefined
    })
  },
  slideshowIsReady: () => {
    Dispatcher.handleViewAction({
      actionType: Constants.SLIDESHOW_IS_READY,
      item: undefined
    })
  },
  nextSlide: () => {
    Dispatcher.handleViewAction({
      actionType: Constants.NEXT_SLIDE,
      item: undefined
    })
  },
  previousSlide: () => {
    Dispatcher.handleViewAction({
      actionType: Constants.PREVIOUS_SLIDE,
      item: undefined
    })
  },
  setSlideshowState: (state) => {
    Dispatcher.handleViewAction({
      actionType: Constants.SLIDESHOW_STATE_CHANGED,
      item: state
    })
  },
  updatePreviewSlide: (id) => {
    Dispatcher.handleViewAction({
      actionType: Constants.UPDATE_PREVIEW_SLIDE,
      item: id
    })
  }
}

export default Actions
