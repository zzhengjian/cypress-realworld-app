import { test, expect } from "@playwright/test";

test.describe("User Sign-up and Login", function () {
  test.beforeEach(async function ({ page, context }) {
    //cy.task("db:seed");
    //await context.clearCookies();
    await page.goto("/");
    await page.evaluate(() => window.localStorage.clear());
  });

  test("should redirect unauthenticated user to signin page", async function ({ page }) {
    await page.goto("/personal");
    await expect(page).toHaveURL("signin");
  });

  test("should redirect to the home page after login", async function ({ page }) {
    await page.goto("/signin");
    await page.getByLabel("Username").fill("Heath93");
    await page.getByLabel("Password").fill("s3cret");
    await page.locator('[data-test="signin-submit"]').click();
    await expect(page).toHaveURL("/");
  });

  test("should remember a user for 30 days after login", async function ({ page }) {
    await page.goto("/signin");
    await page.getByLabel("Username").fill("Heath93");
    await page.getByLabel("Password").fill("s3cret");
    await page.getByLabel("Remember me").check();
    await page.locator('[data-test="signin-submit"]').click();
    await expect(page).toHaveURL("/");
    await page.locator('[data-test="sidenav-signout"]').click();
    await expect(page).toHaveURL("/signin");
  });

  test("should allow a visitor to sign-up, login, and logout", async function ({ page }) {
    await page.goto("/");
    await page.locator('[data-test="signup"]').focus();
    await page.locator('[data-test="signup"]').click();
    expect(await page.locator('[data-test="signup-title"]').textContent()).toBe("Sign Up");

    await page.locator('[data-test="signup-first-name"] input').fill("Bob");
    await page.locator('[data-test="signup-last-name"] input').fill("Ross");
    let username = "PainterJoy" + Math.floor(Math.random() * 100);
    await page.locator('[data-test="signup-username"] input').fill(username);
    await page.locator('[data-test="signup-password"] input').fill("s3cret");
    await page.getByLabel("Confirm Password *").click();
    await page.getByLabel("Confirm Password *").fill("s3cret");
    await page.locator('[data-test="signup-submit"]').click();
    await expect(page).toHaveURL("/signin");
    await page.getByLabel("Username").fill(username);
    await page.getByLabel("Password").fill("s3cret");
    await page.locator('[data-test="signin-submit"]').click();
    await expect(page).toHaveURL("/");

    // Onborading
    await expect(page.locator('[data-test="user-onboarding-dialog"]')).toBeVisible();
    await expect(page.locator('[data-test="list-skeleton"]')).not.toBeVisible();
    await expect(page.locator('[data-test="nav-top-notifications-count"]')).toHaveCount(1);
    await page.locator('[data-test="user-onboarding-next"]').click();
    await expect(page.locator('[data-test="user-onboarding-dialog-title"]')).toHaveText(
      "Create Bank Account"
    );

    await page.locator('[data-test*="bankName-input"] input').fill("The Best Bank");
    await page.locator('[data-test*="accountNumber-input"] input').fill("123456789");
    await page.locator('[data-test*="routingNumber-input"] input').fill("987654321");
    await page.locator('[data-test*="submit"]').click();

    await expect(page.locator('[data-test="user-onboarding-dialog-title"]')).toHaveText("Finished");
    expect(
      await page.locator('[data-test="user-onboarding-dialog-content"]').textContent()
    ).toContain("You're all set!");
    await page.locator('[data-test="user-onboarding-next"]').click();
    await expect(page.locator('[data-test="transaction-list"]')).toBeVisible();

    await page.locator('[data-test="sidenav-signout"]').click();
    await expect(page).toHaveURL("/signin");
  });
});
