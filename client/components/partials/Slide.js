import Utils from '../../utils/Utils'
import Store from '../../store'
import Constants from '../../constants'
import bezier from 'cubic-bezier'

const STATE = {
  ACTIVE: 'ACTIVE',
  DEACTIVE: 'DEACTIVE',
  TRANSITION_IN: 'TRANSITION_IN',
  TRANSITION_OUT: 'TRANSITION_OUT'
}
const transitionHideBezier = bezier(1, 0.01, 0.14, 1.01, 1000)
const transitionShowBezier = bezier(1, 0.01, 0.14, 1.01, 1000)
let transitionHideTime = 0
let transitionShowTime = 0

export default (container, imgFilename, index, pre = 'preview')=> {
  let scope
  const createPlane = (texture) => {
    const plane = {}
    plane.mesh = new PIXI.mesh.Plane(texture, 2, 2)
    plane.verts = plane.mesh.vertices
    plane.iverts = plane.verts.slice(0)
    plane.fverts = undefined
    return plane
  }
  const load = (done) => {
    Utils.pixiLoadTexture(`${pre}-${scope.index}`, `assets/${scope.imgFilename}`, (data) => {
      scope.plane = createPlane(data.texture)
      scope.mesh = scope.plane.mesh
      scope.container.addChild(scope.mesh)
      scope.isLoaded = true
      done()
    })
  }
  const resize = () => {
    const windowW = Store.Window.w
    const windowH = Store.Window.h
    const marginScale = 0.63
    const resizeVars = Utils.resizePositionProportionally(windowW * marginScale, windowH * marginScale, Constants.MEDIA_GLOBAL_W, Constants.MEDIA_GLOBAL_H)
    if (scope.isLoaded) {
      scope.mesh.scale.set(resizeVars.scale, resizeVars.scale)
      Utils.setDefaultPlanePositions(scope.plane)
    }
    return resizeVars
  }
  const animate = () => {
    if (scope.state === STATE.DEACTIVE) return
    scope.delta += 0.01
    const currentSlide = scope.plane
    const nextNx = Math.max(Store.Mouse.nX - 0.4, 0) * 0.2
    const offsetX = nextNx * 400
    const offsetY = nextNx * 300
    const easing = Math.max(0.1 * nextNx * 13.6, 0.1)
    switch (scope.state) {
    case STATE.ACTIVE:
      Utils.planeAnim(currentSlide, Store.Mouse, scope.delta, offsetX, offsetY, easing)
      break
    case STATE.TRANSITION_IN:
      transitionShowTime += 0.008
      const easeIn = transitionShowBezier(transitionShowTime)
      if (transitionShowTime >= 1) scope.activate()
      Utils.planeTransition(currentSlide, easeIn, scope.direction)
      break
    case STATE.TRANSITION_OUT:
      transitionHideTime += 0.008
      const easeOut = transitionHideBezier(transitionHideTime)
      if (transitionHideTime >= 1) scope.deactivate()
      Utils.planeTransition(currentSlide, easeOut, scope.direction)
      break
    default:
    }
  }
  const show = (dir) => {
    scope.direction = dir
    scope.activate()
    transitionShowTime = 0
    Utils.updateGoToPlanePositions(scope.plane, dir.to)
    scope.state = STATE.TRANSITION_IN
  }
  const hide = (dir) => {
    scope.direction = dir
    transitionHideTime = 0
    Utils.updateGoToPlanePositions(scope.plane, dir.to)
    scope.state = STATE.TRANSITION_OUT
  }
  const activate = () => {
    scope.state = STATE.ACTIVE
  }
  const deactivate = () => {
    scope.state = STATE.DEACTIVE
  }
  const clear = () => {
    scope.container.removeChild(scope.mesh)
    scope.mesh.destroy()
    scope.plane.iverts = null
    scope.plane.fverts = null
  }
  scope = {
    plane: undefined,
    mesh: undefined,
    direction: {
      from: Constants.RIGHT,
      to: Constants.RIGHT
    },
    isLoaded: false,
    delta: 0,
    state: STATE.DEACTIVE,
    activate,
    deactivate,
    show,
    hide,
    animate,
    resize,
    imgFilename,
    index,
    container,
    clear,
    load
  }
  return scope
}
