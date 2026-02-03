import { Locator } from '@playwright/test'
import { Base } from './Base'

export abstract class BaseComponent extends Base {
    private readonly _container: Locator

    protected constructor(container: Locator, componentName: string) {
        super(container.page(), componentName)
        this._container = container
        this._name = componentName
        this._waitLoadLocator = this._container
    }

    get container() {
        return this._container
    }
}