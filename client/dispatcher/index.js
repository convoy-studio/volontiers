import Flux from 'flux'
import assign from 'object-assign'

const AppDispatcher = assign(new Flux.Dispatcher(), {
  handleViewAction: (action) => {
    AppDispatcher.dispatch({
      source: 'VIEW_ACTION',
      action: action
    })
  }
})

export default AppDispatcher
