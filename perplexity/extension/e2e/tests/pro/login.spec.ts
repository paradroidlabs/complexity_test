import { AuthPage } from "~/e2e/pages/auth.page";
import { HomePage } from "~/e2e/pages/home.page";
import { test } from "~/e2e/tests/pro/context.fixtures";

test.describe("Pro user login", () => {
  test("should be logged in as a Pro user", async ({ page }) => {
    const authPage = new AuthPage(page);
    await authPage.verifyIsLoggedIn(true);
  });

  test("should load home page for logged-in Pro user", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.load();
    await homePage.verifyHomepageLoad();
  });
});
