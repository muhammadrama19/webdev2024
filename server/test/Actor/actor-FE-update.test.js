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

describe('Actor Edit Form Tests with Admin Role', () => {
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

    test(
        'Should fill edit actor form and submit',
        async () => {
            await loginAsAdmin(); // Replace with your login function

            await driver.get(`${baseUrl}/manage-actor`); // Navigate to the page

            // Tunggu elemen daftar actor dimuat
            await driver.wait(until.elementLocated(By.css('table tbody tr')), 10000);

            // Temukan baris pertama tabel
            const actorRow = await driver.findElement(By.css('table tbody tr:first-child'));
            const actorName = await actorRow.findElement(By.css('td:nth-child(2)')).getText();

            // Temukan tombol Edit
            const editButton = await actorRow.findElement(By.css('button.btn-primary'));

            // Klik tombol Delete
            await editButton.click();

            // Wait for the modal to appear
            const modal = await driver.wait(
                until.elementLocated(By.css('.modal-dialog')),
                10000
            );
            await driver.wait(until.elementIsVisible(modal), 5000);

            // Locate and fill the "Actor Name" input field
            const actorNameInput = await driver.findElement(By.css('input[name="name"]'));
            await actorNameInput.clear();
            await actorNameInput.sendKeys('Azhar');

            // Locate and fill the "Birth Date" input field
            const birthDateInput = await driver.findElement(By.css('input[name="birthdate"]'));
            await birthDateInput.clear();
            await birthDateInput.sendKeys('27/09/2003'); // Date format should match the input type

            // Locate and fill the "Country" input field
            const countryInput = await driver.findElement(By.css('input[name="country_name"]'));
            await countryInput.clear();
            await countryInput.sendKeys('Indonesia');

            // Locate and fill the "Upload Picture" input field
            const pictureInput = await driver.findElement(By.css('input[name="actor_picture"]'));
            await pictureInput.clear();
            await pictureInput.sendKeys('https://akademik.polban.ac.id/fotomhsrekap/221524018.jpg');

            // Submit the form
            const submitButton = await driver.findElement(By.css('.modal-footer .btn-primary')); // Update selector if needed
            await submitButton.click();

            // Tunggu alert SweetAlert2 muncul
            const alertTitle = await driver.wait(
                until.elementLocated(By.css('.swal2-title')),
                10000
            );

            // Verifikasi judul alert
            const alertTitleText = await alertTitle.getText();
            expect(alertTitleText).toBe('Success');

            // Verifikasi deskripsi pesan
            const alertDescription = await driver.findElement(By.css('.swal2-html-container'));
            const alertDescriptionText = await alertDescription.getText();
            expect(alertDescriptionText).toBe('Changes saved successfully!');

            // Klik tombol OK untuk menutup alert
            const alertButton = await driver.findElement(By.css('.swal2-confirm'));
            await alertButton.click();
        },
        60000
    );

    test(
        'Should fill edit actor form and submit with invalid country',
        async () => {
            await loginAsAdmin(); // Replace with your login function

            await driver.get(`${baseUrl}/manage-actor`); // Navigate to the page

            // Tunggu elemen daftar actor dimuat
            await driver.wait(until.elementLocated(By.css('table tbody tr')), 10000);

            // Temukan baris pertama tabel
            const actorRow = await driver.findElement(By.css('table tbody tr:first-child'));
            const actorName = await actorRow.findElement(By.css('td:nth-child(2)')).getText();

            // Temukan tombol Edit
            const editButton = await actorRow.findElement(By.css('button.btn-primary'));

            // Klik tombol Delete
            await editButton.click();

            // Wait for the modal to appear
            const modal = await driver.wait(
                until.elementLocated(By.css('.modal-dialog')),
                10000
            );
            await driver.wait(until.elementIsVisible(modal), 5000);

            // Locate and fill the "Actor Name" input field
            const actorNameInput = await driver.findElement(By.css('input[name="name"]'));
            await actorNameInput.sendKeys('Azhar');

            // Locate and fill the "Birth Date" input field
            const birthDateInput = await driver.findElement(By.css('input[name="birthdate"]'));
            await birthDateInput.sendKeys('27/09/2003'); // Date format should match the input type

            // Locate and fill the "Country" input field
            const countryInput = await driver.findElement(By.css('input[name="country_name"]'));
            await countryInput.clear();
            await countryInput.sendKeys('Jakarta');

            // Locate and fill the "Upload Picture" input field
            const pictureInput = await driver.findElement(By.css('input[name="actor_picture"]'));
            await pictureInput.sendKeys('https://akademik.polban.ac.id/fotomhsrekap/221524018.jpg');

            // Submit the form
            const submitButton = await driver.findElement(By.css('.modal-footer .btn-primary')); // Update selector if needed
            await submitButton.click();

            // Tunggu alert SweetAlert2 muncul
            const alertTitle = await driver.wait(
                until.elementLocated(By.css('.swal2-title')),
                10000
            );

            // Verifikasi judul alert
            const alertTitleText = await alertTitle.getText();
            expect(alertTitleText).toBe('Oops...');

            // Verifikasi deskripsi pesan
            const alertDescription = await driver.findElement(By.css('.swal2-html-container'));
            const alertDescriptionText = await alertDescription.getText();
            expect(alertDescriptionText).toBe('Country does not exist. Please add the country first!');

            // Klik tombol OK untuk menutup alert
            const alertButton = await driver.findElement(By.css('.swal2-confirm'));
            await alertButton.click();
        },
        60000
    );
});