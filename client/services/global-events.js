import Actions from '../actions'
import Store from '../store'
import Constants from '../constants'
import Utils from '../utils/Utils'
import dom from 'dom-hand'
import mouseW from 'mouse-wheel'
import inertia from 'wheel-inertia'
import raf from 'raf'
import {PagerStore, PagerConstants} from '../pager/Pager'

const keyboardActivityHandler = Utils.countActivityHandler(650)

export function resize() {
  Actions.windowResize(window.innerWidth, window.innerHeight)
}

function mousemove(e) {
  e.preventDefault()
  const windowW  = Store.Window.w
  const windowH  = Store.Window.h
  Store.Mouse.x  = e.clientX
  Store.Mouse.y  = e.clientY
  Store.Mouse.nX = (e.clientX / windowW) * 2 - 1
  Store.Mouse.nY = (e.clientY / windowH) * 2 + 1
}

function mouseWheel(dx, dy) {
  raf(() => {
    inertia.update(dy)
  })
}

function onScroll(direction) {
  if (PagerStore.pageTransitionState !== PagerConstants.PAGE_TRANSITION_DID_FINISH) return
  Actions.triggerScroll(direction)
}

function keypress(e) {
  e.preventDefault()
  if (keyboardActivityHandler.isReady === false || PagerStore.pageTransitionState !== PagerConstants.PAGE_TRANSITION_DID_FINISH) return
  keyboardActivityHandler.count()
  const char = e.which || e.keyCode
  switch (char) {
  case 38:
    Actions.triggerKeyboard(Constants.UP)
    break
  case 40:
    Actions.triggerKeyboard(Constants.DOWN)
    break
  case 39:
    Actions.triggerKeyboard(Constants.RIGHT)
    break
  case 37:
    Actions.triggerKeyboard(Constants.LEFT)
    break
  case 27:
    Actions.triggerKeyboard(Constants.ESC)
    break
  case 32:
    Actions.triggerKeyboard(Constants.SPACE)
    break
  default:
  }
}

export function initGlobalEvents() {
  dom.event.on(window, 'resize', resize)
  dom.event.on(window, 'mousemove', mousemove)
  dom.event.on(window, 'keydown', keypress)
  dom.event.on(window, 'keydown', keypress)
  mouseW(mouseWheel)
  inertia.addCallback(onScroll)
}
