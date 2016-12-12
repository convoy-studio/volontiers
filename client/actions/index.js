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
  startIntroAnimation: () => {
    Dispatcher.handleViewAction({
      actionType: Constants.START_INTRO_ANIMATION,
      item: undefined
    })
  },
  addToCanvas: (child, background) => {
    Dispatcher.handleViewAction({
      actionType: Constants.ADD_TO_CANVAS,
      item: {child, background}
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
  },
  openProjectsOverview: () => {
    Dispatcher.handleViewAction({
      actionType: Constants.OPEN_PROJECTS_OVERVIEW,
      item: undefined
    })
  },
  closeProjectsOverview: () => {
    Dispatcher.handleViewAction({
      actionType: Constants.CLOSE_PROJECTS_OVERVIEW,
      item: undefined
    })
  },
  unBlockInteractivity: () => {
    Dispatcher.handleViewAction({
      actionType: Constants.UN_BLOCK_INTERACTIVITY,
      item: undefined
    })
  },
  blockInteractivity: () => {
    Dispatcher.handleViewAction({
      actionType: Constants.BLOCK_INTERACTIVITY,
      item: undefined
    })
  },
  triggerKeyboard: (key) => {
    Dispatcher.handleViewAction({
      actionType: Constants.KEYBOARD_TRIGGERED,
      item: key
    })
  },
  triggerScroll: (direction) => {
    Dispatcher.handleViewAction({
      actionType: Constants.SCROLL_TRIGGERED,
      item: direction
    })
  },
  introAnimationCompleted: () => {
    Dispatcher.handleViewAction({
      actionType: Constants.START_INTRO_ANIMATION_COMPLETED,
      item: undefined
    })
  },
  slideVideoEnter: () => {
    Dispatcher.handleViewAction({
      actionType: Constants.SLIDE_VIDEO_ENTER,
      item: undefined
    })
  },
  slideVideoLeave: () => {
    Dispatcher.handleViewAction({
      actionType: Constants.SLIDE_VIDEO_LEAVE,
      item: undefined
    })
  },
  togglePlayVideo: () => {
    Dispatcher.handleViewAction({
      actionType: Constants.TOGGLE_PLAY_VIDEO,
      item: undefined
    })
  },
  toggleIconVideo: () => {
    Dispatcher.handleViewAction({
      actionType: Constants.TOGGLE_ICON_VIDEO,
      item: undefined
    })
  },
  toggleAbout: () => {
    Dispatcher.handleViewAction({
      actionType: Constants.TOGGLE_ABOUT,
      item: undefined
    })
  }
}

export default Actions
