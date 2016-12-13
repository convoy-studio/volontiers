import Store from '../../store'
import Actions from '../../actions'
import Constants from '../../constants'
import Router from '../../services/router'
import slide from './Slide'
import counter from 'ccounter'
import Utils from '../../utils/Utils'

const activityHandler = Utils.countActivityHandler(650)
export default (container)=> {
  let scope
  const load = (done) => {
    const content = Store.getCurrentProject()
    const projectContent = JSON.parse(JSON.stringify(content))
    const newRoute = Router.getNewRoute()
    const oldRoute = Router.getOldRoute()
    const assets = projectContent.assets.slice(0)
    if (oldRoute === undefined || oldRoute.type === Constants.ABOUT || oldRoute.type === Constants.PROJECT || !(oldRoute.type === Constants.HOME && oldRoute.target === newRoute.target)) assets.unshift(content.preview)
    scope.counter = counter(assets.length, 0, false)
    assets.forEach((asset, i) => {
      scope.slides.push(slide(newRoute.target, scope.container, `images/${newRoute.target}/${asset}`, i, 'slide'))
    })
    loadFirstSlide(done)
    return scope
  }
  const loadFirstSlide = (done) => {
    scope.slides[0].load((plane, index) => {
      activityHandler.count()
      scope.firstItemLoaded = true
      onSlideLoaded(plane, index)
      done()
    })
  }
  const removeSlides = () => {
    scope.slides.forEach((child) => {
      child.clear()
    })
  }
  /*
  Load the rest of the slides except the first one because is already loaded
  */
  const loadAllSlides = () => {
    const all = scope.slides
    for (let i = 1; i < all.length; i++) {
      const s = all[i]
      s.load(onSlideLoaded)
    }
  }
  const onSlideLoaded = (plane, index) => {
    if (index === 0) { // when first slide loaded
      Actions.slideshowIsReady()
      loadAllSlides()
      updateCurrentSlide()
      const oldRoute = Router.getOldRoute()
      if (oldRoute) {
        Utils.setDefaultPlanePositions(plane, Constants.RIGHT)
        scope.currentSlide.show({from: Constants.RIGHT, to: Constants.CENTER})
      } else {
        scope.currentSlide.activate()
      }
    } else { // the rest of the slides goes here
      Utils.setDefaultPlanePositions(plane, Constants.RIGHT)
    }
    resize()
    updateSlideshowState()
  }
  const resize = () => {
    const pixelRatio = Math.min(Store.Detector.pixelRatio, 1.5)
    const windowW = Store.Window.w * pixelRatio
    const windowH = Store.Window.h * pixelRatio
    scope.slides.forEach((item) => {
      const resizeVars = item.resize()
      if (item.isLoaded) {
        item.mesh.position.x = (windowW >> 1) - (resizeVars.width >> 1)
        item.mesh.position.y = (windowH >> 1) - (resizeVars.height >> 1)
      }
    })
  }
  const resizePreview = () => {
    const pixelRatio = Math.min(Store.Detector.pixelRatio, 1.5)
    const windowW = Store.Window.w * pixelRatio
    const windowH = Store.Window.h * pixelRatio
    const resizeVars = scope.currentSlide.resize()
    scope.currentSlide.mesh.position.x = (windowW >> 1) - (resizeVars.width >> 1)
    scope.currentSlide.mesh.position.y = (windowH >> 1) - (resizeVars.height >> 1)
  }
  const next = () => {
    if (activityHandler.isReady === false || scope.firstItemLoaded === false || Store.ProjectInfoIsOpened) return
    activityHandler.count()
    scope.counter.inc()
    updateCurrentSlide()
    if (scope.oldSlide) scope.oldSlide.hide({from: Constants.CENTER, to: Constants.LEFT})
    scope.currentSlide.show({from: Constants.RIGHT, to: Constants.CENTER})
    updateSlideshowState()
  }
  const previous = () => {
    if (activityHandler.isReady === false || scope.firstItemLoaded === false || Store.ProjectInfoIsOpened) return
    activityHandler.count()
    scope.counter.dec()
    updateCurrentSlide()
    if (scope.oldSlide) scope.oldSlide.hide({from: Constants.CENTER, to: Constants.RIGHT})
    scope.currentSlide.show({from: Constants.LEFT, to: Constants.CENTER})
    updateSlideshowState()
  }
  const updateSlideshowState = () => {
    if (scope.counter.props.index >= scope.slides.length - 1) setTimeout(() => {Actions.setSlideshowState(Constants.SLIDESHOW.END)})
    else if (scope.counter.props.index === 0) setTimeout(() => {Actions.setSlideshowState(Constants.SLIDESHOW.BEGIN)})
    else setTimeout(() => {Actions.setSlideshowState(Constants.SLIDESHOW.MIDDLE)})
  }
  const updateCurrentSlide = () => {
    scope.oldSlide = scope.currentSlide
    scope.currentSlide = scope.slides[scope.counter.props.index]
  }
  const update = () => {
    scope.slides.forEach((item) => {
      item.animate()
    })
  }
  const transitionOut = () => {
    const newRoute = Router.getNewRoute()
    if (newRoute.type === Constants.HOME) scope.currentSlide.hide({from: Constants.CENTER, to: Constants.RIGHT})
    else scope.currentSlide.hide({from: Constants.CENTER, to: Constants.TOP})
  }
  const showCurrentSlide = () => {
    scope.currentSlide.show({from: Constants.TOP, to: Constants.CENTER})
  }
  const hideCurrentSlide = () => {
    scope.currentSlide.hide({from: Constants.CENTER, to: Constants.TOP})
  }
  const togglePlayVideo = () => {
    scope.currentSlide.togglePlayVideo()
  }
  const clear = () => {
    removeSlides()
    Store.off(Constants.NEXT_SLIDE, next)
    Store.off(Constants.PREVIOUS_SLIDE, previous)
    Store.off(Constants.TOGGLE_PLAY_VIDEO, togglePlayVideo)
    scope.slides.length = 0
  }
  Store.on(Constants.NEXT_SLIDE, next)
  Store.on(Constants.PREVIOUS_SLIDE, previous)
  Store.on(Constants.TOGGLE_PLAY_VIDEO, togglePlayVideo)
  scope = {
    container,
    load,
    removeSlides,
    resize,
    resizePreview,
    next,
    previous,
    update,
    clear,
    transitionOut,
    showCurrentSlide,
    hideCurrentSlide,
    firstItemLoaded: false,
    currentSlide: undefined,
    oldSlide: undefined,
    counter: undefined,
    slides: []
  }
  return scope
}
