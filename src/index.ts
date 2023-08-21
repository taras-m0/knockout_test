import * as ko from 'knockout';
require('knockout.validation');

import './bindings';

import data from './data.js';
import './main.sass';
import './components/index';
import { TCategory } from "./components/Category";


ko.validation.init({
  errorElementClass: 'is-invalid',
  errorMessageClass: 'invalid-feedback',
  decorateInputElement: true
});


class AppModel {
  categories: ko.ObservableArray<TCategory>

  constructor() {
    this.categories = ko.observableArray( data );
  }
}

const appModel = new AppModel();
ko.applyBindings(appModel, document.getElementsByTagName('main')[0]);
