import { ContentItem } from '../router/RouterItem';

export interface Presenter {
    onAppear?(): void;
    onDisappear?(): void;
}

export abstract class Presenter {
    public abstract component(): ContentItem | ContentItem[];
}
