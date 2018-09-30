import {PagerStore, PagerActions, PagerConstants} from '../Pager'
import Store from '../../store'
import Actions from '../../actions'

class BasePager extends React.Component {
  constructor() {
    super()
    this.currentPageDivRef = 'page-b'
    this.willPageTransitionIn = this.willPageTransitionIn.bind(this)
    this.willPageTransitionOut = this.willPageTransitionOut.bind(this)
    this.didPageTransitionInComplete = this.didPageTransitionInComplete.bind(this)
    this.didPageTransitionOutComplete = this.didPageTransitionOutComplete.bind(this)
    this.pageTransitionDidFinish = this.pageTransitionDidFinish.bind(this)
    this.setupNewComponent = this.setupNewComponent.bind(this)
    this.components = {
      'new-component': undefined,
      'old-component': undefined
    }
  }
  render() {
    return (
			<div id='pages-container'>
				<div style={this.divStyle} ref='page-a' className='page-a'></div>
				<div style={this.divStyle} ref='page-b' className='page-b'></div>
			</div>
		)
  }
  componentWillMount() {
    PagerStore.on(PagerConstants.PAGE_TRANSITION_IN, this.willPageTransitionIn)
    PagerStore.on(PagerConstants.PAGE_TRANSITION_OUT, this.willPageTransitionOut)
    PagerStore.on(PagerConstants.PAGE_TRANSITION_DID_FINISH, this.pageTransitionDidFinish)
  }
  willPageTransitionIn() {
    this.switchPagesDivIndex()
    this.components['new-component'].willTransitionIn()
  }
  willPageTransitionOut() {
    if (this.components['old-component']) this.components['old-component'].willTransitionOut()
    else this.willPageTransitionIn()
  }
  pageAssetsLoaded() {
  }
  didPageTransitionInComplete() {
    PagerActions.onTransitionInComplete()
    PagerActions.pageTransitionDidFinish()
  }
  didPageTransitionOutComplete() {
    PagerActions.onTransitionOutComplete()
  }
  pageTransitionDidFinish() {
    this.hideLoadState()
    this.unmountComponent('old-component')
  }
  switchPagesDivIndex() {
    const newEl = this.refs[this.currentPageDivRef]
    const oldEl = this.refs[this.oldPageDivRef]
    newEl.style.zIndex = 2
    oldEl.style.zIndex = 1
  }
  setupNewComponent(hash, Type) {
    this.oldPageDivRef = this.currentPageDivRef
    this.currentPageDivRef = (this.currentPageDivRef === 'page-a') ? 'page-b' : 'page-a'
    const el = this.refs[this.currentPageDivRef]
    const page =
  		<Type
  			id={this.currentPageDivRef}
  			isReady={this.onPageReady}
  			hash={hash}
  			didTransitionInComplete={this.didPageTransitionInComplete.bind(this)}
  			didTransitionOutComplete={this.didPageTransitionOutComplete.bind(this)}
  		/>
    this.components['old-component'] = this.components['new-component']
    this.components['new-component'] = ReactDOM.render(page, el)
    return this.components['new-component']
  }
  onPageReady(route) {
    PagerActions.onPageReady(route)
  }
  showLoadState() {
    Store.Parent.style.cursor = 'wait'
    setTimeout(Actions.blockInteractivity)
  }
  hideLoadState() {
    Store.Parent.style.cursor = 'auto'
    setTimeout(Actions.unBlockInteractivity)
  }
  unmountComponent(ref) {
    if (this.components[ref] !== undefined) {
      const id = this.components[ref].props.id
      const domToRemove = this.refs[id]
      ReactDOM.unmountComponentAtNode(domToRemove)
      this.components['old-component'] = undefined
    }
  }
}

export default BasePager
