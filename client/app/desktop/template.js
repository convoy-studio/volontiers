import Store from '../../store'
import Constants from '../../constants'
import Router from '../../services/router'
import { resize as globalResize } from '../../services/global-events'
import FrontContainer from '../../components/FrontContainer'
import PagesContainer from '../../components/PagesContainer'
import BlockInteractionLayer from '../../components/partials/BlockInteractionLayer'
import About from '../../components/partials/About'
import raf from 'raf'

export default class AppTemplate extends React.Component {
  constructor() {
    super()
    this.state = {
      currentPage: ''
    }
  }
  componentWillMount() {
    this.update = this.update.bind(this)
    this.resize = this.resize.bind(this)
    this.didPageChange = this.didPageChange.bind(this)
  }
  render() {
    return (
      <div id='app-template' className={this.state.currentPage}>
        <BlockInteractionLayer />
        <FrontContainer ref='front-container' />
        <PagesContainer ref='pages-container' />
        <About />
      </div>
    )
  }
  componentDidMount() {
    Store.on(Constants.WINDOW_RESIZE, this.resize)
    Store.on(Constants.ROUTE_CHANGED, this.didPageChange)
    this.update()
    globalResize() // before render the app call the resize action to fill the initial values (Mouse, WindowSize)
  }
  update() {
    raf(() => {
      // this.refs['pages-container'].update()
      this.refs['front-container'].update()
      this.update()
    })
  }
  resize() {
    this.refs['pages-container'].resize()
    this.refs['front-container'].resize()
  }
  didPageChange() {
    const newRoute = Router.getNewRoute()
    const state = {
      currentPage: newRoute.type.toLowerCase()
    }
    this.setState(state)
  }
}
