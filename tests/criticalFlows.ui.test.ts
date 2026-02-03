import { expect, test } from '@playwright/test'
import HomePage from '../src/pageObjects/homePage/HomePage'

const TEST_DATA = {
    zipCodes: {
        valid1: '82345',
        valid2: '92345',
        sorryFlow: '11111',
        invalid: {
            tooShort: '9234',
            tooLong: '923456',
            alphanumeric: '92a45',
            empty: ''
        }
    },
    users: {
        form1: { name: 'John Doe', email: 'john.doe@example.com', phone: '5551234567' }
    },
    invalidEmails: ['johndoe.com', 'john@', 'john@@example.com', ''],
    validEmail: 'john.doe@example.com',
    invalidPhones: ['123', '1234567890', '23456789012', '234567890a', '', '0123456789'],
    validPhone: '5551234567',
    expectedTexts: {
        thankYou: 'Thank you!',
        sorry: 'Sorry'
    }
} as const

test.describe('Walk-in Tub Form - critical scenarios', () => {
    let homePage: HomePage

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page)
        await homePage.navigate()
    })

    test('TC-01: Form 1 - Complete successful submission flow', async () => {
        await homePage.form1.step1.zipCodeInput.fill(TEST_DATA.zipCodes.valid1)
        await homePage.form1.step1.submitButton.click()

        await homePage.form1.waitForStepTransition(2)
        await homePage.form1.step2.options.independence.click()
        await homePage.form1.step2.options.safety.click()
        await homePage.form1.step2.submitButton.click()

        await homePage.form1.waitForStepTransition(3)
        await homePage.form1.step3.propertyTypes.owned.click()
        await homePage.form1.step3.submitButton.click()

        await homePage.form1.waitForStepTransition(4)
        await homePage.form1.step4.nameInput.fill(TEST_DATA.users.form1.name)
        await homePage.form1.step4.emailInput.fill(TEST_DATA.users.form1.email)
        await homePage.form1.step4.submitButton.click()

        await homePage.form1.waitForStepTransition(5)
        await homePage.form1.step5.phoneInput.fill(TEST_DATA.users.form1.phone)
        await homePage.form1.step5.submitButton.click()

        const thankYouPage = await homePage.waitForThankYouPage()
        const headerText = await thankYouPage.getHeaderText()
        expect(headerText).toBe(TEST_DATA.expectedTexts.thankYou)
    })

    test('TC-02: ZIP code validation - Verify all validation rules', async () => {
        await homePage.form1.step1.zipCodeInput.fill(TEST_DATA.zipCodes.invalid.tooShort)
        await homePage.form1.step1.submitButton.click()
        expect.soft(await homePage.form1.step1.error.isVisible()).toBe(true)

        await homePage.form1.step1.zipCodeInput.fill(TEST_DATA.zipCodes.invalid.tooLong)
        await homePage.form1.step1.submitButton.click()
        expect.soft(await homePage.form1.step1.error.isVisible()).toBe(true)

        await homePage.form1.step1.zipCodeInput.fill(TEST_DATA.zipCodes.invalid.alphanumeric)
        await homePage.form1.step1.submitButton.click()
        expect.soft(await homePage.form1.step1.error.isVisible()).toBe(true)

        await homePage.form1.step1.zipCodeInput.fill(TEST_DATA.zipCodes.invalid.empty)
        await homePage.form1.step1.submitButton.click()
        expect.soft(await homePage.form1.step1.error.isVisible()).toBe(true)

        await homePage.form1.step1.zipCodeInput.fill(TEST_DATA.zipCodes.valid2)
        await homePage.form1.step1.submitButton.click()
        await homePage.form1.waitForStepTransition(2)
    })

    test('TC-03: Sorry flow - Service not available in area', async () => {
        await homePage.form1.step1.zipCodeInput.fill(TEST_DATA.zipCodes.sorryFlow)
        await homePage.form1.step1.submitButton.click()

        await expect(homePage.form1.sorryStep.container).toBeVisible()

        const text = (await homePage.form1.sorryStep.getText()).replace(/\s+/g, ' ').replace(/[\u2018\u2019]/g, "'").trim()
        expect(text).toContain(TEST_DATA.expectedTexts.sorry)

        await homePage.form1.sorryStep.emailInput.fill(TEST_DATA.validEmail)
        await homePage.form1.sorryStep.submitButton.click()

        await expect(homePage.form1.sorryStep.thankYouMessage).toBeVisible()
    })

    test('TC-04: Email validation - Verify email format requirements', async () => {
        await homePage.form1.step1.zipCodeInput.fill(TEST_DATA.zipCodes.valid2)
        await homePage.form1.step1.submitButton.click()

        await homePage.form1.waitForStepTransition(2)
        await homePage.form1.step2.options.independence.click()
        await homePage.form1.step2.submitButton.click()

        await homePage.form1.waitForStepTransition(3)
        await homePage.form1.step3.propertyTypes.owned.click()
        await homePage.form1.step3.submitButton.click()

        await homePage.form1.waitForStepTransition(4)

        await homePage.form1.step4.nameInput.fill(TEST_DATA.users.form1.name)

        for (const invalidEmail of TEST_DATA.invalidEmails) {
            await homePage.form1.step4.emailInput.fill(invalidEmail)
            await homePage.form1.step4.submitButton.click()
            await homePage.form1.step4.waitForEmailInvalid()
            expect.soft(await homePage.form1.step4.isEmailInvalid()).toBe(true)
        }

        await homePage.form1.step4.emailInput.fill(TEST_DATA.validEmail)
        await homePage.form1.step4.submitButton.click()
        await homePage.form1.waitForStepTransition(5)
    })

    test('TC-05: Phone validation - Verify 10-digit requirement', async () => {
        await homePage.form1.step1.zipCodeInput.fill(TEST_DATA.zipCodes.valid1)
        await homePage.form1.step1.submitButton.click()

        await homePage.form1.waitForStepTransition(2)
        await homePage.form1.step2.options.independence.click()
        await homePage.form1.step2.submitButton.click()

        await homePage.form1.waitForStepTransition(3)
        await homePage.form1.step3.propertyTypes.owned.click()
        await homePage.form1.step3.submitButton.click()

        await homePage.form1.waitForStepTransition(4)
        await homePage.form1.step4.nameInput.fill(TEST_DATA.users.form1.name)
        await homePage.form1.step4.emailInput.fill(TEST_DATA.users.form1.email)
        await homePage.form1.step4.submitButton.click()

        await homePage.form1.waitForStepTransition(5)

        for (const invalidPhone of TEST_DATA.invalidPhones) {
            await homePage.form1.step5.phoneInput.fill(invalidPhone)
            await homePage.form1.step5.submitButton.click()
            expect.soft(await homePage.form1.step5.error.isVisible()).toBe(true)
        }

        await homePage.form1.step5.phoneInput.fill(TEST_DATA.validPhone)
        await homePage.form1.step5.submitButton.click()

        const thankYouPage = await homePage.waitForThankYouPage()
        const headerText = await thankYouPage.getHeaderText()
        expect(headerText).toBe(TEST_DATA.expectedTexts.thankYou)
    })
})