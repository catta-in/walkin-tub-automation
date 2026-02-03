import { Locator, Page } from '@playwright/test'

export abstract class Base {
    private readonly _page: Page
    protected _name: string
    protected _waitLoadLocator: Locator

    protected constructor(page: Page, name: string) {
        this._page = page
        this._name = name
        this._waitLoadLocator = page.locator('html')
    }

    get page(): Page {
        return this._page
    }

    public async waitLoaded(timeout = 30000): Promise<void> {
        await this._waitLoadLocator.first().waitFor({ state: 'visible', timeout })
    }
}