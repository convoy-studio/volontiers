import Utils from '../../utils/Utils'
import Store from '../../store'
import Actions from '../../actions'
import Constants from '../../constants'
import bezier from 'cubic-bezier'

const STATE = {
  ACTIVE: 'ACTIVE',
  DEACTIVE: 'DEACTIVE',
  TRANSITION_IN: 'TRANSITION_IN',
  TRANSITION_OUT: 'TRANSITION_OUT',
  SCALE_UP: 'SCALE_UP',
  SCALE_DOWN: 'SCALE_DOWN',
  SCALE_DOWN_PREVIEW: 'SCALE_DOWN_PREVIEW'
}
const scaleUpBezier = bezier(1, 0.01, 0.14, 1.01, 500)
const scaleDownBezier = bezier(1, 0.01, 0.14, 1.01, 500)
let scaleUpTime = 0
let scaleDownTime = 0
const transitionHideBezier = bezier(1, 0.13, 0.7, 0.89, 500)
const transitionShowBezier = bezier(1, 0.13, 0.7, 0.89, 500)
let transitionHideTime = 0
let transitionShowTime = 0
let playing = true

export default (id, container, imgFilename, index, pre = 'preview', direction = { from: Constants.RIGHT, to: Constants.CENTER }, defaultPosition = Constants.CENTER)=> {
  let scope
  let ext = ''
  const initial = {}
  let currentVideoTime = 0
  const isMobile = Store.Detector.isMobile
  const createPlane = (texture) => {
    initial.texture = texture
    const plane = {}
    plane.mesh = new PIXI.mesh.Plane(texture, 2, 2)
    plane.verts = plane.mesh.vertices
    plane.iverts = plane.verts.slice(0)
    initial.vertices = plane.iverts.slice(0)
    plane.fverts = undefined
    return plane
  }
  const preparePlane = (done, texture) => {
    scope.plane = createPlane(texture)
    scope.plane.size = scope.size
    scope.mesh = scope.plane.mesh
    scope.container.addChild(scope.mesh)
    scope.isLoaded = true
    done(scope.plane, scope.index)
  }
  const load = (done) => {
    ext = Utils.getFileExtension(scope.imgFilename)
    scope.ext = ext
    if (pre === 'slide' && ext === 'mp4' && isMobile) {
      scope.originalFile = scope.imgFilename.substring(0, scope.imgFilename.lastIndexOf('.')) + '-mobile' + scope.imgFilename.substring(scope.imgFilename.lastIndexOf('.'))
      scope.imgFilename = '/images/video-placeholder.jpg'
      ext = 'jpg'
    }
    Utils.pixiLoadTexture(`${pre}-${scope.index}`, `assets/${scope.imgFilename}`, (data) => {
      if (ext === 'mp4') {
        let interval
        interval = setInterval(() => {
          if (data.texture.baseTexture.width !== 0) {
            data.texture.baseTexture.source.volume = 0
            data.texture.baseTexture.source.pause()
            scope.size[0] = data.texture.baseTexture.width
            scope.size[1] = data.texture.baseTexture.height
            data.texture.baseTexture.source.loop = true
            clearInterval(interval)
            preparePlane(done, data.texture)
          }
        }, 100)
      } else {
        scope.size[0] = data.texture.width
        scope.size[1] = data.texture.height
        preparePlane(done, data.texture)
      }
    })
  }
  const changeTexture = (path) => {
    const preview = Store.getProjectPreview(path)
    Utils.pixiLoadTexture(`${pre}-${scope.index}`, `assets/images/${path}/${preview}`, (data) => {
      let tl = undefined
      tl = new TimelineMax({ onComplete: () => {
        tl.clear()
      }})
      tl.to(scope.plane.mesh, 0.2, { alpha: 0, ease: Sine.easeInOut, onComplete: () => {
      }})
      tl.add(() => {
        scope.size[0] = data.texture.width
        scope.size[1] = data.texture.height
        scope.plane.size = scope.size
        scope.plane.mesh.texture = data.texture
        scope.plane.verts = scope.plane.mesh.vertices
        scope.plane.iverts = scope.plane.verts.slice(0)
        setTimeout(() => { Actions.resizeProjectsPreview() })
        scope.direction = { from: Constants.CENTER, to: Constants.SMALL }
        scaleDownTime = 0
        scope.state = STATE.SCALE_DOWN_PREVIEW
        if (scope.plane) Utils.updateGoToPlanePositions(scope.plane, scope.direction.to)
      })
      tl.to(scope.plane.mesh, 0.2, { alpha: 1, ease: Sine.easeInOut })
    })
  }
  const resize = () => {
    const pixelRatio = Math.min(Store.Detector.pixelRatio, 1.5)
    const windowW = Store.Window.w
    const windowH = Store.Window.h
    const orientation = scope.size[0] > scope.size[1] ? undefined : Constants.ORIENTATION.PORTRAIT
    let marginScale = orientation === Constants.ORIENTATION.PORTRAIT ? 0.8 : 0.6
    // Test if mobile : if landscape set to 1 for fullscreen OR test image orientation for set scale
    if (isMobile) marginScale = Store.Orientation === Constants.ORIENTATION.LANDSCAPE ? 1 : (orientation === Constants.ORIENTATION.PORTRAIT ? marginScale * 0.8  : marginScale * 0.5)
    const resizeVars = Utils.resizePositionProportionally(windowW * marginScale * pixelRatio, windowH * marginScale * pixelRatio, scope.size[0], scope.size[1], orientation)
    if (scope.isLoaded) {
      scope.mesh.scale.set(resizeVars.scale, resizeVars.scale)
      Utils.setDefaultPlanePositions(scope.plane, scope.defaultPosition)
    }
    return resizeVars
  }
  const animate = () => {
    if (scope.state === STATE.DEACTIVE || scope.isLoaded === false) return
    scope.delta += 0.012
    const currentSlide = scope.plane
    switch (scope.state) {
    case STATE.ACTIVE:
      if (isMobile) break
      const nextNx = Math.max(Store.Mouse.nX - 0.4, 0) * 0.2
      const offsetX = nextNx * 500
      const offsetY = nextNx * 300
      const easing = Math.max(0.1 * nextNx * 13.6, 0.1)
      if (pre === 'slide' && index > 0) break
      Utils.planeAnim(currentSlide, Store.Mouse, scope.delta, offsetX, offsetY, easing)
      break
    case STATE.SCALE_UP:
      scaleUpTime += 0.02
      const scaleUp = Math.min(scaleUpBezier(scaleUpTime), 1)
      Utils.planeTransition(currentSlide, scaleUp, scope.direction)
      break
    case STATE.SCALE_DOWN:
      scaleDownTime += 0.02
      const scaleDown = Math.max(0, Math.min(scaleDownBezier(scaleDownTime), 1))
      Utils.planeTransition(currentSlide, scaleDown, scope.direction)
      break
    case STATE.SCALE_DOWN_PREVIEW:
      Utils.planeTransition(currentSlide, 1, scope.direction)
      break
    case STATE.TRANSITION_IN:
      transitionShowTime += 0.008
      const easeIn = transitionShowBezier(transitionShowTime)
      if (transitionShowTime >= 0.8) scope.activate()
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
    transitionShowTime = 0
    // scope.activate()
    Utils.updateGoToPlanePositions(scope.plane, dir.to)
    scope.state = STATE.TRANSITION_IN
  }
  const hide = (dir) => {
    if (ext === 'mp4') {
      setTimeout(() => {Actions.slideVideoLeave()})
      TweenMax.to(scope.mesh.texture.baseTexture.source, 0.3, {volume: 0, onComplete: () => {
        scope.mesh.texture.baseTexture.source.pause()
      }})
    }
    removeEvents()
    scope.direction = dir
    transitionHideTime = 0
    Utils.updateGoToPlanePositions(scope.plane, dir.to)
    scope.state = STATE.TRANSITION_OUT
  }
  const onProjectsPreviewChange = (path) => {
    changeTexture(path)
  }
  const onProjectsOverviewOpen = () => {
    if (ext === 'mp4') {
      TweenMax.to(scope.mesh.texture.baseTexture.source, 0.3, {volume: 0, onComplete: () => {
        currentVideoTime = scope.mesh.texture.baseTexture.source.currentTime
        scope.mesh.texture.baseTexture.source.pause()
      }})
    }
    scope.direction = { from: Constants.CENTER, to: Constants.SMALL }
    scaleDownTime = 0
    if (scope.plane) Utils.updateGoToPlanePositions(scope.plane, scope.direction.to)
    scope.state = STATE.SCALE_DOWN
  }
  const onProjectsOverviewClose = () => {
    let tl = undefined
    tl = new TimelineMax({ onComplete: () => {
      tl.clear()
    }})
    tl.to(scope.plane.mesh, 0.2, { alpha: 0, ease: Sine.easeInOut })
    tl.add(() => {
      scope.size[0] = initial.texture.width
      scope.size[1] = initial.texture.height
      scope.plane.size = scope.size
      scope.plane.mesh.texture = initial.texture
      scope.plane.verts = scope.plane.mesh.vertices
      scope.plane.iverts = initial.vertices
      setTimeout(() => { Actions.resizeProjectsPreview() })
      scope.direction = { from: Constants.SMALL, to: Constants.CENTER }
      scaleUpTime = 0
      scope.state = STATE.SCALE_UP
      if (scope.plane) Utils.updateGoToPlanePositions(scope.plane, scope.direction.to)
    })
    tl.to(scope.plane.mesh, 0.2, { alpha: 1, ease: Sine.easeInOut })
    removeEvents()
    setTimeout(() => {
      scope.activate()
    }, 500)
  }
  const onAboutToggle = () => {
    if (Store.State === Constants.STATE.ABOUT && ext === 'mp4') {
      TweenMax.to(scope.mesh.texture.baseTexture.source, 0.3, {volume: 0, onComplete: () => {
        currentVideoTime = scope.mesh.texture.baseTexture.source.currentTime
        scope.mesh.texture.baseTexture.source.pause()
      }})
    } else if (ext === 'mp4') {
      setTimeout(() => {
        scope.activate()
      }, 500)
    } else {
      return
    }
  }
  const togglePlayVideo = () => {
    if (playing) {
      playing = false
      scope.mesh.texture.baseTexture.source.pause()
    } else {
      playing = true
      scope.mesh.texture.baseTexture.source.play()
    }
    setTimeout(() => {Actions.toggleIconVideo()})
  }
  const activate = (overview) => {
    removeEvents()
    Store.on(Constants.OPEN_PROJECTS_OVERVIEW, onProjectsOverviewOpen)
    Store.on(Constants.CLOSE_PROJECTS_OVERVIEW, onProjectsOverviewClose)
    Store.on(Constants.CHANGE_PROJECTS_PREVIEW, onProjectsPreviewChange)
    Store.on(Constants.TOGGLE_ABOUT, onAboutToggle)
    if (ext === 'mp4') {
      scope.mesh.texture.baseTexture.source.currentTime = currentVideoTime
      scope.mesh.texture.baseTexture.source.play()
      TweenMax.to(scope.mesh.texture.baseTexture.source, 0.3, {volume: 1})
      setTimeout(() => {Actions.slideVideoEnter()})
    }
    scope.state = STATE.ACTIVE
  }
  const deactivate = () => {
    scope.state = STATE.DEACTIVE
    removeEvents()
  }
  const removeEvents = () => {
    Store.off(Constants.OPEN_PROJECTS_OVERVIEW, onProjectsOverviewOpen)
    Store.off(Constants.CLOSE_PROJECTS_OVERVIEW, onProjectsOverviewClose)
    Store.off(Constants.CHANGE_PROJECTS_PREVIEW, onProjectsPreviewChange)
    Store.off(Constants.TOGGLE_ABOUT, onAboutToggle)
  }
  const clear = () => {
    removeEvents()
    if (scope.mesh) {
      scope.mesh.destroy()
      scope.container.removeChild(scope.mesh)
    }
    if (scope.plane) {
      scope.plane.iverts = null
      scope.plane.fverts = null
    }
    if (ext === 'mp4') {
      TweenMax.to(scope.mesh.texture.baseTexture.source, 0.3, {volume: 0, onComplete: () => {
        scope.mesh.texture.baseTexture.source.pause()
      }})
    }
  }
  scope = {
    plane: undefined,
    mesh: undefined,
    isLoaded: false,
    delta: 0,
    state: STATE.DEACTIVE,
    size: [0, 0],
    ext: undefined,
    originalFile: undefined,
    id,
    defaultPosition,
    direction,
    activate,
    deactivate,
    show,
    hide,
    togglePlayVideo,
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
