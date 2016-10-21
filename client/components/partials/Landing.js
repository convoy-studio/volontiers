import BaseComponent from '../../pager/components/BaseComponent'
import LandingLogo from './LandingLogo'
import Data from '../../data'
import Store from '../../store'

class Landing extends BaseComponent {
  constructor(props) {
    super(props)
    const manifest = []
    let k = 0
    for (k in Data.projects) {
      if ({}.hasOwnProperty.call(Data.projects, k)) {
        manifest.push(`assets/images/${Data.projects[k].preview}`)
      }
    }
    Store.Preloader.load(manifest, () => {
      console.log('preview loaded')
    })
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
