import * as ko from "knockout";

export type TCategory = {
  label: string,
  children: Array<{
    label: string
  }>
}

export default class Category {
  label: string

  children: ko.ObservableArray<{ label: string }>

  open = ko.observable(false);

  addClass = ko.pureComputed( () => {
    return this.open() ? 'category__open' : '';
  });

  onClickIcon(){
    this.open(!this.open());
    return false;
  }

  constructor(params : TCategory) {

    //console.log('constructor category', arguments);

    this.label = params.label;

    this.children = ko.observableArray( params.children);
  }

  showPlanetElement(elem: HTMLElement) {
    console.log('showPlanetElement', elem);
    if (elem.nodeType === 1) $(elem).hide().slideDown()
  }

  hidePlanetElement(elem: HTMLElement) {
    if (elem.nodeType === 1) $(elem).slideUp( 500,function () {
      $(elem).remove();
    })
  }

}
