import Store from '../../store'
import Actions from '../../actions'
import slide from './Slide'
import counter from 'ccounter'

export default (container)=> {
  let scope
  const updateSlides = (done) => {
    removeSlides() // remove previous slides
    const content = Store.getCurrentProject()
    const assets = content.assets
    scope.counter = counter(assets.length + 1, 0, false)
    assets.forEach((asset, i) => {
      scope.slides.push(slide(scope.container, `images/${asset}`, i, 'slide'))
    })
    loadFirstSlide()
    done()
  }
  const loadFirstSlide = () => {
    scope.slides[0].load(() => {
      resize()
      Actions.slideshowIsReady()
      loadAllSlides()
    })
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
      s.load(resize)
    }
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
    if (scope.counter.props.index === scope.slides.length - 1) scope.lastProject = true
    else scope.lastProject = false
    scope.counter.inc()
  }
  const previous = () => {
    scope.counter.dec()
    scope.lastProject = false
  }
  scope = {
    container,
    updateSlides,
    removeSlides,
    resize,
    next,
    previous,
    lastProject: false,
    counter: undefined,
    slides: []
  }
  return scope
}
