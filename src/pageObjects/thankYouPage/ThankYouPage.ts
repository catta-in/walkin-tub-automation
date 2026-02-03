import { Page, Locator } from '@playwright/test'
import { BasePage } from '../base/BasePage'

export default class ThankYouPage extends BasePage {
    constructor(page: Page) {
        super(page, 'Thank You Page')
    }

    get header(): Locator {
        return this.page.locator('h1.heroThankYou__hdr')
    }

    async getHeaderText(): Promise<string> {
        return (await this.header.textContent()) || ''
    }

    async waitForPageLoad(): Promise<void> {
        await this.header.waitFor({ state: 'visible', timeout: 10000 })
    }
}