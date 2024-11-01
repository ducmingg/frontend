import { runLoginTest } from './TestLogin.js';
import {Builder, By, Key, until} from "selenium-webdriver";
import * as assert from "assert";
import { runTest } from "./TestRegister.js";

export async function runCreateRoomTest() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await runTest(driver);
        await driver.sleep(2000);
        await runLoginTest(driver); // Login with the registered user
        await driver.sleep(2000);
        await testEmptyFields(driver);
        await driver.sleep(2000);

    } catch (e) {
        console.error("Test execution failed - " + e.message);
    } finally {
        await driver.sleep(2000);
        await driver.quit();
    }
}

async function resetCreateRoomForm(driver) {
    await driver.get('http://localhost:3000');  // Adjust the URL to your application's home page
    await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div/div/header/div/div[1]/div[2]/div[2]/div')), 10000);
    await driver.findElement(By.xpath('//*[@id="root"]/div/div/header/div/div[1]/div[2]/div[2]/div')).click();
    await driver.sleep(2000);
}

async function testEmptyFields(driver) {
    await resetCreateRoomForm(driver);
    try {
        let createButton = await driver.findElement(By.xpath("/html/body/div[2]/div[3]/div/div[3]/button[2]/span[2]"));
        await driver.executeScript("arguments[0].click();", createButton);
        await driver.sleep(2000);
        let error = await driver.findElement(By.xpath('/html/body/div[2]/div[3]/div/div[2]/div[2]/div/div')).getText();
        assert.strictEqual(error, 'Room name cannot leave empty!');
        console.log("Test empty fields: Passed");
    } catch (e) {
        console.log("Test empty fields: Failed - " + e.message);
    }
}

runCreateRoomTest();
