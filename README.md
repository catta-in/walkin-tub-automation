# Walk-in Tub Automation Testing
 
Playwright-based automated testing solution for a walk-in tub project.
 
## Installation
 
**Prerequisites:**
- Node.js 18+
- npm 9+
 
**Setup:**
 
```bash
# Clone the repository
git clone <repository-url>
cd <project-directory>
 
# Install dependencies
npm install
 
# Install Playwright browsers (if not already installed)
npx playwright install
```
 
## Running Tests
 
```bash
# Run all tests
npx playwright test
 
# Run tests in headed mode
npx playwright test --headed
 
# Run specific test file
npx playwright test tests/criticalFlows.ui.test.ts
 
# Run with UI mode (interactive)
npx playwright test --ui
 
# Debug mode
npm run test:debug
```
 
## Complete Test Scenario List
 
1. **Happy Path - Minimal selections on Step 2** (at least 1 option selected)
2. **Happy Path - All options selected on Step 2** (all 4 checkboxes)
3. **ZIP Code Validation** - 5-digit requirement (too short, too long, alphanumeric, empty)
4. **Sorry Flow - Complete** - Out-of-service area (ZIP 11111) + email submission form
5. **Email Validation - Step 4** - HTML5 format validation
6. **Phone Validation - Step 5** - 10-digit requirement
7. **Home Page Verification** - Texts, elements, videos, and layout validation
8. **Property Type Rejection** - Rental/Mobile Home should show error
9. **Step 2 Validation** - Nothing selected should allow progression
10. **Step 3 Validation** - Nothing selected should prevent progression
11. **Name Validation - Step 4** - Required field validation
12. **Step 3 - Change Radio Selection** - Can switch between Owned/Rental/Mobile
13. **Step 2 - Toggle Checkboxes** - Can select/unselect options multiple times
14. **Form Interconnection** - Start in Form 2, switch to Form 1 (fills both simultaneously)
15. **Thank You Page Content** - Verify all expected text/elements appear
16. **Progress Bar Display** - Shows correct step indicators and percentage
17. **Step 2 - Single Option Selected** - Each option individually tested (Independence, Safety, Therapy, Other)
18. **Email Format Edge Cases** - Spaces, special characters, international domains
19. **ZIP Code Service Area Boundaries** - Edge cases near sorry flow boundary
20. **Form Reset Behavior** - Refresh page, form state handling
21. **Browser Back Button** - Navigation handling during multi-step flow
22. **Thank You Page - Call Timeline** - "within 10 minutes" text verification
23. **Logo Accreditation Display** - All partner logos appear on thank you page
24. **Mobile Responsiveness** - Form displays correctly on mobile (if in scope)
25. **Keyboard Navigation** - Tab through form, Enter to submit
26. **Field Character Limits** - Name, email max lengths
27. **Copy/Paste Validation** - Pasted content validated same as typed
 
## Prioritization Logic
 
- **TC-01 (Happy Path - Form 1)**: Main business flow - validates entire flow works end-to-end
- **TC-02 (Happy Path - Form 2)**: Ensures both identical forms function independently (catches form isolation bug)
- **TC-03 (ZIP Validation)**: First user interaction + service area detection logic (without it the funnel breaks)
- **TC-04 (Sorry Flow)**: Complete alternative journey - business critical for out-of-area lead capture
- **TC-05 (Email Validation)**: HTML5 validation mechanism (important to contact customers)
- **TC-06 (Phone Validation)**: NANP compliance + 10-digit requirement (again to contact customers)
 
## Defects Found
 
### **1. Form 2 Jumps to Form 1 After ZIP Input (BUG-001)**
**Severity:** High  
**Description:** When user interacts with Form 2 (second form instance on page) and submits ZIP code in Step 1, the form navigation jumps to Form 1 instead of continuing in Form 2. This breaks form isolation and creates confusing UX.  
**Expected:** Form 2 should remain independent, progressing through its own steps  
**Actual:** After ZIP submission in Form 2, Step 2 displays in Form 1  
**Impact:** Users starting with Form 2 are forcefully redirected, potentially losing context
 
### **2. No Back Navigation in Form (BUG-002)**
**Severity:** High  
**Description:** Form lacks "Back" or "Previous" buttons, preventing users from correcting data entered in previous steps. Users must refresh the page and start over if they make a mistake.  
**Expected:** Back button available on steps 2-5 to allow navigation to previous steps  
**Actual:** No back navigation mechanism exists  
**Impact:** Poor user experience, increased form abandonment, data loss on corrections
 
### **3. Browser Back Button Doesn't Work (BUG-003)**
**Severity:** High  
**Description:** Browser's native back button does not navigate to previous form steps. Instead, it exits the form entirely or has no effect.  
**Expected:** Browser back button should navigate through form steps as history states  
**Actual:** Back button either exits form or does nothing  
**Impact:** Standard browser behavior broken, frustrating user experience
 
### **4. Thank You Page Has No Return Path (BUG-004)**
**Severity:** Medium  
**Description:** After successful form submission and landing on Thank You page, there is no way to return to the home page or navigate elsewhere. No links, buttons, or navigation elements provided.  
**Expected:** Thank You page should have "Return to Home" or similar navigation option  
**Actual:** User is stuck on Thank You page with no navigation options  
**Impact:** Dead-end user flow, forces manual URL entry or browser history
 
### **5. Sorry Flow Progress Bar Shows Incomplete Text (BUG-005)**
**Severity:** Low  
**Description:** At the end of sorry flow (out-of-service ZIP → email submission), the progress bar displays "1 of  " with missing total count, appearing unfinished and unprofessional.  
**Expected:** Progress bar should either display "1 of 1" or be hidden in sorry flow  
**Actual:** Shows incomplete text "1 of  " with trailing space  
**Impact:** Visual bug, gives impression of incomplete or broken implementation
 
### **6. Property Type Rejection Not Working (BUG-006)**
**Severity:** High  
**Description:** Selecting "Rental" or "Mobile Home" property types should display rejection message: "Unfortunately, we don't install walk-in tubs in rental and mobile homes." However, form allows submission without showing error.  
**Expected:** Error message displayed, user cannot proceed  
**Actual:** Form accepts rental/mobile home selections and allows continuation  
**Note:** DOM contains `data-error-text` attribute with correct message, but validation logic not triggered
 
### **7. Phone Validation Accepts Leading Zero (BUG-007)**
**Severity:** Medium  
**Description:** Phone input field accepts numbers starting with 0 (e.g., '0123456789'), which violates North American Numbering Plan (NANP) rules. Valid US phone numbers cannot start with 0 or 1.  
**Expected:** Form should reject phone numbers starting with 0  
**Actual:** Form accepts '0123456789' as valid  
**Note:** Form correctly rejects leading 1, but inconsistently allows leading 0
 
### **8. Name Field Label Misleading (BUG-008)**
**Severity:** Medium  
**Description:** Name field is labeled simply as "Name" but validation requires full name (first and last name). Users entering only first name receive an error with indication that both first and last names are required.  
**Expected:** Label should read "Full Name" or "First and Last Name" to clearly communicate requirement  
**Actual:** Label says "Name", causing confusion when single-word names are rejected  
**Impact:** User frustration, unclear requirements, increased form abandonment
 
### **9. Inconsistent Error Message Styling (BUG-009)**
**Severity:** Low  
**Description:** Error messages display inconsistently across form fields. Email validation shows a styled message bubble/tooltip under the field, while all other fields (ZIP, phone, name) display plain red text. This creates visual inconsistency and unprofessional appearance.  
**Expected:** All error messages should follow the same visual design pattern  
**Actual:** Email error is bubble-styled, other errors are plain red text  
**Impact:** Inconsistent user experience, looks unfinished or poorly designed
 
## Future Improvements
 
### 1. **Data-Driven Testing with External Data Sources**
- Move test data to JSON/CSV files for easier maintenance
- Implement data providers for scalable parameterized testing
- Add support for environment-specific test data (dev, staging, production)
- **Value:** Easier for non-technical stakeholders to update test scenarios
 
### 2. **Visual Regression Testing**
- Integrate Playwright's screenshot comparison for visual testing
- Add snapshot tests for each step's UI state
- Monitor CSS/styling changes across form steps
- **Value:** Catch unintended visual changes before they reach production
 
### 3. **API-Level Validation**
- Intercept form submission requests to validate payload structure
- Mock backend responses to test edge cases (server errors, timeouts)
- Verify analytics/tracking events fire correctly
- **Value:** Faster feedback loops, more comprehensive validation beyond UI
 
### 4. **Accessibility Testing Integration**
- Add `@axe-core/playwright` for automated WCAG compliance checks
- Verify keyboard navigation paths and focus management
- Test screen reader compatibility with ARIA attributes
- Validate color contrast ratios
- **Value:** Ensure compliance with accessibility standards (ADA, WCAG 2.1)
 
## Project Structure
 
```
.
├── src/
│   └── pageObjects/
│               └── base/
│                   ├── Base.ts
│                   ├── BasePage.ts
│                   └── BaseComponent.ts
│               └── homePage/      
│                   ├── components/   
│                      └── WalkInTubFormWizard.ts            
│                   └── HomePage.ts
│               └── thankYouPage
│                    └──ThankYouPage.ts
├── tests/
│      └── criticalFlows.ui.test.ts
├── playwright.config.ts
├── package.json
├── README.md
└── tsconfig.json
```