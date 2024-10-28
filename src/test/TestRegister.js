import {  By, until } from "selenium-webdriver";
import * as assert from "assert";

export async function runTest(driver) {
    try {
        await testEmptyFields(driver);
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

