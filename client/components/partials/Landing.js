import BaseComponent from '../../pager/components/BaseComponent'
import LandingLogo from './LandingLogo'
import Data from '../../data'
import Store from '../../store'
import Actions from '../../actions'

class Landing extends BaseComponent {
  constructor(props) {
    super(props)
    let k = 0
    Store.Previews = []
    for (k in Data.projects) {
      if ({}.hasOwnProperty.call(Data.projects, k)) {
        Store.Previews.push({
          slug: k,
          image: `images/${Data.projects[k].preview}`
        })
      }
    }
  }
  render() {
    return (
      <div className="landing">
        <div className="landing__hero">
          <LandingLogo/>
          <p>Event & production agency</p>
        </div>
      </div>
    )
  }
}

export default Landing
