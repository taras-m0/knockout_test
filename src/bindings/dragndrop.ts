import * as ko from "knockout";
import {ObservableArray} from "knockout";
import './dragndrop.sass'

type TPosition = { x: number, y: number };

function disableSelect(event) {
  event.preventDefault();
}

function isIntersection(element1:HTMLElement, element2:HTMLElement): boolean {
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();

  return ((rect1.left <= rect2.left && rect1.right >= rect2.left) ||
    (rect1.right >= rect2.right && rect1.left <= rect2.right) ||
    ( rect1.left >= rect2.left && rect1.right <= rect2.right))
    &&
    ((rect1.top <= rect2.top && rect1.bottom >= rect2.top) ||
      (rect1.bottom >= rect2.bottom && rect1.top <= rect2.bottom) ||
      ( rect1.top >= rect2.top && rect1.bottom <= rect2.bottom))
}

const dragNDrop = new class {
  dragElement: HTMLElement;
  origElement: HTMLElement;

  offsetPosition: TPosition = { x: 0, y: 0 };

  dragNamespace: string;
  dragModel: any;

  dragStart(element: HTMLElement, mousePosition: TPosition, namespace: string, viewModel: any): void {
    this.origElement = element;
    this.dragNamespace = namespace;
    this.dragModel = viewModel;

    const originElement = $('.draggable-origin', element).length > 0 ? $('.draggable-origin', element).get(0) : element
    const offset = $(originElement).offset();

    const copyEl = $( originElement ).clone(false).appendTo('body')
      .height($(originElement).height()).width($(originElement).width()).css({
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
    if(!this.dragElement){
      return
    }

    $(this.dragElement).fadeOut(300, function (){
      $(this).remove();
    });

    $(this.origElement).css({ filter: 'none'});

    window.removeEventListener('selectstart', disableSelect);

    const dropElement = $(`.drop-element-${this.dragNamespace}.drop-intersect:first`).get(0);
    if(!dropElement){ return; }

    const dragData = $(this.origElement).data('dragData');
    const dropData = $(dropElement).data('dropData');
    if(dropData && dragData){
      const dropIndex = $(`.drop-element-${this.dragNamespace}`, $(dropElement).parent()).index(dropElement);
      const dragIndex = dragData.list.indexOf(dragData.model);

      if(dropData() !== dragData.list()){
        dragData.list.remove(dragData.model);
        dropData.splice(dropIndex, 0, dragData.model);
      } else if(!((dropIndex == dragIndex) || (dropIndex == dragIndex + 1))){
        dragData.list.remove(dragData.model);
        dropData.splice(dropIndex - (dragIndex < dropIndex ? 1 : 0), 0, dragData.model);
      }
    }
  }

  mouseMove(e: MouseEvent){
    if(!this.dragElement){
      return
    }

    $(this.dragElement).offset({
      top: e.clientY - this.offsetPosition.y,
      left: e.clientX - this.offsetPosition.x
    });

    $(`.drop-element-${this.dragNamespace}`).each((indx, dropEl) =>{
      if(isIntersection(dropEl, this.dragElement)){
        $(dropEl).addClass('drop-intersect');
        return false;
      }
    });

    $('.drop-element.drop-intersect:not(:first)').removeClass('drop-intersect');
    $('.drop-element.drop-intersect').each((indx, dropEl) =>{
      if(!isIntersection(dropEl, this.dragElement)){
        $(dropEl).removeClass('drop-intersect');
      }
    });
  }
}

window.addEventListener('mouseup', dragNDrop.mouseUp.bind(dragNDrop));
window.addEventListener('mousemove', dragNDrop.mouseMove.bind(dragNDrop));


ko.bindingHandlers.draggable = {
  init: function (element: HTMLElement, valueAccessor: () => ObservableArray, allBindings, viewModel, bindingContext ): void  {

    $(element).data('dragData', { list: valueAccessor().list, model: bindingContext.$data });
    Promise.resolve().then(() => {
      $('.icon-draggable:first', element).on('mousedown', function (e) {
        dragNDrop.dragStart(element, {
          x: e.originalEvent.clientX, y: e.originalEvent.clientY
        }, valueAccessor().namespace, bindingContext.$data);

        return true;
      });
    });
  }
};

ko.bindingHandlers.drop = {
  init: function (element: HTMLElement, valueAccessor: () => ObservableArray, allBindings, viewModel, bindingContext ): void  {

    Promise.resolve().then(() => {
      $(element).children().each(function (indx){
        $(`<div class="drop-element drop-element-${valueAccessor().namespace}"></div>`)
          .data( 'dropData', valueAccessor().list).insertBefore(this);
      });

      $(`<div class="drop-element drop-element-${valueAccessor().namespace}"></div>`)
        .data( 'dropData', valueAccessor().list).appendTo(element);

      const observer = new MutationObserver((records) => {
        records.forEach((record) => {
          record.addedNodes.forEach((addedNode) => {
            if(addedNode.nodeType == 1){
              if(!$(addedNode).hasClass('drop-element')) {
                Promise.resolve().then(() => {
                  $(`<div class="drop-element drop-element-${valueAccessor().namespace}"></div>`)
                    .data('dropData', valueAccessor().list).insertBefore(addedNode);
                  $(`<div class="drop-element drop-element-${valueAccessor().namespace}"></div>`)
                    .data('dropData', valueAccessor().list).insertAfter(addedNode);
                  $(`<div class="drop-element drop-element-${valueAccessor().namespace}"></div>`)
                    .data('dropData', valueAccessor().list).prependTo(element);
                });
              }
            }
          })
        });

        $(`.drop-element-${valueAccessor().namespace} + .drop-element-${valueAccessor().namespace}`).remove();
      });

      observer.observe(element, {
        childList: true,
      });
    });
  }
};
