import BaseComponent from '../../pager/components/BaseComponent'
import Store from '../../store'
import Actions from '../../actions'

class Landing extends BaseComponent {
  constructor(props) {
    super(props)
    this.data = props
  }
  render() {
    return (
      <a href="#" className="link" onClick={this.changeLang}>{this.data.lang}</a>
    )
  }

  changeLang() {
    Actions.changeLang(this.data.lang)
  }
}

export default Landing
