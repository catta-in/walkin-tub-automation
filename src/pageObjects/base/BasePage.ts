import { Page } from '@playwright/test'
import { Base } from './Base'

export abstract class BasePage extends Base {
    protected _url = ''
    protected _baseUrl = ''

    protected constructor(page: Page, pageName: string) {
        super(page, pageName)
    }

    get url(): string {
        return this._url
    }

    public async navigate(url?: string): Promise<void> {
        const targetUrl = url || `${this._baseUrl}${this._url}`
        await this.page.goto(targetUrl, {
            timeout: 60000,
            waitUntil: 'domcontentloaded'
        })
        await this.waitLoaded(10000)
    }

    public async close(): Promise<void> {
        return this.page.close()
    }
}