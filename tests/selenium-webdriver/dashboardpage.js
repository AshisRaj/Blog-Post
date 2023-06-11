const { By } = require('selenium-webdriver');
var BasePage = require('./basepage');
const assert = require("assert");

class DashboardPage extends BasePage {
    async go() {
        await this.go_to_url(baseURL + '');
    }
    async is_displayed() {
        assert.equal(true, await driver.findElement(By.id("dashboard")).isDisplayed());
    }
    async create_valid_post() {
        await this.clickById('add_new_post_link');
        await this.enterTextById('title', 'some title' + Date.now());
        await this.enterTextById('description', 'some description' + Date.now());
        await this.enterTextById('body', 'some body' + Date.now());
        await this.clickById('post');
    }
    async post_created_successfully() {
        assert.equal("×\nBlog Post posted successfully!", await driver.findElement(By.id("alert_success")).getText());
    }
    async create_valid_comment() {
        await this.clickByCss('tr:nth-child(1) a > small');
        await this.enterTextById('name', 'asdf');
        await this.enterTextById('message', 'asdf');
        await this.clickById('add_comment');
    }
    async comment_created_successfully() {
        assert.equal("×\nComment added to the Post successfully!", await driver.findElement(By.id("alert_success")).getText());
    }
    async log_out() {
        await this.clickById('log_out');
    }
}

module.exports = DashboardPage;