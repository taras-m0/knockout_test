import * as ko from "knockout";
import {ObservableArray} from "knockout";

type TPosition = { x: number, y: number };

function disableSelect(event) {
  event.preventDefault();
}

const dragNDrop = new class {
  dragElement: HTMLElement;
  origElement: HTMLElement;

  offsetPosition: TPosition = { x: 0, y: 0 };

  dragStart(element: HTMLElement, mousePosition: TPosition): void {
    this.origElement = element;

    const offset = $(element).offset();
    const copyEl = $(element).clone(false).appendTo('body')
      .height($(element).height()).width($(element).width()).css({
        position: 'absolute', background: 'white', boxShadow: '0px 3px 16px 0px #0066FFB2',
        transition: 'box-shadow 0.5s ease'
      }).offset({ top: offset.top, left: offset.left});
    this.dragElement = copyEl.get(0);

    $(element).css({ filter: 'opacity( 0.5 )' });
    this.offsetPosition = {
      x: mousePosition.x - offset.left,
      y: mousePosition.y - offset.top
    };

    window.addEventListener('selectstart', disableSelect);
  }

  mouseUp(e: MouseEvent){
    // console.log('mouseUp', e);
    if(!this.dragElement){
      return
    }

    $(this.dragElement).fadeOut(300, function (){
      $(this).remove();
    });

    $(this.origElement).css({ filter: 'none'});

    window.removeEventListener('selectstart', disableSelect);
  }

  mouseMove(e: MouseEvent){
    // console.log('mouseUp', e);
    if(!this.dragElement){
      return
    }

    $(this.dragElement).offset({
      top: e.clientY - this.offsetPosition.y,
      left: e.clientX - this.offsetPosition.x
    });
  }
}

window.addEventListener('mouseup', dragNDrop.mouseUp.bind(dragNDrop));
window.addEventListener('mousemove', dragNDrop.mouseMove.bind(dragNDrop));


ko.bindingHandlers.draggable = {
  init: function (element: HTMLElement, valueAccessor: () => ObservableArray, allBindings, viewModel ): void  {

    // console.log('init', arguments, this);

    const valueUnwrapped = ko.unwrap(valueAccessor());
    // console.log('valueUnwrapped', valueUnwrapped, viewModel, valueAccessor());
    // console.log('valueAccessor', valueAccessor,  valueAccessor());
    // const isPopulatedArray = Array.isArray(valueUnwrapped) && valueUnwrapped.length > 0;
    // const text = isPopulatedArray ? valueUnwrapped.join(', ') : 'Unknown';

    Promise.resolve().then(() => {
      $('.icon-draggable:first', element).on('mousedown', function (e) {
        // console.log('mousedown', e);
        dragNDrop.dragStart(element, {
          x: e.originalEvent.clientX, y: e.originalEvent.clientY
        });
      });
    });
  }
};
