import Dispatcher from '../dispatcher'
import Constants from '../constants'
import {EventEmitter2} from 'eventemitter2'
import assign from 'object-assign'
import data from '../data'
import Router from '../services/router'
import isRetina from 'is-retina'
function _getContentScope(route) {
  return Store.getRoutePathScopeById(route.path)
}
function _getPageAssetsToLoad() {
  const route = Router.getNewRoute()
  const routeObj = (route === undefined) ? Router.getNewRoute() : route
  const scope = _getContentScope(routeObj)
  const type = _getTypeOfPage()
  const typeId = type.toLowerCase()
  let manifest = []
  // In case of extra assets
  if (scope.assets !== undefined) {
    const assets = scope.assets
    let assetsManifest = _addBasePathsToUrls(assets)
    manifest = (manifest === undefined) ? assetsManifest : manifest.concat(assetsManifest)
  }
  return manifest
}
function _addBasePathsToUrls(urls) {
  let basePath = 'assets/images/'
  let manifest = []
  for (let i = 0; i < urls.length; i++) {
    const splitter = urls[i].split('.')
    const fileName = splitter[0]
    const extension = splitter[1]
    manifest.push(basePath + fileName + '.' + extension)
  }
  return manifest
}
function _isRetina() {
  return isRetina()
}
function _getImageDeviceExtension() {
  const retina = _isRetina()
  let str = '@1x'
  if (retina === true) str = '@2x'
  return str
}
function _getDeviceRatio() {
  const scale = (window.devicePixelRatio === undefined) ? 1 : window.devicePixelRatio
  return (scale > 1) ? 2 : 1
}
function _getTypeOfPage(route) {
  let type
  const h = route || Router.getNewRoute()
  if (h.parts.length === 3) type = Constants.ARTISTS
  else type = Constants.HOME
  return type
}
function _getMenuContent() {
  return data.routing
}
function _getGlobalContent() {
  return data.content
}
function _getAppData() {
  return data
}
function _getDefaultRoute() {
  return data['default-route']
}
function _getUserLanguage() {
  let lang = 'en'
  if (localStorage.getItem('volontiers-lang') !== null) {
    let item = localStorage.getItem('volontiers-lang')
    if (item.toLocaleLowerCase() === 'fr') {
      lang = 'fr'
    } else if (item.toLocaleLowerCase() === 'en') {
      return lang
    }
  } else {
    lang = navigator.language || navigator.userLanguage
    if (lang.toLocaleLowerCase() === 'fr') lang = 'fr'
  }
  return lang
}
function _windowWidthHeight() {
  return {
    w: window.innerWidth,
    h: window.innerHeight
  }
}

const Store = assign({}, EventEmitter2.prototype, {
  emitChange: (type, item) => {
    Store.emit(type, item)
  },
  menuContent: () => {
    return _getMenuContent()
  },
  appData: () => {
    return _getAppData()
  },
  defaultRoute: () => {
    return _getDefaultRoute()
  },
  globalContent: () => {
    return _getGlobalContent()
  },
  pageAssetsToLoad: (route) => {
    return _getPageAssetsToLoad(route)
  },
  getRoutePathScopeById: (id) => {
    return data.routing[id]
  },
  pagePreloaderId: () => {
    const route = Router.getNewRoute()
    return route.type.toLowerCase() + '-' + route.parts[0] + '-' + route.parts[1] + '-'
  },
  getImgSrcById: (name) => {
    const route = Router.getNewRoute()
    const type = route.type.toLowerCase()
    const id = type + '-' + route.parent + '-' + route.target + '-' + name
    return Store.Preloader.getImageURL(id)
  },
  getImgById: (name) => {
    const route = Router.getNewRoute()
    const type = route.type.toLowerCase()
    const id = type + '-' + route.parent + '-' + route.target + '-' + name
    return Store.Preloader.getContentById(id)
  },
  getTextureSrc: (group, name) => {
    return Store.Preloader.getImageURL(group + '-texture-' + name)
  },
  getTexture: (group, name) => {
    const img = Store.getTextureImg(group, name)
    const texture = new THREE.Texture()
    texture.image = img
    texture.needsUpdate = true
    return texture
  },
  getLang: () => {
    return _getUserLanguage()
  },
  getTextureImg: (group, name) => {
    return Store.Preloader.getContentById(group + '-texture-' + name)
  },
  baseMediaPath: () => {
    return Store.getEnvironment().static
  },
  getEnvironment: () => {
    return Constants.ENVIRONMENTS[ENV]
  },
  devicePixelRatio: () => {
    return _getDeviceRatio()
  },
  Window: () => {
    return _windowWidthHeight()
  },
  getImageDeviceExtension: _getImageDeviceExtension,
  Mouse: { x: 0, y: 0, nX: 0, nY: 0 },
  Parent: undefined,
  Canvas: undefined,
  Orientation: Constants.ORIENTATION.LANDSCAPE,
  Detector: {},
  ProjectsSlugs: [],
  CurrentPreviewIndex: 0,
  CurrentProjectSlideIndex: 0,
  IndexIsOpened: false,
  dispatcherIndex: Dispatcher.register((payload) => {
    const action = payload.action
    switch (action.actionType) {
    case Constants.WINDOW_RESIZE:
      Store.Window.w = action.item.windowW
      Store.Window.h = action.item.windowH
      Store.Orientation = (Store.Window.w > Store.Window.h) ? Constants.ORIENTATION.LANDSCAPE : Constants.ORIENTATION.PORTRAIT
      Store.emitChange(action.actionType)
      break
    case Constants.ROUTE_CHANGED:
      const route = Router.getNewRoute()
      Store.emitChange(action.actionType)
      break
    case Constants.PREVIEW_CHANGED:
      Store.CurrentPreviewIndex = action.item.previewIdx
      Store.emitChange(action.actionType)
      break
    case Constants.PROJECT_SLIDE_CHANGED:
      Store.CurrentProjectSlideIndex = action.item.projectSlideIdx
      Store.emitChange(action.actionType)
      break
    case Constants.LANGUAGE_CHANGED:
      Store.Language = action.item.lang
      localStorage.setItem('volontiers-lang', action.item.lang)
      Store.emitChange(action.actionType)
      break
    default:
      Store.emitChange(action.actionType, action.item)
      break
    }
  })
})

export default Store
