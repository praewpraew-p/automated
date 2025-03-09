import test, { expect } from "@playwright/test";

const home_url = "https://www.eventpop.me/";
const queue_url = "https://queue.eventpop.me/prequeue/th/?id=80350";

test("queueing", async ({ page }) => {
  await page.goto(home_url);
  await page.getByRole("button", { name: "That's ok" }).click();
  await page
    .getByRole("link", { name: "Log In / Sign Up", exact: true })
    .click();
  await page.getByLabel("* Email").fill("qqwra.3@gmail.com");
  await page.getByLabel("* Password", { exact: true }).fill("p0837968799");
  await page.getByRole("button", { name: "Log In" }).click();
  await page.waitForTimeout(2000);

  await page.goto(queue_url);

  while (true) {
    try {
      const queueButton = await page.getByRole("link", {
        name: "เข้ารับคิว",
      });
      await queueButton.click();
      await page.waitForTimeout(100);
    } catch (error) {
      await page.pause();
    }
  }
});
