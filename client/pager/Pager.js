import Flux from 'flux'
import {EventEmitter2} from 'eventemitter2'
import assign from 'object-assign'

// Actions
const PagerActions = {
  onPageReady: (path) => {
    PagerDispatcher.handlePagerAction({
      type: PagerConstants.PAGE_IS_READY,
      item: path
    })
  },
  onTransitionOut: () => {
    PagerDispatcher.handlePagerAction({
      type: PagerConstants.PAGE_TRANSITION_OUT,
      item: undefined
    })
  },
  onTransitionOutComplete: () => {
    PagerDispatcher.handlePagerAction({
      type: PagerConstants.PAGE_TRANSITION_OUT_COMPLETE,
      item: undefined
    })
  },
  pageTransitionDidFinish: () => {
    PagerDispatcher.handlePagerAction({
      type: PagerConstants.PAGE_TRANSITION_DID_FINISH,
      item: undefined
    })
  }
}

// Constants
const PagerConstants = {
  PAGE_IS_READY: 'PAGE_IS_READY',
  PAGE_TRANSITION_IN: 'PAGE_TRANSITION_IN',
  PAGE_TRANSITION_OUT: 'PAGE_TRANSITION_OUT',
  PAGE_TRANSITION_OUT_COMPLETE: 'PAGE_TRANSITION_OUT_COMPLETE',
  PAGE_TRANSITION_IN_PROGRESS: 'PAGE_TRANSITION_IN_PROGRESS',
  PAGE_TRANSITION_DID_FINISH: 'PAGE_TRANSITION_DID_FINISH'
}

// Dispatcher
const PagerDispatcher = assign(new Flux.Dispatcher(), {
  handlePagerAction: (action) => {
    PagerDispatcher.dispatch(action)
  }
})

// Store
const PagerStore = assign({}, EventEmitter2.prototype, {
  firstPageTransition: true,
  pageTransitionState: undefined,
  dispatcherIndex: PagerDispatcher.register((payload) => {
    const actionType = payload.type
    const item = payload.item
    switch (actionType) {
    case PagerConstants.PAGE_IS_READY:
      PagerStore.pageTransitionState = PagerConstants.PAGE_TRANSITION_IN_PROGRESS
      const type = PagerConstants.PAGE_TRANSITION_IN
      PagerStore.emit(type)
      break
    case PagerConstants.PAGE_TRANSITION_OUT_COMPLETE:
      PagerStore.emit(type)
      break
    case PagerConstants.PAGE_TRANSITION_DID_FINISH:
      if (PagerStore.firstPageTransition) PagerStore.firstPageTransition = false
      PagerStore.pageTransitionState = PagerConstants.PAGE_TRANSITION_DID_FINISH
      PagerStore.emit(actionType)
      break
    default:
      PagerStore.emit(actionType, item)
      break
    }
    return true
  })
})

export {
  PagerStore,
  PagerActions,
  PagerConstants,
  PagerDispatcher
}
