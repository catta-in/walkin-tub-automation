import { Locator, Page } from '@playwright/test'
import { BaseComponent } from '../../base/BaseComponent'

export class WalkInTubFormWizard extends BaseComponent {
    constructor(page: Page, formIndex: number) {
        const rootLocator = page.locator('[data-form-container]').nth(formIndex - 1)
        super(rootLocator, 'Walk-in Tub Form Wizard')
    }

    get step1() {
        const stepContainer = this.container.locator('.steps.step-1')
        const errorBlock = stepContainer.locator('[data-error-block]')

        return {
            container: stepContainer,
            zipCodeInput: stepContainer.locator('[data-zip-code-input]'),
            submitButton: stepContainer.locator('[data-tracking="btn-step-1"]'),
            error: {
                locator: errorBlock,
                getText: async (): Promise<string> => (await errorBlock.textContent()) || '',
                isVisible: async (): Promise<boolean> => await errorBlock.isVisible()
            },
            isVisible: async (): Promise<boolean> => await stepContainer.isVisible()
        }
    }

    get step2() {
        const stepContainer = this.container.locator('.steps.step-2')
        const form = stepContainer.locator('form[name="why_interested"]')

        return {
            container: stepContainer,
            submitButton: stepContainer.locator('[data-tracking="btn-step-2"]'),
            options: {
                independence: form.locator('label').nth(0),
                safety: form.locator('label').nth(1),
                therapy: form.locator('label').nth(2),
                other: form.locator('label').nth(3)
            },
            isVisible: async (): Promise<boolean> => await stepContainer.isVisible()
        }
    }

    get step3() {
        const stepContainer = this.container.locator('.steps.step-3')
        const form = stepContainer.locator('form[name="type_of_property"]')

        return {
            container: stepContainer,
            submitButton: stepContainer.locator('[data-tracking="btn-step-3"]'),
            propertyTypes: {
                owned: form.locator('label').nth(0),
                rental: form.locator('label').nth(1),
                mobile: form.locator('label').nth(2)
            },
            isVisible: async (): Promise<boolean> => await stepContainer.isVisible()
        }
    }

    get step4() {
        const stepContainer = this.container.locator('.steps.step-4')
        const emailInput = stepContainer.locator('input[name="email"][type="email"]')

        return {
            container: stepContainer,
            nameInput: stepContainer.locator('[data-name-input]'),
            emailInput: emailInput,
            submitButton: stepContainer.locator('[data-tracking="btn-step-4"]'),
            isEmailInvalid: async (): Promise<boolean> => {
                return await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid)
            },
            waitForEmailInvalid: async (timeout = 3000): Promise<void> => {
                await this.page.waitForFunction(
                    (selector) => {
                        const element = document.querySelector(selector) as HTMLInputElement
                        return element && !element.validity.valid
                    },
                    'input[name="email"][type="email"]',
                    { timeout }
                )
            },
            isVisible: async (): Promise<boolean> => await stepContainer.isVisible()
        }
    }

    get step5() {
        const stepContainer = this.container.locator('.steps.step-5')
        const errorBlock = stepContainer.locator('[data-error-block]')

        return {
            container: stepContainer,
            phoneInput: stepContainer.locator('[data-phone-input]'),
            submitButton: stepContainer.locator('[data-tracking="btn-step-5"]'),
            error: {
                locator: errorBlock,
                getText: async (): Promise<string> => (await errorBlock.textContent()) || '',
                isVisible: async (): Promise<boolean> => await errorBlock.isVisible()
            },
            isVisible: async (): Promise<boolean> => await stepContainer.isVisible()
        }
    }

    get sorryStep() {
        const stepContainer = this.container.locator('.steps.step-sorry')

        return {
            container: stepContainer,
            emailInput: stepContainer.locator('[data-email-input]'),
            submitButton: stepContainer.locator('button[type="submit"]'),
            thankYouMessage: stepContainer.locator('[data-sorry-fade-in]'),
            getText: async (): Promise<string> => {
                await stepContainer.waitFor({ state: 'visible', timeout: 10000 })
                const text = await stepContainer.textContent()
                return text || ''
            },
            isVisible: async (): Promise<boolean> => await stepContainer.isVisible()
        }
    }

    async waitForStepTransition(expectedStep: number, timeout = 15000): Promise<void> {
        await this.container.locator(`.steps.step-${expectedStep}`).waitFor({ state: 'visible', timeout })
    }
}