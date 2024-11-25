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

describe('Drama Input Form Tests with Admin Role', () => {
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
      expect(currentUrl).toBe(`${baseUrl}/`);; // Sesuaikan dengan elemen di halaman setelah login
  };

  test(
    'Should load input drama page and display title',
    async () => {
      await loginAsAdmin(); // Login sebagai Admin sebelum mengakses halaman

      await driver.get(`${baseUrl}/movie-input`); // Buka halaman input drama

      const pageTitle = await driver.wait(until.elementLocated(By.css('h2')), 10000).getText();
      expect(pageTitle).toBe('Input Drama');
    },
    60000 // Timeout per test
  );

  test(
    'Should fill and submit the form successfully',
    async () => {
      await loginAsAdmin(); // Login sebagai Admin sebelum mengakses halaman

      await driver.get(`${baseUrl}/movie-input`); // Buka halaman input drama

      // Isi Poster URL
      const posterUrlInput = await driver.findElement(By.name('posterUrl'));
      await posterUrlInput.sendKeys('https://image.tmdb.org/t/p/w500/iEe9RODlNgobupiksZ2vE4TZwUg.jpg');

        await wait(2); // Tunggu 1 detik

      // Pilih Status
      const statusDropdown = await driver.findElement(By.name('status'));
      await statusDropdown.sendKeys('Released');

    // Isi IMDB Score
    // Temukan semua elemen bintang berdasarkan atribut data-index
const stars = await driver.findElements(By.css('span[data-index]'));

// Misalnya, untuk memberikan rating 2.5 (antara bintang kedua dan ketiga)
if (stars.length >= 3) {
    // Klik pada bintang kedua untuk mengatur nilai mendekati 2.5
    await stars[2].click();
} else {
    console.error('Unable to locate enough stars for rating');
}


      // Isi Total Views
      const totalViewsInput = await driver.findElement(By.name('view'));
      await totalViewsInput.sendKeys('1000');

      // Isi Title
      const titleInput = await driver.findElement(By.name('title'));
      await titleInput.sendKeys('Sample Drama Title');

      // Isi Director
      const directorInput = await driver.findElement(By.name('director'));
      await directorInput.sendKeys('John Doe');

      // Isi Year
      const yearInput = await driver.findElement(By.name('year'));
      await yearInput.sendKeys('2023');

      // Pilih Country
            // Pilih Country
const countrySelect = await driver.findElement(By.css('.basic-multi-select.country-dropdown input'));
await countrySelect.sendKeys('China');
await driver.sleep(1000); // Tunggu dropdown muncul
await countrySelect.sendKeys('\n');

      // Isi Synopsis
      const synopsisInput = await driver.findElement(By.name('synopsis'));
      await synopsisInput.sendKeys('This is a test synopsis.');

      // Pilih Availability
      const availabilityDropdown = await driver.findElement(By.name('availability'));
      await availabilityDropdown.sendKeys('Netflix');

      // Pilih Genres
      const genreLabels = await driver.findElements(By.css('.form-check-label')); // Ambil semua elemen label genre
    for (const label of genreLabels) {
      const text = await label.getText(); // Ambil teks dari label
      if (text === 'Horror Sekali') { // Sesuaikan dengan teks genre yang diinginkan
        const checkbox = await label.findElement(By.xpath('preceding-sibling::input')); // Temukan checkbox terkait
        await checkbox.click(); // Klik checkbox
        break;
      }
    }

      // Tambahkan Actor
      const actorInput = await driver.findElement(By.name('searchActor'));
      await actorInput.sendKeys('Leonardo DiCaprio');
      await driver.sleep(1000); // Tunggu hasil pencarian muncul
      const actorSuggestion = await driver.findElement(By.css('.actor-suggestions li'));
      await actorSuggestion.click();

      const actorRoleInput = await driver.findElement(By.css('.selected-actors input'));
      await actorRoleInput.sendKeys('Protagonist');

      // Isi Trailer URL
      const trailerInput = await driver.findElement(By.name('trailer'));
      await trailerInput.sendKeys('https://youtube.com/sample-trailer');



// Pilih Awards
const awardsSelect = await driver.findElement(By.css('.basic-multi-select.award-dropdown input'));
await awardsSelect.sendKeys('Best Director');
await driver.sleep(1000); // Tunggu dropdown muncul
await awardsSelect.sendKeys('\n');


      // Isi Background URL
      const backgroundUrlInput = await driver.findElement(By.name('backgroundUrl'));
      await backgroundUrlInput.sendKeys('https://image.tmdb.org/t/p/w1280/sqfam7wEpmyG9Fx0AdVQYrLcIfy.jpg');

      // Klik Submit
      const submitButton = await driver.findElement(By.css('.submit-button'));
      await submitButton.click();

      // Tunggu respons berhasil
      await driver.wait(async () => {
        const currentUrl = await driver.getCurrentUrl();
        return currentUrl === `${baseUrl}/movie-list`; // Sesuaikan URL halaman "Movies List"
      }, 10000); // Timeout 10 detik
      
      // Ambil URL saat ini untuk validasi
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toBe(`${baseUrl}/movie-list`);
      
    },
    60000 // Timeout per test
  );
});
