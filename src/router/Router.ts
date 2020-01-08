import { NavigationView, contentView, app } from 'tabris';
import { shared } from 'tabris-decorators';
import { RouterItem } from './RouterItem';
import RouterError from './RouterError';
import { Presenter } from '../presenter/Presenter';

@shared
export class Router {
    private navigationView: NavigationView = null;
    private routeItems: Map<string, RouterItem> = new Map();
    private history: string[] = [];
    private currentPresenter: Presenter = null;

    constructor() {
        contentView.append(new NavigationView({
            id: 'routerNavigation',
            layoutData: 'stretch'
        }));
    }

    public initialize(items: RouterItem[] = [], defaultRouteId?: string) {
        this.initializeItems(items);
        if (defaultRouteId) {
            this.go(defaultRouteId);
        }
    }

    public append(routeId: string) {
        this.navigate(routeId);
        this.history.push(routeId);
    }

    public go(routeId: string) {
        this.navigate(routeId);
        this.history = [routeId];
    }

    public goBack() {
        if (this.history.length > 1) {
            this.history.pop();
            this.navigate(this.history[this.history.length - 1]);
        } else {
            app.close();
        }
    }

    private navigate(routeId: string) {
        if (!this.routeItems.has(routeId)) {
            throw new RouterError(`Route item '${routeId}' does not exist!`);
        }
        this.clearContent();
        this.setContent(this.routeItems.get(routeId));
    }

    private setContent(routeItem: RouterItem) {
        const navigation = this.getNavigationView();
        navigation.drawerActionVisible = routeItem.enableDrawer;
        let components = routeItem.presenter.component();
        components = Array.isArray(components) ? components : [components];
        components.forEach(component => navigation.append(component));
        this.currentPresenter = routeItem.presenter;
        if (this.currentPresenter !== null && this.currentPresenter.onAppear) {
            this.currentPresenter.onAppear();
        }
    }

    private clearContent() {
        if (this.currentPresenter !== null && this.currentPresenter.onDisappear) {
            this.currentPresenter.onDisappear();
        }
        const navigation = this.getNavigationView();
        navigation.children().forEach(widget => widget.detach());
    }

    private getNavigationView() {
        if (!this.navigationView) {
            this.navigationView = contentView.find(NavigationView).only();
            if (!this.navigationView) {
                throw new Error('No active "NavigationView" could not be found!');
            }
        }
        return this.navigationView;
    }

    private initializeItems(items: RouterItem[] = []) {
        items.forEach(item => this.routeItems.set(item.id, item));
    }
}
