import test, { Page } from "@playwright/test";
import { getCurrentTime } from "./helper/helper";

// ก่อนเวลากดต้องรีเฟรชหน้าจอด้วยสักพัก ไม่งั้นเข้าไปแล้วมันจะ lack
const home_url = "https://www.feelfunfest.com/index_maxkybas.html";
const login_url = "https://www.feelfunfest.com/myaccount.php";
const seat_url =
  "https://www.feelfunfest.com/Maxkybas_HeartToHeart_in_Vietnam/step.php";
const zone = "A2";
const time = "";

test("booking", async ({ page }) => {
  await page.goto(login_url);

  await page.locator('input[name="username"]').fill("praew0010");
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
  await selectSeatRightZone(page);
  await clickOnBookingButton(page);
};

const clickOnBuyButton = async (page: Page) => {
  const isSetBookingTime = !!time;
  const clickButton = async () =>
    await page
      .getByRole("link", { name: /Buy Ticket/i })
      .first()
      .click();

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

const selectSeatRightZone = async (page: Page) => {
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

const selectSeatLeftZone = async (page: Page) => {
  const seatHandle = await page.evaluateHandle(() => {
    const row = [...document.querySelectorAll("tr")].filter((el) =>
      el.querySelector("input[name='seat[]']")
    );
    const seatInRow = [...row[1].querySelectorAll("td")].filter((el) =>
      el.querySelector("input[name='seat[]']")
    );
    const seatInput = seatInRow[seatInRow.length - 1].querySelector(
      "input[name='seat[]']"
    );
    if (seatInput) {
      return seatInput.nextElementSibling;
    }
  });

  if (seatHandle) {
    const seatElement = seatHandle.asElement();
    if (seatElement) await seatElement.click();
  }
};

const clickOnBookingButton = async (page: Page) => {
  await page.evaluate(() => {
    const checkbox = document.querySelector("input#checkboxG1");
    if (checkbox instanceof HTMLElement) {
      checkbox.click();
    }
  });
  await page.locator("input[name='SUBMIT']").click();
};

const handleDuplicateBooking = async (page: Page) => {
  while (true) {
    const orderDetail = await page.getByText(/(Order details)/i);
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
