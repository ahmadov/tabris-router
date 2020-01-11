import { NavigationView, contentView, app } from 'tabris';
import { shared } from 'tabris-decorators';
import { Route } from './Route';
import RouterError from './RouterError';
import { Presenter } from '../presenter/Presenter';

@shared
export class Router {
    private navigationView: NavigationView = null;
    private routes: Map<string, Route> = new Map();
    private history: string[] = [];
    private currentPresenter: Presenter = null;

    constructor() {
        this.navigationView = new NavigationView({
            layoutData: 'stretch'
        });
        contentView.append(this.navigationView);
    }

    public initialize(items: Route[] = [], defaultRouteName?: string) {
        this.initializeItems(items);
        if (defaultRouteName) {
            this.go(defaultRouteName);
        }
    }

    public append(routeName: string) {
        this.navigate(routeName);
        this.history.push(routeName);
    }

    public go(routeName: string) {
        this.navigate(routeName);
        this.history = [routeName];
    }

    public goBack() {
        if (this.history.length > 1) {
            this.history.pop();
            this.navigate(this.history[this.history.length - 1]);
        } else {
            app.close();
        }
    }

    private navigate(routeName: string) {
        if (!this.routes.has(routeName)) {
            throw new RouterError(`Route '${routeName}' does not exist!`);
        }
        this.clearContent();
        this.setContent(this.routes.get(routeName));
    }

    private setContent(route: Route) {
        this.navigationView.drawerActionVisible = route.enableDrawer;
        let contentItems = route.presenter.content();
        contentItems = Array.isArray(contentItems) ? contentItems : [contentItems];
        contentItems.forEach(widget => this.navigationView.append(widget));
        this.currentPresenter = route.presenter;
        if (this.currentPresenter !== null && this.currentPresenter.onAppear) {
            this.currentPresenter.onAppear();
        }
    }

    private clearContent() {
        if (this.currentPresenter !== null && this.currentPresenter.onDisappear) {
            this.currentPresenter.onDisappear();
        }
        this.navigationView.children().forEach(widget => widget.detach());
    }

    private initializeItems(items: Route[] = []) {
        items.forEach(item => {
            if (this.routes.has(item.name)) {
                throw new RouterError(`The name must be unique for each route. Duplicate name: '${item.name}'`);
            }
            this.routes.set(item.name, item)
        });
    }
}
