import { expect } from "@playwright/test";

import { languageModels } from "@/plugins/_core/misc/remote-language-models.loader";
import { TEST_ID_SELECTORS } from "@/utils/dom-selectors";
import { sleep } from "@/utils/utils";
import { HomePage } from "~/e2e/pages/home.page";
import { test } from "~/e2e/tests/pro/context.fixtures";

test.describe("Query box", () => {
  test.describe("Language model selector", () => {
    test("should show language model selector", async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.load();

      const languageModelSelector = page.locator(
        `[data-testid="${TEST_ID_SELECTORS.QUERY_BOX.LANGUAGE_MODEL_SELECTOR}"]`,
      );

      await expect(languageModelSelector).toBeVisible();
    });

    test("should show language model selector options", async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.load();

      const languageModelSelector = page.locator(
        `[data-testid="${TEST_ID_SELECTORS.QUERY_BOX.LANGUAGE_MODEL_SELECTOR}"]`,
      );

      await languageModelSelector.click();

      const anthropicOption = page.locator("text=Anthropic");
      await expect(anthropicOption).toBeVisible();
    });

    test("should select language model", async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.load();

      const languageModelSelector = page.locator(
        `[data-testid="${TEST_ID_SELECTORS.QUERY_BOX.LANGUAGE_MODEL_SELECTOR}"]`,
      );

      await languageModelSelector.click();

      const claudeOption = page
        .locator(`text=${languageModels?.[1]?.label}`)
        .first();
      await claudeOption.click();

      await sleep(2000);

      await languageModelSelector.click();

      const gpt4oOption = page
        .locator(`text=${languageModels?.[0]?.label}`)
        .first();
      await gpt4oOption.click();
    });
  });
});
