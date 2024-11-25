const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const chromedriver = require("chromedriver");

let driver;

beforeAll(async () => {
  const service = new chrome.ServiceBuilder(chromedriver.path);
  driver = new Builder().forBrowser("chrome").setChromeService(service).build();
}, 60000);

afterAll(async () => {
  if (driver) await driver.quit();
}, 60000);

describe("Drama Delete Tests with Admin Role", () => {
  const baseUrl = "http://localhost:3001"; // Ganti dengan URL aplikasi Anda

  const loginAsAdmin = async () => {
    await driver.get(`${baseUrl}/login`);
    await driver.findElement(By.name("email")).sendKeys("akmal.goniyyu.tif422@polban.ac.id");
    await driver.findElement(By.name("password")).sendKeys("*One2tree4");
    await driver.findElement(By.css('button[type="submit"]')).click();

    await driver.wait(async () => (await driver.getCurrentUrl()) === `${baseUrl}/`, 10000);
  };

  test(
    "Should delete a drama successfully",
    async () => {
      await loginAsAdmin();

      // Akses halaman daftar drama
      await driver.get(`${baseUrl}/movie-list`);

      // Tunggu elemen daftar drama dimuat
      await driver.wait(until.elementLocated(By.css("table")), 10000);

      // Temukan tombol Trash pada baris pertama tabel
      const dramaRow = await driver.findElement(By.css("table tbody tr:first-child"));
      const dramaTitle = await dramaRow.findElement(By.className("title-column")).getText(); // Kolom kedua adalah judul

      const deleteButton = await dramaRow.findElement(By.css("button.btn-danger"));

      // Klik tombol Trash
      await deleteButton.click();

      // Tunggu modal konfirmasi muncul dan klik tombol Trash di modal
      const confirmModal = await driver.wait(
        until.elementLocated(By.xpath("//div[contains(@class, 'modal') and contains(., 'Confirm Delete')]")),
        5000
      );
      const confirmButton = await driver.wait(
        until.elementLocated(By.css("div.modal-footer button.btn.btn-danger")),
        5000 // Waktu tunggu hingga tombol ditemukan
      );
      await confirmButton.click();
      

      // Tunggu proses penghapusan selesai (dengan memastikan tabel diperbarui)
      await driver.sleep(2000); // Opsional: Tunggu animasi modal selesai

      // Validasi bahwa drama tidak lagi ada di daftar
      const updatedTableRows = await driver.findElements(By.css("table tbody tr"));
      let dramaStillExists = false;

      for (const row of updatedTableRows) {
        const title = await row.findElement(By.css("td:nth-child(2)")).getText();
        if (title === dramaTitle) {
          dramaStillExists = true;
          break;
        }
      }

      expect(dramaStillExists).toBe(false);
    },
    60000 // Timeout per test
  );
});
