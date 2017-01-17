import Dispatcher from '../dispatcher'
import Constants from '../constants'
import {EventEmitter2} from 'eventemitter2'
import assign from 'object-assign'
import data from '../data'
import Router from '../services/router'
import isRetina from 'is-retina'
import Actions from '../actions'
import Utils from '../utils/Utils'

const slideshowActivityHandler = Utils.countActivityHandler(1000)
const projectOpenOverviewActivityHandler = Utils.countActivityHandler(1200)
const projectCloseOverviewActivityHandler = Utils.countActivityHandler(1200)
let aboutIsVisible = false

function _getContentScope(route) {
  return Store.getRoutePathScopeById(route.path)
}
function _getPageAssetsToLoad(r) {
  const route = r || Router.getNewRoute()
  const scope = _getContentScope(route)
  const type = route.type
  let manifest = []
  // Get the assets array from .json
  if (scope.assets !== undefined) {
    const assets = scope.assets
    let assetsManifest = _addBasePathsToUrls(assets, route.target)
    manifest = (manifest === undefined) ? assetsManifest : manifest.concat(assetsManifest)
  }
  // When project page load only the first image of the s
  if (type === Constants.PROJECT) {
    manifest = manifest.slice(0, 1)
  } else if (type === Constants.HOME) {
    const project = _getProjectById(route.target)
    if (project) {
      manifest.push({
        src: `assets/${project.image}`
      })
    }
  }
  return manifest
}
function _addBasePathsToUrls(urls, parent) {
  let basePath = `assets/images/${parent}/`
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
function _getContent(item) {
  let lang = Store.getLang()
  return data.content[lang][item]
}
function _getGlobalContent() {
  return data.content
}
function _getAppData() {
  return data
}
function _getDefaultRoute() {
  const homeProjects = _getHomeProjects()
  return `/home/${homeProjects[0].slug}`
}
function _getUserLanguage() {
  let lang = Constants.LANG.EN
  if (typeof localStorage === 'object') {
    try {
      localStorage.setItem('localStorage', 1)
      localStorage.removeItem('localStorage')
    } catch (e) {
      return lang
    }
  }
  if (localStorage.getItem('volontiers-lang') !== null) {
    let item = localStorage.getItem('volontiers-lang')
    if (item.toLocaleLowerCase() === Constants.LANG.FR) {
      lang = Constants.LANG.FR
    } else if (item.toLocaleLowerCase() === Constants.LANG.EN) {
      return lang
    }
  } else {
    let navLang = navigator.language || navigator.userLanguage
    if (navLang.toLocaleLowerCase() === Constants.LANG.FR) lang = Constants.LANG.FR
  }
  return lang
}
function _windowWidthHeight() {
  return {
    w: window.innerWidth,
    h: window.innerHeight
  }
}
function _getProjectPreview(slug) {
  return data.projects[slug].preview
}
function _getCurrentProject() {
  const route = Router.getNewRoute()
  return data.projects[route.target]
}
function _getCurrentAboutContent() {
  return _getCurrentProject().about[Store.Language]
}
function _getAllProjects() {
  let k = 0
  const projects = []
  for (k in data.projects) {
    if ({}.hasOwnProperty.call(data.projects, k)) {
      projects.push({
        slug: k,
        brand: data.projects[k].brand,
        separator: data.projects[k].separator,
        project: data.projects[k].project,
        type: data.projects[k].type,
        inHome: data.projects[k].inHome,
        image: `images/${k}/${data.projects[k].preview}`
      })
    }
  }
  return projects
}
function _getAllHomeProjects() {
  const projects = _getAllProjects()
  const filteredProjects = []
  projects.forEach((item) => {
    if (item.inHome !== 0) filteredProjects.push(item)
  })
  filteredProjects.sort((a, b) => {
    if (a.inHome < b.inHome) return -1
    if (a.inHome > b.inHome) return 1
    return 0
  })
  return filteredProjects
}
function _getProjectsByType(type) {
  const projects = Store.AllProjects
  const filteredProjects = []
  projects.forEach((item) => {
    if (item.type === type) { filteredProjects.push(item) }
  })
  return filteredProjects
}
function _getNextProject() {
  const projects = Store.AllProjects
  const route = Router.getNewRoute()
  let project = undefined
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i]
    if (p.slug === route.target) {
      project = projects[i + 1]
      if (project === undefined) project = projects[0]
      break
    }
  }
  return project
}
function _getHomeProjects() {
  return Store.AllHomeProjects
}
function _getProjectById(id) {
  const projects = Store.AllProjects
  let selected = undefined
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i]
    if (p.slug === id) {
      selected = p
      break
    }
  }
  return selected
}

const Store = assign({}, EventEmitter2.prototype, {
  emitChange: (type, item) => {
    Store.emit(type, item)
  },
  getContent: (item) => {
    return _getContent(item)
  },
  appData: () => {
    return _getAppData()
  },
  nextProject: () => {
    return _getNextProject()
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
  getProjectPreview: (slug) => {
    return _getProjectPreview(slug)
  },
  getCurrentProject: () => {
    return _getCurrentProject()
  },
  getCurrentAboutContent: () => {
    return _getCurrentAboutContent()
  },
  getProjects: () => {
    return Store.AllProjects
  },
  getProjectsByType: (type) => {
    return _getProjectsByType(type)
  },
  getHomeProjects: () => {
    return _getHomeProjects()
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
  getAboutPageContent: () => {
    return data.routing['/about'].content[Store.Language]
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
  AllProjects: _getAllProjects(), // cache projects array
  AllHomeProjects: _getAllHomeProjects(), // cache home projects array
  State: Constants.STATE.NORMAL,
  ProjectsSlugs: [],
  CurrentSlide: {},
  CurrentPreviewIndex: 0,
  CurrentProjectSlideIndex: 0,
  AllPreviewsLoaded: false,
  IndexIsOpened: false,
  ProjectInfoIsOpened: false,
  AppIsStarted: false,
  dispatcherIndex: Dispatcher.register((payload) => {
    const action = payload.action
    switch (action.actionType) {
    case Constants.WINDOW_RESIZE:
      Store.Window.w = action.item.windowW
      Store.Window.h = action.item.windowH
      Store.Orientation = (Store.Window.w > Store.Window.h) ? Constants.ORIENTATION.LANDSCAPE : Constants.ORIENTATION.PORTRAIT
      Store.emitChange(action.actionType)
      break
    case Constants.NEXT_SLIDE:
      if (slideshowActivityHandler.isReady === false) return
      slideshowActivityHandler.count()
      Store.emitChange(action.actionType)
      break
    case Constants.PREVIOUS_SLIDE:
      if (slideshowActivityHandler.isReady === false) return
      slideshowActivityHandler.count()
      Store.emitChange(action.actionType)
      break
    case Constants.ROUTE_CHANGED:
      if (!Store.AppIsStarted) return
      if (Store.State === Constants.STATE.PROJECTS) {
        setTimeout(Actions.closeProjectsOverview)
        setTimeout(() => { Store.emitChange(action.actionType) }, 600)
      } else {
        if (Store.ProjectInfoIsOpened) {
          setTimeout(Actions.toggleProjectInfos)
          setTimeout(() => { Store.emitChange(action.actionType) }, 800)
        } else {
          Store.emitChange(action.actionType)
        }
      }
      break
    case Constants.PREVIEW_CHANGED:
      Store.CurrentPreviewIndex = action.item.previewIdx
      Store.emitChange(action.actionType, action.item)
      break
    case Constants.CURRENT_SLIDE_CHANGED:
      Store.CurrentSlide = action.item
      Store.emitChange(action.actionType, action.item)
      break
    case Constants.PREVIEWS_LOADED:
      Store.AllPreviewsLoaded = true
      Store.emitChange(action.actionType)
      break
    case Constants.PROJECT_SLIDE_CHANGED:
      Store.CurrentProjectSlideIndex = action.item.projectSlideIdx
      Store.emitChange(action.actionType)
      break
    case Constants.LANGUAGE_CHANGED:
      if (typeof localStorage === 'object') {
        try {
          localStorage.setItem('localStorage', 1)
          localStorage.removeItem('localStorage')
        } catch (e) {
          alert('Your web browser does not support storing settings locally. In Safari, the most common cause of this is using "Private Browsing Mode". Some settings may not save or some features may not work properly for you.')
          break
        }
      }
      const currentLang = Store.getLang()
      const langToStore = currentLang === Constants.LANG.FR ? Constants.LANG.EN : Constants.LANG.FR
      localStorage.setItem('volontiers-lang', langToStore)
      location.reload()
      break
    case Constants.APP_START:
      Store.AppIsStarted = true
      setTimeout(Actions.routeChanged) // re-dispatch the route-changed so to create the view
      Store.emitChange(action.actionType)
      break
    case Constants.TOGGLE_PROJECT_INFOS:
      Store.ProjectInfoIsOpened = (Store.ProjectInfoIsOpened) ? false : true
      if (Store.State === Constants.STATE.PROJECTS && Store.ProjectInfoIsOpened) setTimeout(Actions.closeProjectsOverview)
      Store.emitChange(action.actionType)
      break
    case Constants.OPEN_PROJECTS_OVERVIEW:
      if (projectOpenOverviewActivityHandler.isReady === false) return
      projectOpenOverviewActivityHandler.count()
      Store.State = Constants.STATE.PROJECTS
      if (Store.ProjectInfoIsOpened) {
        setTimeout(Actions.toggleProjectInfos)
        setTimeout(() => { Store.emitChange(action.actionType) }, 800)
      } else {
        Store.emitChange(action.actionType)
      }
      break
    case Constants.CLOSE_PROJECTS_OVERVIEW:
      const oldRoute = Router.getOldRoute()
      if (projectCloseOverviewActivityHandler.isReady === false && (oldRoute && oldRoute.type !== Constants.ABOUT)) return
      projectCloseOverviewActivityHandler.count()
      Store.State = Constants.STATE.NORMAL
      Store.emitChange(action.actionType)
      break
    case Constants.TOGGLE_ABOUT:
      if (aboutIsVisible) {
        aboutIsVisible = false
        Store.State = Constants.STATE.NORMAL
      } else {
        aboutIsVisible = true
        Store.State = Constants.STATE.ABOUT
      }
      Store.emitChange(action.actionType)
      break
    case Constants.KEYBOARD_TRIGGERED:
      const key = action.item
      switch (Store.State) {
      case Constants.STATE.PROJECTS:
        setTimeout(Actions.closeProjectsOverview)
        break
      default:
        const route = Router.getNewRoute()
        if (route.type === Constants.PROJECT) {
          if (key === Constants.UP || key === Constants.RIGHT) setTimeout(Actions.nextSlide)
          else if (key === Constants.DOWN || key === Constants.LEFT) setTimeout(Actions.previousSlide)
          else if (key === Constants.ESC) setTimeout(Actions.openProjectsOverview)
          else if (key === Constants.SPACE) setTimeout(Actions.toggleProjectInfos)
          else setTimeout(Actions.nextSlide)
        } else if (route.type === Constants.ABOUT) {
          setTimeout(Actions.openProjectsOverview)
        }
      }
      Store.emitChange(action.actionType, action.item)
      break
    default:
      Store.emitChange(action.actionType, action.item)
      break
    }
  })
})

export default Store
