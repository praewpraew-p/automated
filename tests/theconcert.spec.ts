import { test, expect, Page, Locator } from "@playwright/test";
import { getCurrentTime } from "./helper/helper";

const url1 = "https://www.theconcert.com/concert/4051";
const url2 = "https://www.theconcert.com/concert/4035";
const zone_prebook = "A2";
const zone = "SF-1 :";
const ticketAmount = "4";
const ticketPrice_prebook = "6,500";
const ticketPrice = "2,019";
const isSetBookingTime = true;
const bookingtTime = "09:59:59";

test("booking ticket", async ({ page }) => {
  await signin(page, url1);
  await clickingBuyButton(page, false, bookingtTime, ticketPrice_prebook);
  await selectZoneAndSeat(page, zone_prebook, ticketAmount);
  await page.waitForTimeout(3000);

  await page.goto(url2);
  await clickingBuyButton(page, isSetBookingTime, bookingtTime, ticketPrice);
  await selectZoneAndSeat(page, zone, ticketAmount);
  await managePayment({ page });
});

async function signin(page: Page, url: string) {
  await page.goto(url);
  await page.getByRole("button", { name: "ยอมรับ" }).click();
  await signinByEmail({ page });
}

async function signinByPhone({ page }) {
  await page.getByText("เข้าสู่ระบบหรือลงทะเบียน").click({ force: true });
  await page
    .getByRole("textbox", { name: "เบอร์โทรศัพท์มือถือ" })
    .fill("0959267625");
  await page.getByPlaceholder("รหัสผ่าน").fill("p0837968799");
  await validateCaptcha({ page });
  await page
    .getByRole("button", { name: "เข้าสู่ระบบ" })
    .click({ force: true });
}

async function signinByEmail({ page }) {
  await page.getByText("เข้าสู่ระบบหรือลงทะเบียน").click({ force: true });
  await page.getByRole("link", { name: "อีเมล" }).click();
  await page.getByPlaceholder("อีเมล").fill("be.arisspx@gmail.com");
  await page.getByPlaceholder("รหัสผ่าน").fill("p0837968799");
  await validateCaptcha({ page });
  await page
    .getByRole("button", { name: "เข้าสู่ระบบ" })
    .click({ force: true });
}

async function validateCaptcha({ page }) {
  await page.pause();
}

async function clickingBuyButton(
  page: Page,
  isSetBookingTime: boolean,
  time: string,
  ticketPrice: string
) {
  const dialog = page.getByRole("button", { name: "เข้าสู่ระบบ" });
  await expect(dialog).not.toBeVisible();

  if (isSetBookingTime) {
    while (true) {
      const currentTime = getCurrentTime();
      if (currentTime === time) {
        await page
          .getByRole("button", { name: "ซื้อบัตร" })
          .nth(1)
          .click({ force: true });
        break;
      }

      await page.waitForTimeout(500);
    }
  } else {
    await page
      .getByRole("button", { name: "ซื้อบัตร" })
      .nth(1)
      .click({ force: true });
  }
}

async function selectZoneAndSeat(
  page: Page,
  zone: string,
  ticketAmount: string
) {
  const regex = new RegExp(`${zone}`, "i");
  await page.waitForTimeout(2000);
  await page.locator("span.zone-name", { hasText: regex }).first().click();

  const seatSelectedElement = await page.getByText(
    `ราคารวม x${ticketAmount} ใบ`
  );

  await selectSeat(page, seatSelectedElement);

  const warningModal = await page.locator(".box-warning");
  if (await warningModal.isVisible()) {
    await page
      .getByRole("dialog", {
        name: "ยินดีด้วย คุณได้ลงทะเบียนเรียบร้อยแล้ว complete",
      })
      .locator("i")
      .click();
  }

  await expect(warningModal).not.toBeVisible();
  await page.getByRole("button", { name: "ชำระเงิน" });
}

async function selectSeat(page: Page, seatSelectedElement: Locator) {
  while (true) {
    const elements = await page.locator(
      "text[style*='cursor: pointer'] > tspan[dy*='.']"
    );
    const count = await elements.count();

    if (count === 0) {
      await page.waitForTimeout(300);
      continue;
    }

    // for (let i = count - 1; i >= 0; i--) clicking from back to front
    for (let i = 0; i < count; i++) {
      const element = page.locator(
        `text[style*='cursor: pointer'] > tspan[dy*='.'] >> nth=${i}`
      );

      const elementHandle = await element.elementHandle();
      if (elementHandle) {
        try {
          await element.click();

          const duplicateSeatModal = await page.getByRole("heading", {
            name: "ที่นั่งนี้ถูกจองไปแล้ว",
          });
          if (await duplicateSeatModal.isVisible()) {
            await page.getByRole("button", { name: "OK" }).locator("i").click();
          }
          const warningModal = await page.locator(".box-warning");
          if (await warningModal.isVisible()) {
            await page
              .getByRole("dialog", {
                name: "ยินดีด้วย คุณได้ลงทะเบียนเรียบร้อยแล้ว complete",
              })
              .locator("i")
              .click();
          }

          if (await seatSelectedElement.isVisible()) {
            return;
          }

          break;
        } catch (error) {
          console.error(`Error clicking on element`, error);
        }
      } else {
        console.log(`Element at index ${i} is no longer attached.`);
      }
    }
  }
}

async function managePayment({ page }) {
  await page.locator("text=สรุปรายการสั่งซื้อ").waitFor({ state: "visible" });
  const ticketProtect = await page
    .getByText("ต้องการรับ บริการคุ้มครองตั๋วการแสดง")
    .first();
  if (ticketProtect.isVisible()) {
    await page.locator(".checkmark").first().click();
  }
  await page.locator("#head_promptpay").click();
  await page
    .locator("text=ชำระผ่านช่องทางพร้อมเพย์")
    .waitFor({ state: "visible" });
  await page.waitForTimeout(2000);
  await page
    .getByRole("button", { name: "ยืนยันชำระเงิน" })
    .click({ force: true });
  await page.pause();
}
