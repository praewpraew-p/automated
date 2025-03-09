import test, { Page } from "@playwright/test";

const home_url = "https://www.bestwarinticket.com/";
const login_url = "https://www.bestwarinticket.com/myaccount.php";
const zone = "";

test("booking", async ({ page }) => {
  await page.goto(login_url);

  await page.locator('input[name="username"]').fill("praew0010");
  await page.locator('input[name="passwd"]').fill("123456");
  await page.getByRole("button", { name: "LOGIN" }).click();

  await page.goto(home_url);
  await page.getByRole("link", { name: "ซื้อบัตร / Buy Ticket" }).click();

  await page.waitForTimeout(300);
  await selectZone(page);
  await page.waitForTimeout(300);
  await selectSeat(page);
  await clickOnBookingButton(page);
  await page.pause();
});

const selectZone = async (page: Page) => {
  await Promise.all([
    page.evaluate(() => {
      const area = [...document.querySelectorAll("area")].find((el) =>
        el.onclick?.toString().includes(`zone.value='${zone}'`)
      );
      if (area) area.click();
    }),
  ]);
};

const selectSeat = async (page: Page) => {
  const seatLabelHandle = await page.evaluateHandle(() => {
    return [...document.querySelectorAll("input[name='seat[]']")].find(
      (el) => !el.closest("td")?.querySelector("label[aria-pressed='true']")
    )?.nextElementSibling;
  });

  if (seatLabelHandle) {
    const seatLabelElement = seatLabelHandle.asElement();
    if (seatLabelElement) await seatLabelElement.click();
  }
};

const clickOnBookingButton = async (page: Page) => {
  await page
    .getByText(
      "ข้าพเจ้ายอมรับ เงื่อนไขและข้อกำหนด | I Agree To The Terms and Conditions"
    )
    .click();
  await page.getByRole("button", { name: "ไปขั้นตอนถัดไป (CONTINUE)" }).click();
};
