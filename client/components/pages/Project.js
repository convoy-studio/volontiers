import Page from '../Page'
import Store from '../../store'
import dom from 'dom-hand'
import Data from '../../data'

export default class Project extends Page {
  constructor(props) {
    super(props)
    this.slug = props.hash.target
    this.data.name = Data.projects[this.slug].name
  }
  render() {
    return (
  		<div id='home-page' ref='page-wrapper' className='page-wrapper'>
  			<div className='vertical-center-parent'>
  				<p className='vertical-center-child'>
            Project : {this.data.name}
          </p>
  			</div>
  		</div>
  	)
  }
  componentDidMount() {
    super.componentDidMount()
  }
  setupAnimations() {
    super.setupAnimations()
  }
  didTransitionInComplete() {
    super.didTransitionInComplete()
  }
  willTransitionIn() {
    super.willTransitionIn()
  }
  willTransitionOut() {
    super.willTransitionOut()
  }
  resize() {
    const windowW = Store.Window.w
    const windowH = Store.Window.h
    super.resize()
  }
  componentWillUnmount() {
    super.componentWillUnmount()
  }
}
