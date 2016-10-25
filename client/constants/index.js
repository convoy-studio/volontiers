export default {
  WINDOW_RESIZE: 'WINDOW_RESIZE',
  ROUTE_CHANGED: 'ROUTE_CHANGED',
  PAGE_ASSETS_LOADED: 'PAGE_ASSETS_LOADED',
  PREVIEWS_LOADED: 'PREVIEWS_LOADED',
  INITIAL_PAGE_ASSETS_LOADED: 'INITIAL_PAGE_ASSETS_LOADED',
  LOAD_NEXT_PREVIOUS_PAGE_ASSETS: 'LOAD_NEXT_PREVIOUS_PAGE_ASSETS',
  APP_START: 'APP_START',

  ORIENTATION: {
    LANDSCAPE: 'LANDSCAPE',
    PORTRAIT: 'PORTRAIT'
  },

  HOME: 'HOME',
  ABOUT: 'ABOUT',
  PROJECT: 'PROJECT',

  FORWARD: 'FORWARD',
  BACKWARD: 'BACKWARD',

  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  TOP: 'TOP',
  BOTTOM: 'BOTTOM',

  PADDING_AROUND: 40,

  ENVIRONMENTS: {
    PREPROD: {
      static: 'http://localhost:3000/'
    },
    PROD: {
      static: 'http://myserver'
    }
  },

  MEDIA_GLOBAL_W: 1920,
  MEDIA_GLOBAL_H: 1080,

  MIN_MIDDLE_W: 960,
  MQ_XSMALL: 320,
  MQ_SMALL: 480,
  MQ_MEDIUM: 768,
  MQ_LARGE: 1024,
  MQ_XLARGE: 1280,
  MQ_XXLARGE: 1680
}
