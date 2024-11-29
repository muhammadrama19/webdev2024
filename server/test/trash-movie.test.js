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

describe("Trash Movie Tests", () => {
  const baseUrl = "http://localhost:3001"; // Ganti dengan URL aplikasi Anda

  const loginAsAdmin = async () => {
    await driver.get(`${baseUrl}/login`);
    await driver.findElement(By.name("email")).sendKeys("akmal.goniyyu.tif422@polban.ac.id");
    await driver.findElement(By.name("password")).sendKeys("*One2tree4");
    await driver.findElement(By.css('button[type="submit"]')).click();

    await driver.wait(async () => (await driver.getCurrentUrl()) === `${baseUrl}/`, 10000);
  };

  const forceClick = async (element) => {
    await driver.executeScript("arguments[0].click();", element);
  };

  test(
    "Should restore a movie from trash",
    async () => {
      await loginAsAdmin();

      // Akses halaman trash
      await driver.get(`${baseUrl}/movie-trash`);

      // Tunggu elemen daftar trash dimuat
      await driver.wait(until.elementLocated(By.css("table")), 10000);

      // Simpan nama drama yang akan di-restore (untuk validasi nanti)
      const dramaRow = await driver.findElement(By.css("table tbody tr:first-child"));
      const dramaTitle = await dramaRow.findElement(By.css("td:nth-child(2)")).getText(); // Kolom kedua untuk judul

      const restoreButton = await dramaRow.findElement(By.css("button.btn-warning"));

      // Klik tombol Restore
      await restoreButton.click();

      // Tunggu modal konfirmasi muncul
      const confirmButton = await driver.wait(
        until.elementLocated(By.css("div.modal-footer button.btn-warning")),
        5000 // Waktu tunggu hingga tombol ditemukan
      );
      await confirmButton.click();

      // Tunggu hingga drama dihapus dari daftar trash
      await driver.sleep(3000);

      // Validasi bahwa drama tidak lagi ada di trash
      const tableRows = await driver.findElements(By.css("table tbody tr"));
      let dramaStillExists = false;

      for (const row of tableRows) {
        const title = await row.findElement(By.css("td:nth-child(2)")).getText();
        if (title === dramaTitle) {
          dramaStillExists = true;
          break;
        }
      }

      expect(dramaStillExists).toBe(false);
    },
    60000
  );

  test(
    "Should permanently delete a movie from trash",
    async () => {
      await loginAsAdmin();

      // Akses halaman trash
      await driver.get(`${baseUrl}/movie-trash`);

      // Tunggu elemen daftar trash dimuat
      await driver.wait(until.elementLocated(By.css("table")), 10000);

      // Simpan nama drama yang akan dihapus permanen (untuk validasi nanti)
      const dramaRow = await driver.findElement(By.css("table tbody tr:first-child"));
      const dramaTitle = await dramaRow.findElement(By.css("td:nth-child(2)")).getText(); // Kolom kedua untuk judul

      const deleteButton = await dramaRow.findElement(By.css("button.btn-danger"));

      // Klik tombol Delete
      await deleteButton.click();

      // Tunggu modal konfirmasi muncul
      const confirmButton = await driver.wait(
        until.elementLocated(By.css("div.modal-footer button.btn-danger")),
        5000 // Waktu tunggu hingga tombol ditemukan
      );
      await confirmButton.click();

      // Tunggu hingga drama dihapus dari daftar trash
      await driver.sleep(3000);

      // Validasi bahwa drama tidak lagi ada di trash
      const tableRows = await driver.findElements(By.css("table tbody tr"));
      let dramaStillExists = false;

      for (const row of tableRows) {
        const title = await row.findElement(By.css("td:nth-child(2)")).getText();
        if (title === dramaTitle) {
          dramaStillExists = true;
          break;
        }
      }

      expect(dramaStillExists).toBe(false);
    },
    60000
  );
});
