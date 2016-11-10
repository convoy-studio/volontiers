import Page from '../Page'
import Store from '../../store'
import dom from 'dom-hand'
import Data from '../../data'

export default class About extends Page {
  constructor(props) {
    super(props)
    this.slug = props.hash.path

    this.data = {
      content: Data.routing['/about'].content[Store.Language]
    }
  }
  render() {
    return (
  		<div id='about-page' ref='page-wrapper' className='page-wrapper'>
  			<p className="description" dangerouslySetInnerHTML={{__html: this.data.content}}></p>
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
    dom.classes.add(this.refs['page-wrapper'], 'show')
    setTimeout(() => {
      super.willTransitionIn()
    }, 700)
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
