import * as ko from 'knockout';
import './icon.sass';

import IconOpen from './IconOpen.html';
import IconDraggable from './IconDraggable.html';

import Category from "./Category";
import CategoryTemplate from './Category.html';
import './Category.sass';

import Item from "./Item";
import ItemTemplate from './Item.html';
import './Item.sass';


ko.components.register('icon-open', { template: IconOpen });
ko.components.register('icon-draggable', { template: IconDraggable });

ko.components.register('category', { template: CategoryTemplate, viewModel: Category });

ko.components.register('item', { template: ItemTemplate, viewModel: Item });
