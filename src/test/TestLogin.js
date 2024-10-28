import { By, until } from "selenium-webdriver";
import * as assert from "assert";

export async function runLoginTest(driver) {
    try {
        await testEmptyFields(driver);
        await driver.sleep(2000);
        await testUserNotExists(driver);
        await driver.sleep(2000);
        await testInvalidPassword(driver);
        await driver.sleep(2000);

    } catch (e) {
        console.error("Test execution failed - " + e.message);
    }
}

async function resetLoginForm(driver) {
    await driver.get('http://localhost:3000/login');
    await driver.manage().window().maximize();
    await driver.sleep(2000);
}

async function testEmptyFields(driver) {
    await resetLoginForm(driver);
    try {
        await driver.findElement(By.id('signup')).click();
        let error = await driver.findElement(By.className('MuiAlert-message')).getText();
        assert.strictEqual(error, 'Please Enter All Your Login Information!');
        console.log("Test empty fields: Passed");
    } catch (e) {
        console.log("Test empty fields: Failed - " + e.message);
    }
}

async function testUserNotExists(driver) {
    await resetLoginForm(driver);
    try {
        await driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/header/div/div[2]/div[1]/input")).sendKeys("nonexistentUser");
        await driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/header/div/div[2]/div[2]/input")).sendKeys("password123");
        await driver.findElement(By.id('signup')).click();
        let error = await driver.findElement(By.className('MuiAlert-message')).getText();
        assert.strictEqual(error, 'User Not Exists!');
        console.log("Test user not exists: Passed");
    } catch (e) {
        console.log("Test user not exists: Failed - " + e.message);
    }
}

async function testInvalidPassword(driver) {
    await resetLoginForm(driver);
    try {
        await driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/header/div/div[2]/div[1]/input")).sendKeys("existingUser");
        await driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/header/div/div[2]/div[2]/input")).sendKeys("wrongpassword");
        await driver.findElement(By.id('signup')).click();
        let error = await driver.findElement(By.className('MuiAlert-message')).getText();
        assert.strictEqual(error, 'Password Invalid!');
        console.log("Test invalid password: Passed");
    } catch (e) {
        console.log("Test invalid password: Failed - " + e.message);
    }
}
