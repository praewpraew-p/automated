// Tips: บัตรนั่งกดรัวๆ ไม่ได้ ต้องค่อยๆ กด กดแล้วรีบ bookingเลย, บัตรยืน จังหวะกดหน้าจ่ายเงินอย่ากดไวเกินไป ต้องรอ 1-1.5 วิก่อน ไม่งั้นจะค้าง

const buynow = () => {
  document.getElementsByClassName("btn-red btn-buynow btn-item")[0].click();
};

const buynowWithEachRound = () => {
  document.querySelector("a[data-button='7853']").click();
};

const membership = () => {
  document.querySelector("input[id='txt_verifycode']").value = "1234";
  document.querySelector("div[id='btn_verifycode']").click();
};

const acceptConditions = () => {
  document.getElementsByClassName("label-checkbox big")[0].click();
  document.getElementsByClassName("btn-solid-round5-blue w-auto")[0].click();
};

const selectRound = () => {
  document.querySelectorAll("select[name='rdId']")[0].options.selectedIndex = 1; // DAY1
  document.querySelectorAll("select[name='rdId']")[0].options.selectedIndex = 2; // DAY2
  document
    .querySelectorAll("select[name='rdId']")[0]
    .dispatchEvent(new Event("change"));
};

const selectSitZone = () => {
  document.querySelectorAll("area[href='#fixed.php#B2']")[0].click();
};

const selectStandingZone = () => {
  document.querySelectorAll("area[href='#festival.php#VVIPR']")[0].click();
};

const selectSitSeat = () => {
  document.querySelectorAll("div[class='seatuncheck']")[0].click();
};

const selectStandingSeat = () => {
  document.querySelectorAll("select[name='book_cnt']")[0].value = "1";
  document
    .querySelectorAll("select[name='book_cnt']")[0]
    .dispatchEvent(new Event("change"));
  document.getElementById("booknow").click();
};

const selectSitSeatWithCondition = () => {
  [...document.querySelectorAll("td")]
    .filter(
      (el) =>
        el.title.includes("A") && el.querySelector("div[class='seatuncheck']")
    )[0]
    .click();
};

const selectSitSeatFromRightZone = () => {
  [...document.querySelectorAll("td")]
    .filter((el) => el.querySelector("div[class='seatuncheck']"))
    .slice(-1)[0]
    .click();
};

const selectSitSeatFromRightZoneWithFirstRowCondition = () => {
  [...[...document.querySelectorAll("tr")][0].querySelectorAll("td")]
    .filter((el) => el.querySelector("div[class='seatuncheck']"))[0]
    .click();
};

// Select Seat in Middle Row
const selectSitSeatMiddleRowFromRightZone = () => {
  [
    ...document
      .querySelectorAll("tr")
      [Math.floor(document.querySelectorAll("tr").length) / 2].querySelectorAll(
        "td"
      ),
  ]
    .filter((el) => el.querySelector("div[class='seatuncheck']"))
    .slice(-1)[0]
    .click();
};

const filterOnlySeatUnCheckRow = () => {
  [...document.querySelectorAll("tr")].filter((el) =>
    el.querySelector("td > div[class='seatuncheck']")
  );
};

// Select Seat in Middle Row With Checking Seat Uncheck Row
const selectMiddleSeatOfSeatUnCheckRow = () => {
  [...document.querySelectorAll("tr")]
    .filter((el) => el.querySelector("td > div[class='seatuncheck']"))
    [
      Math.floor(
        [...document.querySelectorAll("tr")].filter((el) =>
          el.querySelector("td > div[class='seatuncheck']")
        ).length / 2
      )
    ].querySelector("td > div[class='seatuncheck']")
    .click();
};

// Select Seat in Middle Row With Checking Seat Uncheck Row from Right Zone
const selectMiddleSeatOfSeatUnCheckRowRightZone = () => {
  [
    ...[...document.querySelectorAll("tr")]
      .filter((el) => el.querySelector("td > div[class='seatuncheck']"))
      [
        Math.floor(
          [...document.querySelectorAll("tr")].filter((el) =>
            el.querySelector("td > div[class='seatuncheck']")
          ).length / 2
        )
      ].querySelectorAll("td > div[class='seatuncheck']"),
  ]
    .slice(-1)[0]
    .click();
};

// Not Working Now
const selectSitSeatNearStage = () => {
  for (let i = 0; i <= 3; i++) {
    [...[...document.querySelectorAll("tr")][i].querySelectorAll("td")]
      .filter((el) => el.querySelector("div[class='seatuncheck']"))[0]
      .click();
  }
};

const booknow = () => {
  document.getElementById("booknow").click();
};

const fillTicketName = () => {
  document.getElementById("txt_firstname_0").value = "Arisara Phongsai";
  document.getElementById("txt_firstname_1").value = "Nudsara Thapana";
  document.getElementById("btn_regnow").click();
  document.getElementsByClassName("fancybox-item fancybox-close")[0].click();
};

const paymentData = () => {
  document.getElementById("check-protect").click();
  document.getElementById("btn_pickup").click();
  document.getElementById("btn_mobile").click();
  document.getElementById("btn_kplus").click();
  document.getElementById("payplus_contact").value = "0621781426";
  document.getElementById("check-agree").click();
  document.getElementById("btn_confirm").click();
};
