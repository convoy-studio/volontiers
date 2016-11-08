import Dispatcher from '../dispatcher'
import Constants from '../constants'
import {EventEmitter2} from 'eventemitter2'
import assign from 'object-assign'
import data from '../data'
import Router from '../services/router'
import isRetina from 'is-retina'
import Actions from '../actions'

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
  const homeProjects = _getHomeProjects()
  return `/home/${homeProjects[0].slug}`
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
        title: data.projects[k].name,
        type: data.projects[k].type,
        inHome: data.projects[k].inHome,
        image: `images/${k}/${data.projects[k].preview}`
      })
    }
  }
  return projects
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
  const projects = Store.AllProjects
  const filteredProjects = []
  projects.forEach((item) => {
    if (item.inHome) filteredProjects.push(item)
  })
  return filteredProjects
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
  menuContent: () => {
    return _getMenuContent()
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
  State: Constants.STATE.NORMAL,
  ProjectsSlugs: [],
  CurrentPreviewIndex: 0,
  CurrentProjectSlideIndex: 0,
  IndexIsOpened: false,
  ProjectInfoIsOpened: false,
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
    case Constants.PROJECT_SLIDE_CHANGED:
      Store.CurrentProjectSlideIndex = action.item.projectSlideIdx
      Store.emitChange(action.actionType)
      break
    case Constants.LANGUAGE_CHANGED:
      Store.Language = action.item.lang
      localStorage.setItem('volontiers-lang', action.item.lang)
      Store.emitChange(action.actionType)
      break
    case Constants.APP_START:
      setTimeout(Actions.routeChanged) // re-dispatch the route-changed so to create the view
      Store.emitChange(action.actionType)
      break
    case Constants.TOGGLE_PROJECT_INFOS:
      Store.ProjectInfoIsOpened = (Store.ProjectInfoIsOpened) ? false : true
      Store.emitChange(action.actionType)
      break
    case Constants.OPEN_PROJECTS_OVERVIEW:
      Store.State = Constants.STATE.PROJECTS
      Store.emitChange(action.actionType)
      break
    case Constants.CLOSE_PROJECTS_OVERVIEW:
      Store.State = Constants.STATE.NORMAL
      Store.emitChange(action.actionType)
      break
    default:
      Store.emitChange(action.actionType, action.item)
      break
    }
  })
})

export default Store
