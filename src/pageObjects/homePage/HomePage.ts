import { Page } from '@playwright/test'
import { BasePage } from '../base/BasePage'
import { WalkInTubFormWizard } from './components/WalkInTubFormWizard'
import ThankYouPage from '../thankYouPage/ThankYouPage'

export default class HomePage extends BasePage {
    public readonly form1: WalkInTubFormWizard
    public readonly form2: WalkInTubFormWizard

    constructor(page: Page) {
        super(page, 'Home Page')
        this.form1 = new WalkInTubFormWizard(this.page, 1)
        this.form2 = new WalkInTubFormWizard(this.page, 2)
    }

    async navigateToPage(url?: string): Promise<void> {
        if (url) {
            await this.page.goto(url)
        } else if (this._baseUrl && this._url) {
            await this.page.goto(`${this._baseUrl}${this._url}`)
        }
        await this.waitLoaded()
    }

    async waitLoaded(): Promise<void> {
        await this.form1.container.waitFor({ state: 'visible', timeout: 10000 })
    }

    async waitForThankYouPage(): Promise<ThankYouPage> {
        const thankYouPage = new ThankYouPage(this.page)
        await thankYouPage.waitForPageLoad()
        return thankYouPage
    }
}