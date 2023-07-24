import { type App } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import { 
  faCat,
  faSun,
  faMoon,
  faMountainSun,
  faKey,
  faPerson,
  faPersonDress,
  faCaretDown,
  faPenToSquare,
  faList,
  faXmark,
  faBoxArchive,
  faFileImport,
  faPaperPlane,
  faSpinner,
  faFan,
  faCog,
  faBell,
  faStar,
  faSquare,
  faInfoCircle,
  faBug,
  faHome,
  faTrash,
  faSkullCrossbones,
  faBroom,
} from '@fortawesome/free-solid-svg-icons';

export function useFontAwesome(vueApp: App): App {
  // specific icons to be installed.
  library.add(
    faCat,
    faSun,
    faMoon,
    faMountainSun,
    faKey,
    faPerson,
    faPersonDress,
    faCaretDown,
    faPenToSquare,
    faList,
    faXmark,
    faBoxArchive,
    faFileImport,
    faPaperPlane,
    faSpinner,
    faFan,
    faCog,
    faBell,
    faStar,
    faSquare,
    faInfoCircle,
    faBug,
    faHome,
    faTrash,
    faSkullCrossbones,
    faBroom,
  );

  // config.styleDefault = 'duotone';

  vueApp.component('FontAwesomeIcon', FontAwesomeIcon);
  return vueApp;
}