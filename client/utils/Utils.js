import Constants from '../constants'
import Store from '../store'
import dom from 'dom-hand'

class Utils {
  static normalizeMouseCoords(e, objWrapper) {
    let posx = 0
    let posy = 0
    if (e.pageX || e.pageY) {
      posx = e.pageX
      posy = e.pageY
    } else if (e.clientX || e.clientY) {
      posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft
      posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop
    }
    objWrapper.x = posx
    objWrapper.y = posy
    return objWrapper
  }
  static resizePositionProportionally(windowW, windowH, contentW, contentH, orientation) {
    const aspectRatio = contentW / contentH
    let scale
    if (orientation !== undefined) {
      if (orientation === Constants.LANDSCAPE) {
        scale = (windowW / contentW) * 1
      } else {
        scale = (windowH / contentH) * 1
      }
    } else {
      scale = ((windowW / windowH) < aspectRatio) ? (windowH / contentH) * 1 : (windowW / contentW) * 1
    }
    const newW = contentW * scale
    const newH = contentH * scale
    const css = {
      width: newW,
      height: newH,
      left: (windowW >> 1) - (newW >> 1),
      top: (windowH >> 1) - (newH >> 1),
      scale: scale
    }
    return css
  }
  static capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
  static supportWebGL() {
    try {
      const canvas = document.createElement( 'canvas' )
      return !! ( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) )
    } catch ( e ) {
      return false
    }
  }
  static destroyVideo(video) {
    video.pause()
    video.src = ''
    const children = video.childNodes
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      child.setAttribute('src', '')
      // Working with a polyfill or use jquery
      dom.tree.remove(child)
    }
  }
  static destroyVideoTexture(texture) {
    const video = texture.baseTexture.source
    Utils.destroyVideo(video)
  }
  static rand(min, max, decimals) {
    const randomNum = Math.random() * (max - min) + min
    if (decimals === undefined) {
      return randomNum
    }
    const d = Math.pow(10, decimals)
    return ~~((d * randomNum) + 0.5) / d
  }
  static getImgUrlId(url) {
    const split = url.split('/')
    return split[split.length - 1].split('.')[0]
  }
  static style(div, style) {
    div.style.webkitTransform = style
    div.style.mozTransform    = style
    div.style.msTransform     = style
    div.style.oTransform      = style
    div.style.transform       = style
  }
  static translate(div, x, y, z) {
    if ('webkitTransform' in document.body.style || 'mozTransform' in document.body.style || 'oTransform' in document.body.style || 'transform' in document.body.style) {
      Utils.style(div, 'translate3d(' + x + 'px,' + y + 'px,' + z + 'px)')
    } else {
      div.style.top = y + 'px'
      div.style.left = x + 'px'
    }
  }
  static guiVec3(gui, folderName, vec3, offsetX, offsetY, offsetZ, opened = true) {
    const folder = gui.addFolder(folderName)
    folder.add(vec3, 'x', vec3.x - offsetX, vec3.x + offsetX).onChange((value) => { vec3.x = value })
    folder.add(vec3, 'y', vec3.y - offsetY, vec3.y + offsetY).onChange((value) => { vec3.y = value })
    folder.add(vec3, 'z', vec3.z - offsetZ, vec3.z + offsetZ).onChange((value) => { vec3.z = value })
    if (opened) folder.open()
  }
  static pixiLoadTexture(id, url, cb) {
    let scope
    const loader = new PIXI.loaders.Loader()
    loader.add(id, url)
    loader.load()
    loader.once('complete', (data, resources) => {
      scope.texture = resources[scope.id].texture
      cb(scope)
    })
    scope = {
      loader,
      id,
      url
    }
    return scope
  }
  static planeAnim(plane, mouse, delta, offsetX, offsetY, easing) {
    const ntlx = ((plane.iverts[0] + Math.sin(mouse.nX - 0.5) * 50) - plane.verts[0] + offsetX) * easing
    const ntly = ((plane.iverts[1] + Math.cos(mouse.nY) * 10) - plane.verts[1] - offsetY) * easing
    const ntrx = ((plane.iverts[2] + Math.sin(mouse.nX + 0.5) * 50) - plane.verts[2] + offsetX) * easing
    const ntry = ((plane.iverts[3] + Math.cos(mouse.nY) * 30) - plane.verts[3] + offsetY) * easing
    const nblx = ((plane.iverts[4] + Math.sin(mouse.nX - 0.4) * 80) - plane.verts[4] + offsetX) * easing
    const nbly = ((plane.iverts[5] + Math.cos(mouse.nY - 0.6) * 40) - plane.verts[5] + offsetY) * easing
    const nbrx = ((plane.iverts[6] + Math.sin(mouse.nX + 0.4) * 80) - plane.verts[6] + offsetX) * easing
    const nbry = ((plane.iverts[7] + Math.cos(mouse.nY - 0.6) * 20) - plane.verts[7] - offsetY) * easing
    plane.verts[0] += ntlx + Math.cos(delta) * 2
    plane.verts[1] += ntly - Math.sin(delta) * 3
    plane.verts[2] += ntrx - Math.cos(delta) * 1
    plane.verts[3] += ntry + Math.sin(delta) * 4
    plane.verts[4] += nblx + Math.cos(delta) * 1
    plane.verts[5] += nbly - Math.sin(delta) * 2
    plane.verts[6] += nbrx + Math.cos(delta) * 2
    plane.verts[7] += nbry - Math.sin(delta) * 1
  }
  static planeTransition(plane, easing, direction) {
    let rFactor = 1
    let lFactor = 1
    if (direction.from === Constants.RIGHT && direction.to === Constants.CENTER) {
      rFactor = 0.4
      lFactor = 1
    } else if (direction.from === Constants.CENTER && direction.to === Constants.LEFT) {
      rFactor = 0.4
      lFactor = 1
    } else if (direction.from === Constants.LEFT && direction.to === Constants.CENTER) {
      rFactor = 1
      lFactor = 0.4
    } else if (direction.from === Constants.CENTER && direction.to === Constants.RIGHT) {
      rFactor = 1
      lFactor = 0.4
    }
    const ntlx = (plane.fverts[0] - plane.verts[0]) * (easing * lFactor)
    const ntly = (plane.fverts[1] - plane.verts[1]) * (easing * lFactor)
    const ntrx = (plane.fverts[2] - plane.verts[2]) * (easing * rFactor)
    const ntry = (plane.fverts[3] - plane.verts[3]) * (easing * rFactor)
    const nblx = (plane.fverts[4] - plane.verts[4]) * (easing * lFactor)
    const nbly = (plane.fverts[5] - plane.verts[5]) * (easing * lFactor)
    const nbrx = (plane.fverts[6] - plane.verts[6]) * (easing * rFactor)
    const nbry = (plane.fverts[7] - plane.verts[7]) * (easing * rFactor)
    plane.verts[0] += ntlx
    plane.verts[1] += ntly
    plane.verts[2] += ntrx
    plane.verts[3] += ntry
    plane.verts[4] += nblx
    plane.verts[5] += nbly
    plane.verts[6] += nbrx
    plane.verts[7] += nbry
  }
  static setDefaultPlanePositions(plane) {
    const windowW = Store.Window.w
    const windowH = Store.Window.h
    plane.verts[0] = plane.iverts[0] + (windowW * Utils.rand(8, 12, 1))
    plane.verts[1] = plane.iverts[1] - (windowW >> 1)
    plane.verts[2] = plane.iverts[2] + (windowW * Utils.rand(3.2, 4, 1))
    plane.verts[3] = plane.iverts[3] - (windowW >> 1)
    plane.verts[4] = plane.iverts[4] + (windowW * Utils.rand(8, 12, 1))
    plane.verts[5] = plane.iverts[5] + (windowW >> 1)
    plane.verts[6] = plane.iverts[6] + (windowW * Utils.rand(3.2, 4, 1))
    plane.verts[7] = plane.iverts[7] + (windowW >> 1)
  }
  static updateGoToPlanePositions(plane, dir) {
    const windowW = Store.Window.w
    const windowH = Store.Window.h
    plane.fverts = plane.verts.slice(0)
    switch (dir) {
    case Constants.CENTER:
      plane.fverts[0] = plane.iverts[0]
      plane.fverts[1] = plane.iverts[1]
      plane.fverts[2] = plane.iverts[2]
      plane.fverts[3] = plane.iverts[3]
      plane.fverts[4] = plane.iverts[4]
      plane.fverts[5] = plane.iverts[5]
      plane.fverts[6] = plane.iverts[6]
      plane.fverts[7] = plane.iverts[7]
      break
    case Constants.LEFT:
      plane.fverts[0] = plane.verts[0] - (windowW * Utils.rand(8, 12, 1))
      plane.fverts[1] = plane.verts[1] + (windowW >> 1)
      plane.fverts[2] = plane.verts[2] - (windowW * Utils.rand(3.2, 4, 1))
      plane.fverts[3] = plane.verts[3] + (windowW >> 1)
      plane.fverts[4] = plane.verts[4] - (windowW * Utils.rand(8, 12, 1))
      plane.fverts[5] = plane.verts[5] - (windowW >> 1)
      plane.fverts[6] = plane.verts[6] - (windowW * Utils.rand(3.2, 4, 1))
      plane.fverts[7] = plane.verts[7] - (windowW >> 1)
      break
    case Constants.RIGHT:
      plane.fverts[0] = plane.verts[0] + (windowW * Utils.rand(8, 12, 1))
      plane.fverts[1] = plane.verts[1] + (windowW >> 1)
      plane.fverts[2] = plane.verts[2] + (windowW * Utils.rand(3.2, 4, 1))
      plane.fverts[3] = plane.verts[3] + (windowW >> 1)
      plane.fverts[4] = plane.verts[4] + (windowW * Utils.rand(8, 12, 1))
      plane.fverts[5] = plane.verts[5] - (windowW >> 1)
      plane.fverts[6] = plane.verts[6] + (windowW * Utils.rand(3.2, 4, 1))
      plane.fverts[7] = plane.verts[7] - (windowW >> 1)
      break
    default:
    }
  }
}

export default Utils
