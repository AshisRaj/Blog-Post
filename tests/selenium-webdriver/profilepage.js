const { By } = require('selenium-webdriver');
var BasePage = require('./basepage');
const assert = require("assert");

class ProfilePage extends BasePage {
    async go() {
        await this.go_to_url(baseURL + '/profile');
    }
    async is_displayed() {
        assert.equal(true, await driver.findElement(By.id("profile_heading")).isDisplayed());
    }
    async profile_fields_present() {
        assert.equal(true, await driver.findElement(By.id("email")).isDisplayed());
        assert.equal(true, await driver.findElement(By.id("username")).isDisplayed());
    }
    async enter_valid_fields() {
        await this.enterTextById('email', 'asdf.asdf@example.com');
        await this.enterTextById('firstname', 'ashis');
        await this.enterTextById('lastname', 'raj');
        await this.enterTextById('age', '25');
        await this.enterTextById('lastname', 'raj');
        await this.clickById('active_Male');
        await this.enterTextById('website', 'https://example.com');
        await this.clickById('update_profile');
    }
}

module.exports = ProfilePage;