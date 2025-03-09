import test, { Page } from "@playwright/test";
import { getCurrentTime } from "./helper/helper";

const home_url = "https://www.bestwarinticket.com/";
const login_url = "https://www.bestwarinticket.com/myaccount.php";
const seat_url =
  "https://www.bestwarinticket.com/Tiffany_Young_HereForYou_BKK/step.php";
const zone = "G";
const time = "";

test("booking", async ({ page }) => {
  await page.goto(login_url);

  await page.locator('input[name="username"]').fill("praew0011");
  await page.locator('input[name="passwd"]').fill("123456");
  await page.getByRole("button", { name: "LOGIN" }).click();

  await page.goto(home_url);
  await clickOnBuyButton(page);
  await bookingProgress(page);
  await handleDuplicateBooking(page);
  await page.pause();
});

const bookingProgress = async (page: Page) => {
  await page.waitForTimeout(100);
  await selectZone(page);
  await page.waitForTimeout(250);
  await selectSeat(page);
  await clickOnBookingButton(page);
};

const clickOnBuyButton = async (page: Page) => {
  const isSetBookingTime = !!time;
  const clickButton = async () =>
    await page.getByRole("link", { name: "ซื้อบัตร / Buy Ticket" }).click();

  if (isSetBookingTime) {
    while (true) {
      const currentTime = getCurrentTime();
      if (currentTime === time) {
        await clickButton();
        break;
      }
      await page.waitForTimeout(200);
    }
  } else {
    await clickButton();
  }
};

const selectZone = async (page: Page) => {
  await Promise.all([
    page.evaluate((zoneValue) => {
      const area = [...document.querySelectorAll("area")].find((el) =>
        el.onclick?.toString().includes(`zone.value='${zoneValue}'`)
      );
      if (area) area.click();
    }, zone),
    await page.waitForLoadState("domcontentloaded"),
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

const handleDuplicateBooking = async (page: Page) => {
  while (true) {
    const orderDetail = await page.getByText("รายละเอียดการสั่งซื้อ (Order");
    try {
      if (await orderDetail.isVisible()) {
        break;
      } else {
        await page.goto(seat_url);
        await bookingProgress(page);
      }
    } catch (error) {}
  }
};

const repeatBooking = async (page: Page) => {
  while (true) {
    try {
      await page.goto(seat_url);
      await bookingProgress(page);
    } catch (error) {}
  }
};
