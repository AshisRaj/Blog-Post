const { By } = require('selenium-webdriver');

class BasePage {
    constructor(driver, baseURL) {
        global.driver = driver;
        global.baseURL = baseURL;
    }
    async go_to_url(theURL) {
        await driver.get(theURL);
    }
    async go() {
        await this.go_to_url(baseURL + path);
    }
    async enterTextByCss(css, searchText) {
        await driver.findElement(By.css(css)).sendKeys(searchText);
    }
    async enterTextById(id, searchText) {
        await driver.findElement(By.id(id)).sendKeys(searchText);
    }
    async clickById(id) {
        await driver.findElement(By.id(id)).click();
    }
    async clickByCss(css) {
        await driver.findElement(By.css(css)).click();
    }
}

module.exports = BasePage;