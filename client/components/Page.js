import BasePage from '../pager/components/BasePage'
import Store from '../store'
import Constants from '../constants'

export default class Page extends BasePage {
  constructor(props) {
    super(props)
    this.data = {}
    this.resize = this.resize.bind(this)
  }
  componentWillMount() {
    Store.on(Constants.WINDOW_RESIZE, this.resize)
    super.componentWillMount()
  }
  render() {
    super.render()
  }
  setupAnimations() {
    super.setupAnimations()
  }
  resize() {
    super.resize()
  }
  componentWillUnmount() {
    Store.off(Constants.WINDOW_RESIZE, this.resize)
    super.componentWillUnmount()
  }
}
