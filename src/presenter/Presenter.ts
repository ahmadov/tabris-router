import { ContentItem } from '../router/Route';

export interface Presenter {
    onAppear?(): void;
    onDisappear?(): void;
}

export abstract class Presenter {
    public abstract content(): ContentItem | ContentItem[];
}
