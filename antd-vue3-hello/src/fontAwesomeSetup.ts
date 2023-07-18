import { type App } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import { 
  faCat,
  faSun,
  faMoon,
  faMountainSun,
} from '@fortawesome/free-solid-svg-icons';

export function useFontAwesome(vueApp: App): App {
  // specific icons to be installed.
  library.add(
    faCat,
    faSun,
    faMoon,
    faMountainSun,
  );

  // config.styleDefault = 'duotone';

  vueApp.component('FontAwesomeIcon', FontAwesomeIcon);
  return vueApp;
}
