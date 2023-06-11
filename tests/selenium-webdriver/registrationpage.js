const { By } = require('selenium-webdriver');
var BasePage = require('./basepage');
const assert = require("assert");

class RegistrationPage extends BasePage {
    async go() {
        await this.go_to_url(baseURL + '/register');
    }
    async enter_valid_fields() {
        await this.enterTextById('username', 'asdf.asdf' + Date.now());
        await this.enterTextById('email', 'asdf.asdf' + Date.now() + '@example.com');
        await this.enterTextById('password', 'Asdf@1234');
        await this.enterTextById('confirm', 'Asdf@1234');
        await this.clickById('register');
    }
    async enter_incomplete_fields() {
        await this.enterTextById('username', '');
        await this.enterTextById('email', 'asdf.asdf' + Date.now() + '@example.com');
        await this.enterTextById('password', 'Asdf@1234');
        await this.enterTextById('confirm', 'Asdf@1234');
        await this.clickById('register');
    }
    async validation_error_present() {
        assert.equal("The username is required and cannot be empty", await driver.findElement(By.css(".has-error > .help-block")).getText());
    }
    async is_displayed() {
        assert.equal("Sign Up", await driver.findElement(By.css(".panel-heading")).getText());
    }
}

module.exports = RegistrationPage;