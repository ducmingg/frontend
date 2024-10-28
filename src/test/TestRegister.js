import {  By, until } from "selenium-webdriver";
import * as assert from "assert";

export async function runTest(driver) {
    try {
        await testEmptyFields(driver);
        await driver.sleep(2000);
        await testPasswordMismatch(driver);
        await driver.sleep(2000);
        await testInvalidEmail(driver);
        await driver.sleep(2000);

    } catch (e) {
        console.error("Test execution failed - " + e.message);
    }
}

export async function resetForm(driver) {
    await driver.get('http://localhost:3000/register');
    await driver.manage().window().maximize();
    await driver.sleep(2000);
}

async function testEmptyFields(driver) {
    await resetForm(driver);
    try {
        await driver.findElement(By.id('signup')).click();
        let error = await driver.findElement(By.className('MuiAlert-message')).getText();
        assert.strictEqual(error, 'Please Fill All the Field!');
        console.log("Test empty fields: Passed");
    } catch (e) {
        console.log("Test empty fields: Failed - " + e.message);
    }
}

async function testPasswordMismatch(driver) {
    await resetForm(driver);
    try {
        await driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/header/div/div[2]/div[1]/input")).sendKeys("testuser");
        await driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/header/div/div[2]/div[2]/input")).sendKeys("nameuser@gmail.com");
        await driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/header/div/div[2]/div[3]/input")).sendKeys("password123");
        await driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/header/div/div[2]/div[4]/input")).sendKeys("password321");
        await driver.findElement(By.id('signup')).click();
        let error = await driver.findElement(By.className('MuiAlert-message')).getText();
        assert.strictEqual(error, 'Confirm Password Does Not Match the Password!');
        console.log("Test password mismatch: Passed");
    } catch (e) {
        console.log("Test password mismatch: Failed - " + e.message);
    }
}

async function testInvalidEmail(driver) {
    await resetForm(driver);
    try {
        await driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/header/div/div[2]/div[1]/input")).sendKeys("testuser");
        await driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/header/div/div[2]/div[2]/input")).sendKeys("invalid-email");
        await driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/header/div/div[2]/div[3]/input")).sendKeys("password123");
        await driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/header/div/div[2]/div[4]/input")).sendKeys("password123");
        await driver.findElement(By.id('signup')).click();
        let error = await driver.findElement(By.className('MuiAlert-message')).getText();
        assert.strictEqual(error, 'Please Enter a Vaild Email Address!');
        console.log("Test invalid email: Passed");
    } catch (e) {
        console.log("Test invalid email: Failed - " + e.message);
    }
}
