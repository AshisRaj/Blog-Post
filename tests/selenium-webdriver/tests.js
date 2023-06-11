var webdriver = require('selenium-webdriver');
const baseURL = 'http://localhost:8080';
const RegistrationPage = require('./registrationpage');
const DashboardPage = require('./dashboardpage');
const LoginPage = require('./loginpage');
const ProfilePage = require('./profilepage');
var driver;

describe('Registration', function () {
  this.timeout(50000);

  beforeEach(function () {
    driver = new webdriver.Builder().forBrowser('chrome').build();
    driver.manage().setTimeouts({ implicit: (10000) })
    registrationpage = new RegistrationPage(driver, baseURL);
    dashboardpage = new DashboardPage(driver, baseURL);
  });

  it('SuccessfulRegistration', async function () {
    registrationpage.go();
    await registrationpage.enter_valid_fields();
    await dashboardpage.is_displayed();
  })

  it('DisabledRegistration', async function () {
    registrationpage.go();
    await registrationpage.enter_incomplete_fields();
    await registrationpage.validation_error_present();
  })

  afterEach(async function () {
    await driver.quit();
  });
});

describe('Login', function () {
  this.timeout(50000);

  beforeEach(function () {
    driver = new webdriver.Builder().forBrowser('chrome').build();
    driver.manage().setTimeouts({ implicit: (10000) })
    loginpage = new LoginPage(driver, baseURL);
    dashboardpage = new DashboardPage(driver, baseURL);
  });

  it('SuccessfulLogin', async function () {
    loginpage.go();
    await loginpage.enter_valid_fields();
    await dashboardpage.is_displayed();
  })

  it('DisabledLogin', async function () {
    loginpage.go();
    await loginpage.enter_incomplete_fields();
    await loginpage.validation_error_present();
  })

  it('FailedLogin', async function () {
    loginpage.go();
    await loginpage.enter_invalid_fields();
    await loginpage.is_displayed();
  })

  afterEach(async function () {
    await driver.quit();
  });
})

describe('Dashboard', function () {
  this.timeout(50000);

  beforeEach(function () {
    driver = new webdriver.Builder().forBrowser('chrome').build();
    driver.manage().setTimeouts({ implicit: (10000) })
    loginpage = new LoginPage(driver, baseURL);
    dashboardpage = new DashboardPage(driver, baseURL);
  });

  it('SuccessfulAddBlogPost', async function () {
    loginpage.go();
    await loginpage.enter_valid_fields();
    await dashboardpage.create_valid_post();
    await dashboardpage.post_created_successfully();
  })

  it('SuccessfulAddComment', async function () {
    loginpage.go();
    await loginpage.enter_valid_fields();
    await dashboardpage.create_valid_post();
    await dashboardpage.create_valid_comment();
    await dashboardpage.comment_created_successfully();
  })

  it('SuccessfulLogOut', async function () {
    loginpage.go();
    await loginpage.enter_valid_fields();
    await dashboardpage.log_out();
  })

  afterEach(async function () {
    await driver.quit();
  });
})

describe('Profile', function () {
  this.timeout(50000);

  beforeEach(function () {
    driver = new webdriver.Builder().forBrowser('chrome').build();
    driver.manage().setTimeouts({ implicit: (10000) })
    loginpage = new LoginPage(driver, baseURL);
    profilepage = new ProfilePage(driver, baseURL);
    dashboardpage = new DashboardPage(driver, baseURL);
  });

  it('ViewProfile', async function () {
    loginpage.go();
    await loginpage.enter_valid_fields();
    profilepage.go();
    await profilepage.profile_fields_present();
  })

  it('EditProfile', async function () {
    loginpage.go();
    await loginpage.enter_valid_fields();
    profilepage.go();
    await profilepage.enter_valid_fields();
    await dashboardpage.is_displayed();
  })

  afterEach(async function () {
    await driver.quit();
  });
})