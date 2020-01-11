import { SearchAction, Page, Action } from 'tabris';
import { Presenter } from '../presenter/Presenter';

export type ContentItem = Page | Action | SearchAction;

export class Route {
    constructor(
        public name: string,
        public presenter: Presenter,
        public enableDrawer: boolean = false
    ) {}
}
