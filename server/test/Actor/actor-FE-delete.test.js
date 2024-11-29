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

describe('Actor Delete Tests with Admin Role', () => {
    const baseUrl = 'http://localhost:3001'; // Ganti dengan URL aplikasi Anda

    // Fungsi login sebelum tes dijalankan
    const loginAsAdmin = async () => {
        await driver.get(`${baseUrl}/login`); // Ganti dengan URL halaman login Anda

        // Isi username/email
        const emailInput = await driver.findElement(By.name('email'));
        await emailInput.sendKeys('muhammadazharuddinhamid@gmail.com'); // Ganti dengan email admin yang valid

        // Isi password
        const passwordInput = await driver.findElement(By.name('password'));
        await passwordInput.sendKeys('!Azhar2709'); // Ganti dengan password admin yang valid

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

    test('Should delete an actor succesfully', async () => {
        await loginAsAdmin();

        // Akses halaman daftar actor
        await driver.get(`${baseUrl}/manage-actor`);

        // Tunggu elemen daftar actor dimuat
        await driver.wait(until.elementLocated(By.css('table tbody tr')), 10000);

        // Tunggu elemen pagination dimuat
        await driver.wait(until.elementLocated(By.css('a.page-link')), 10000);

        // Temukan tombol "Last Page" menggunakan XPath
        const lastPageButton = await driver.findElement(
            By.xpath("//a[@class='page-link' and contains(., '»')]")
        );

        // Scroll agar elemen terlihat
        await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", lastPageButton);

        // Klik tombol menggunakan JavaScript jika diperlukan
        await driver.executeScript("arguments[0].click();", lastPageButton);

        // Tunggu tabel dimuat ulang
        await driver.wait(until.elementLocated(By.css('table tbody tr')), 10000);

        // Proses penghapusan actor seperti biasa
        const actorRow = await driver.findElement(By.css('table tbody tr:first-child'));
        const deleteButton = await actorRow.findElement(By.css('button.btn-danger'));

        await deleteButton.click();

        const confirmModal = await driver.wait(
            until.elementLocated(By.xpath("//div[contains(@class, 'modal') and contains(., 'Confirm Delete')]")),
            10000
        );
        const confirmButton = await confirmModal.findElement(By.css('div.modal-footer button.btn-danger'));
        await confirmButton.click();

        await driver.wait(until.stalenessOf(confirmModal), 10000);

        const alertTitle = await driver.wait(until.elementLocated(By.css('.swal2-title')), 10000);
        expect(await alertTitle.getText()).toBe('Success');

        const alertDescription = await driver.findElement(By.css('.swal2-html-container'));
        expect(await alertDescription.getText()).toBe('Actor deleted successfully!');

        const alertButton = await driver.findElement(By.css('.swal2-confirm'));
        await alertButton.click();
    },
        60000
    );


    test('Should delete an actor but still had the reference', async () => {
        await loginAsAdmin();

        // Akses halaman daftar actor
        await driver.get(`${baseUrl}/manage-actor`);

        // Tunggu elemen daftar actor dimuat
        await driver.wait(until.elementLocated(By.css('table tbody tr')), 10000);

        // Temukan baris pertama tabel
        const actorRow = await driver.findElement(By.css('table tbody tr:first-child'));
        const actorName = await actorRow.findElement(By.css('td:nth-child(2)')).getText();

        // Temukan tombol Delete
        const deleteButton = await actorRow.findElement(By.css('button.btn-danger'));

        // Klik tombol Delete
        await deleteButton.click();

        // Tunggu modal konfirmasi muncul dan klik tombol konfirmasi
        const confirmModal = await driver.wait(
            until.elementLocated(By.xpath("//div[contains(@class, 'modal') and contains(., 'Confirm Delete')]")),
            10000
        );
        const confirmButton = await confirmModal.findElement(By.css('div.modal-footer button.btn-danger'));
        await confirmButton.click();

        // Tunggu proses penghapusan selesai (modal hilang)
        await driver.wait(until.stalenessOf(confirmModal), 10000);

        // Tunggu 2 detik agar proses penghapusan selesai
        await wait(2);

        // Tunggu alert SweetAlert2 muncul
        const alertTitle = await driver.wait(
            until.elementLocated(By.css('.swal2-title')),
            10000
        );

        // Verifikasi judul alert
        const alertTitleText = await alertTitle.getText();
        expect(alertTitleText).toBe('Failed to delete actor!');

        // Verifikasi deskripsi pesan
        const alertDescription = await driver.findElement(By.css('.swal2-html-container'));
        const alertDescriptionText = await alertDescription.getText();
        expect(alertDescriptionText).toBe('An error occurred while deleting the actor. Please try again later or check relations in the database.');

        // Klik tombol OK untuk menutup alert
        const alertButton = await driver.findElement(By.css('.swal2-confirm'));
        await alertButton.click();
    },
        60000
    );


});