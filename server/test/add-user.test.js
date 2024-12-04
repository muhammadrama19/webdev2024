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

describe("Add User Tests", () => {
  const baseUrl = "http://localhost:3001"; // Ganti dengan URL aplikasi Anda

  const loginAsAdmin = async () => {
    await driver.get(`${baseUrl}/login`);
    await driver
      .findElement(By.name("email"))
      .sendKeys("akmal.goniyyu.tif422@polban.ac.id");
    await driver.findElement(By.name("password")).sendKeys("*One2tree4");
    await driver.findElement(By.css('button[type="submit"]')).click();

    await driver.wait(
      async () => (await driver.getCurrentUrl()) === `${baseUrl}/`,
      10000
    );
  };

  test("Should add a new user successfully", async () => {
    await loginAsAdmin();

    // Akses halaman User Setting
    await driver.get(`${baseUrl}/users`);

    // Tunggu tombol "Add New User" tersedia dan klik
    const addNewUserButton = await driver.findElement(
      By.xpath("//button[contains(text(), 'Add New User')]")
    );
    await addNewUserButton.click();

    // Tunggu modal Add User muncul
    const modalTitle = await driver.wait(
      until.elementLocated(
        By.className(
          ".d-flex align-items-center w-auto px-4 py-2 btn btn-success"
        )
      ),
      5000
    );
    expect(await modalTitle.getText()).toBe("Add New User");

    // Isi form dengan data user baru
    await driver
      .findElement(By.xpath("//input[@placeholder='Enter username']"))
      .sendKeys("newuser123");
    await driver
      .findElement(By.xpath("//input[@placeholder='Enter email']"))
      .sendKeys("newuser123@example.com");
    await driver
      .findElement(By.xpath("//input[@placeholder='Enter password']"))
      .sendKeys("Password@123");
    const roleDropdown = await driver.findElement(
      By.css("select.form-control")
    );
    await roleDropdown.sendKeys("User");

    // Klik tombol Submit
    const confirmButton = await driver.wait(
      until.elementLocated(By.css("div.modal-footer button.btn-danger")),
      5000 // Waktu tunggu hingga tombol ditemukan
    );
    await confirmButton.click();

    // Tunggu Swal muncul
    await driver.sleep(2000); // Tunggu sementara untuk Swal muncul

    // Validasi pesan sukses pada Swal
    const swalMessage = await driver.findElement(By.className("swal2-title"));
    expect(await swalMessage.getText()).toBe("Success");

    // Tunggu tabel user diperbarui
    await driver.sleep(3000);

    // Validasi bahwa user baru muncul di tabel
    const userRows = await driver.findElements(By.css("table tbody tr"));
    let userExists = false;

    for (const row of userRows) {
      const username = await row
        .findElement(By.css("td:nth-child(2)"))
        .getText();
      if (username === "newuser123") {
        userExists = true;
        break;
      }
    }

    expect(userExists).toBe(true);
  });
});
