const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');

let driver;

beforeAll(async () => {
  console.log('Starting Selenium WebDriver with npm-installed chromedriver...');

  // Path otomatis ke chromedriver dari node_modules
  const service = new chrome.ServiceBuilder(chromedriver.path);

  // Inisialisasi driver dengan service
  driver = new Builder()
    .forBrowser('chrome')
    .setChromeService(service) // Menggunakan service dari chromedriver npm
    .build();

  console.log('Selenium WebDriver started with npm-installed chromedriver.');
}, 60000); // Perpanjang timeout untuk beforeAll menjadi 60 detik

afterAll(async () => {
  if (driver) {
    console.log('Closing Selenium WebDriver...');
    await driver.quit();
    console.log('Selenium WebDriver closed.');
  }
}, 60000); // Perpanjang timeout untuk afterAll menjadi 60 detik

async function wait(ms) {
  return await new Promise((resolve) => setTimeout(resolve, ms * 1000));
}

describe('Drama Edit Form Tests with Admin Role', () => {
  const baseUrl = 'http://localhost:3001'; // Ganti dengan URL aplikasi Anda

  // Fungsi login sebelum tes dijalankan
  const loginAsAdmin = async () => {
    await driver.get(`${baseUrl}/login`); // Ganti dengan URL halaman login Anda

    // Isi username/email
    const emailInput = await driver.findElement(By.name('email'));
    await emailInput.sendKeys('akmal.goniyyu.tif422@polban.ac.id'); // Ganti dengan email admin yang valid

    // Isi password
    const passwordInput = await driver.findElement(By.name('password'));
    await passwordInput.sendKeys('*One2tree4'); // Ganti dengan password admin yang valid

    // Klik tombol login
    const loginButton = await driver.findElement(By.css('button[type="submit"]'));
    await loginButton.click();

    // Tunggu hingga login berhasil (misalnya, cek keberadaan elemen tertentu di dashboard)
    await driver.wait(async () => {
      const currentUrl = await driver.getCurrentUrl();
      return currentUrl === `${baseUrl}/`; // Sesuaikan URL halaman utama setelah login
    }, 10000); // Timeout 10 detik

    // Ambil URL saat ini dan pastikan sesuai
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toBe(`${baseUrl}/`); // Sesuaikan dengan elemen di halaman setelah login
  };

  test(
    'Should load edit drama page and display title',
    async () => {
      await loginAsAdmin(); // Login sebagai Admin sebelum mengakses halaman

      // Akses halaman edit drama
      await driver.get(`${baseUrl}/movie-list`); // Sesuaikan dengan URL halaman daftar drama

      // Klik tombol Edit pada drama pertama di daftar
      const editButton = await driver.wait(
        until.elementLocated(By.css('button.btn.btn-sm.btn-primary.me-3')),
        10000
      );
      await editButton.click();

      // Tunggu halaman edit drama muncul
      await driver.wait(async () => {
        const currentUrl = await driver.getCurrentUrl();
        return currentUrl === `${baseUrl}/movie-input`;
      }, 10000);

      // Ambil URL saat ini untuk validasi
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toBe(`${baseUrl}/movie-input`);
    },
    60000 // Timeout per test
  );

  test(
    'Should edit and submit the drama form successfully',
    async () => {
      await loginAsAdmin(); // Login sebagai Admin sebelum mengakses halaman

      // Akses halaman edit drama
      await driver.get(`${baseUrl}/movie-list`); // Sesuaikan dengan URL halaman daftar drama

      // Klik tombol Edit pada drama pertama di daftar
      const editButton = await driver.wait(
        until.elementLocated(By.css('button.btn.btn-sm.btn-primary.me-3')),
        10000
      );
      
      await editButton.click();

      // Tunggu halaman edit drama muncul
      await driver.wait(until.elementLocated(By.css('h2')), 10000);

      // Edit Poster URL
      await wait(2)
      const posterUrlInput = await driver.findElement(By.name('posterUrl'));
      await posterUrlInput.clear();
      await posterUrlInput.sendKeys('https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg');

      // Edit Status
      const statusDropdown = await driver.findElement(By.name('status'));
      await statusDropdown.sendKeys('Ongoing');

      // Edit IMDB Score
      const stars = await driver.findElements(By.css('span[data-index]'));
      if (stars.length >= 4) {
        await stars[4].click(); // Klik pada bintang keempat
      }

      // Edit Total Views
      const totalViewsInput = await driver.findElement(By.name('view'));
      await totalViewsInput.clear();
      await totalViewsInput.sendKeys('2000');

      // Edit Title
      const titleInput = await driver.findElement(By.name('title'));
      await titleInput.clear();
      await titleInput.sendKeys('Updated Drama Title');

      // Edit Director
      const directorInput = await driver.findElement(By.name('director'));
      await directorInput.clear();
      await directorInput.sendKeys('Jane Doe');

      // Edit Year
      const yearInput = await driver.findElement(By.name('year'));
      await yearInput.clear();
      await yearInput.sendKeys('2024');

      // Edit Country
      const countrySelect = await driver.findElement(By.css('.basic-multi-select.country-dropdown input'));
      await countrySelect.clear();
      await countrySelect.sendKeys('Thailand');
      await driver.sleep(1000); // Tunggu dropdown muncul
      await countrySelect.sendKeys('\n');

      // Edit Synopsis
      const synopsisInput = await driver.findElement(By.name('synopsis'));
      await synopsisInput.clear();
      await synopsisInput.sendKeys('This is an updated synopsis.');

      // Edit Availability
      const availabilityDropdown = await driver.findElement(By.name('availability'));
      await availabilityDropdown.sendKeys('Hulu');

      // Edit Genres
      const genreLabels = await driver.findElements(By.css('.form-check-label'));
      for (const label of genreLabels) {
        const text = await label.getText();
        if (text === 'Tv movie') {
          const checkbox = await label.findElement(By.xpath('preceding-sibling::input'));
          await checkbox.click();
          break;
        }
      }

      // Edit Actor Role
      const actorRoleInput = await driver.findElement(By.css('.selected-actors input'));
      await actorRoleInput.clear();
      await actorRoleInput.sendKeys('Anjay');

      // Edit Trailer URL
      const trailerInput = await driver.findElement(By.name('trailer'));
      await trailerInput.clear();
      await trailerInput.sendKeys('https://www.youtube.com/watch?v=As-vKW4ZboU');

      // Edit Awards
      const awardsSelect = await driver.findElement(By.css('.basic-multi-select.award-dropdown input'));
      await awardsSelect.clear();
      await awardsSelect.sendKeys('Best Production Design');
      await driver.sleep(1000); // Tunggu dropdown muncul
      await awardsSelect.sendKeys('\n');

      // Edit Background URL
      const backgroundUrlInput = await driver.findElement(By.name('backgroundUrl'));
      await backgroundUrlInput.clear();
      await backgroundUrlInput.sendKeys('https://image.tmdb.org/t/p/w1280/fypydCipcWDKDTTCoPucBsdGYXW.jpg');

      // Klik Submit
      const submitButton = await driver.findElement(By.css('.submit-button'));
    await driver.executeScript("arguments[0].scrollIntoView(true);", submitButton);
    await submitButton.click();

      // Tunggu hingga navigasi ke halaman /movie-list
      await driver.wait(async () => {
        const currentUrl = await driver.getCurrentUrl();
        return currentUrl === `${baseUrl}/movie-list`;
      }, 10000);

      // Ambil URL saat ini untuk validasi
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toBe(`${baseUrl}/movie-list`);
    },
    60000 // Timeout per test
  );
});
