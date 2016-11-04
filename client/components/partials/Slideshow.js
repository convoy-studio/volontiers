import Store from '../../store'
import Actions from '../../actions'
import Constants from '../../constants'
import Router from '../../services/router'
import slide from './Slide'
import counter from 'ccounter'
import Utils from '../../utils/Utils'

export default (container)=> {
  let scope
  const load = (done) => {
    const content = Store.getCurrentProject()
    const assets = content.assets
    scope.counter = counter(assets.length, 0, false)
    assets.forEach((asset, i) => {
      scope.slides.push(slide(scope.container, `images/${asset}`, i, 'slide'))
    })
    loadFirstSlide()
    done()
    return scope
  }
  const loadFirstSlide = () => {
    scope.slides[0].load(onSlideLoaded)
  }
  const removeSlides = () => {
    console.log('children container num is', scope.container.children.length)
    scope.slides.forEach((child) => {
      child.clear()
      console.log('clear', child)
      console.log('children container num after clear is', scope.container.children.length)
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
    const windowW = Store.Window.w
    const windowH = Store.Window.h
    scope.slides.forEach((item) => {
      const resizeVars = item.resize()
      if (item.isLoaded) {
        item.mesh.position.x = (windowW >> 1) - (resizeVars.width >> 1)
        item.mesh.position.y = (windowH >> 1) - (resizeVars.height >> 1)
      }
    })
  }
  const next = () => {
    scope.counter.inc()
    updateCurrentSlide()
    if (scope.oldSlide) scope.oldSlide.hide({from: Constants.CENTER, to: Constants.LEFT})
    scope.currentSlide.show({from: Constants.RIGHT, to: Constants.CENTER})
    updateSlideshowState()
  }
  const previous = () => {
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
    scope.currentSlide.hide({from: Constants.CENTER, to: Constants.LEFT})
  }
  const clear = () => {
    removeSlides()
    Store.off(Constants.NEXT_SLIDE, next)
    Store.off(Constants.PREVIOUS_SLIDE, previous)
    scope.slides.length = 0
  }
  Store.on(Constants.NEXT_SLIDE, next)
  Store.on(Constants.PREVIOUS_SLIDE, previous)
  scope = {
    container,
    load,
    removeSlides,
    resize,
    next,
    previous,
    update,
    clear,
    transitionOut,
    currentSlide: undefined,
    oldSlide: undefined,
    counter: undefined,
    slides: []
  }
  return scope
}
