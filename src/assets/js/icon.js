import Vue from 'vue'

//fontawesome
import {library} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {
  faChevronUp,
  faChevronRight,
  faBars,
  faTimes,
  faCircle,
  faPlayCircle,
  faAngleDoubleDown,
  faSearch,
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";

Vue.component('font-awesome-icon', FontAwesomeIcon);
library.add(faBars);
library.add(faTimes);
library.add(faChevronRight);
library.add(faCircle);
library.add(faPlayCircle);
library.add(faAngleDoubleDown);
library.add(faChevronUp);
library.add(faSearch);
library.add(faTimesCircle);
