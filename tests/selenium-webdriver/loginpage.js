const { By } = require('selenium-webdriver');
var BasePage = require('./basepage');
const assert = require("assert");

class LoginPage extends BasePage {
    async go() {
        await this.go_to_url(baseURL + '/login');
    }
    async enter_valid_fields() {
        await this.enterTextById('username', 'asdf.asdf');
        await this.enterTextById('password', 'Asdf@1234');
        await this.clickById('login');
    }
    async enter_incomplete_fields() {
        await this.enterTextById('username', '');
        await this.enterTextById('password', 'Asdf@1234');
        await this.clickById('login');
    }
    async enter_invalid_fields() {
        await this.enterTextById('username', 'araj');
        await this.enterTextById('password', '!21');
        await this.clickById('login');
    }
    async validation_error_present() {
        assert.equal("The username is required and cannot be empty", await driver.findElement(By.css(".has-error > .help-block")).getText());
    }
    async is_displayed() {
        assert.equal("Sign In", await driver.findElement(By.css(".panel-heading")).getText());
    }
}

module.exports = LoginPage;