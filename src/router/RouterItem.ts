import { SearchAction, Page, Action } from 'tabris';
import { Presenter } from '../presenter/Presenter';

export type ContentItem = Page | Action | SearchAction;

export class RouterItem {
    constructor(
        public id: string,
        public presenter: Presenter,
        public enableDrawer: boolean = false
    ) {}
}
