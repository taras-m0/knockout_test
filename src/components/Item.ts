import * as ko from "knockout";

export default class Item {
  label: string = '';

  constructor(params: {
    label: string
  }) {
    this.label = params.label;
  }
}
