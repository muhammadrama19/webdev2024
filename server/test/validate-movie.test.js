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

describe("Validate Movie Tests", () => {
  const baseUrl = "http://localhost:3001"; // Ganti dengan URL aplikasi Anda

  const loginAsAdmin = async () => {
    await driver.get(`${baseUrl}/login`);
    await driver.findElement(By.name("email")).sendKeys("akmal.goniyyu.tif422@polban.ac.id");
    await driver.findElement(By.name("password")).sendKeys("*One2tree4");
    await driver.findElement(By.css('button[type="submit"]')).click();

    await driver.wait(async () => (await driver.getCurrentUrl()) === `${baseUrl}/`, 10000);
  };

  test(
    "Should approve a movie successfully",
    async () => {
      await loginAsAdmin();

      // Akses halaman validate drama
      await driver.get(`${baseUrl}/validate-drama`);

      // Tunggu elemen daftar drama dimuat
      await driver.wait(until.elementLocated(By.css("table")), 10000);

      // Simpan nama drama yang akan di-approve (untuk validasi nanti)
      const dramaRow = await driver.findElement(By.css("table tbody tr:first-child"));
      const dramaTitle = await dramaRow.findElement(By.className("title-column")).getText(); // Kolom ketiga untuk judul

      const approveButton = await dramaRow.findElement(By.css("button.btn-success"));

      // Klik tombol Approve
      await approveButton.click();

      // Tunggu modal konfirmasi muncul
      const confirmButton = await driver.wait(
        until.elementLocated(By.css("div.modal-footer button.btn-success")),
        5000 // Waktu tunggu hingga tombol ditemukan
      );
      await confirmButton.click();

      // Tunggu hingga drama dihapus dari daftar validate
      await driver.sleep(3000);

      // Validasi bahwa drama tidak lagi ada di daftar validate
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
    "Should reject a movie successfully",
    async () => {
      await loginAsAdmin();

      // Akses halaman validate drama
      await driver.get(`${baseUrl}/validate-drama`);

      // Tunggu elemen daftar drama dimuat
      await driver.wait(until.elementLocated(By.css("table")), 10000);

      // Simpan nama drama yang akan direject (untuk validasi nanti)
      const dramaRow = await driver.findElement(By.css("table tbody tr:first-child"));
      const dramaTitle = await dramaRow.findElement(By.className("title-column")).getText(); // Kolom ketiga untuk judul

      const rejectButton = await dramaRow.findElement(By.css("button.btn-danger"));

      // Klik tombol Reject
      await rejectButton.click();

      // Tunggu modal konfirmasi muncul
      const confirmButton = await driver.wait(
        until.elementLocated(By.css("div.modal-footer button.btn-danger")),
        5000 // Waktu tunggu hingga tombol ditemukan
      );
      await confirmButton.click();

      // Tunggu hingga drama dihapus dari daftar validate
      await driver.sleep(3000);

      // Validasi bahwa drama tidak lagi ada di daftar validate
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
