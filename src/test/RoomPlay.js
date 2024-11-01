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
        await testCreatePrivateRoomNoPassword(driver);
        await driver.sleep(2000);  // Optional: Wait for the page to load
        await testCreatePrivateRoomSuccess(driver);
        await driver.sleep(3000);
        await testJoinPrivateRoom(driver, "password123");

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

async function testCreatePrivateRoomNoPassword(driver) {
    await resetCreateRoomForm(driver);
    try {
        await driver.findElement(By.xpath("/html/body/div[2]/div[3]/div/div[2]/div[1]/div/input")).sendKeys("Private Room");
        await driver.findElement(By.xpath("/html/body/div[2]/div[3]/div/div[2]/div[3]/label[2]/span[1]/span[1]/input")).click();
        let createButton = await driver.findElement(By.xpath("/html/body/div[2]/div[3]/div/div[3]/button[2]/span[2]"));
        await driver.executeScript("arguments[0].click();", createButton);
        await driver.sleep(2000);
        let error = await driver.findElement(By.xpath('/html/body/div[2]/div[3]/div/div[2]/div[5]/div/div')).getText();
        assert.strictEqual(error, 'Password cannot leave empty in Private mode!');
        console.log("Test create private room no password: Passed");
    } catch (e) {
        console.log("Test create private room no password: Failed - " + e.message);
    }
}

async function testCreatePrivateRoomSuccess(driver) {
    await resetCreateRoomForm(driver);  // Reset the form state
    try {
        await driver.findElement(By.xpath("/html/body/div[2]/div[3]/div/div[2]/div[1]/div/input")).sendKeys("Private Room");
        await driver.findElement(By.xpath("/html/body/div[2]/div[3]/div/div[2]/div[3]/label[2]/span[1]/span[1]/input")).click();
        await driver.findElement(By.xpath("//*[@id=\"password\"]")).sendKeys("password123");

        let playersSlider = await driver.findElement(By.xpath("/html/body/div[2]/div[3]/div/div[2]/span[1]/span[21]"));
        let action = driver.actions();
        await driver.sleep(2000);
        await action.move().dragAndDrop(playersSlider, { x: 160, y: 0 }).perform();
        await driver.sleep(4000);

// Select the number of rounds
        let roundsSlider = await driver.findElement(By.xpath("/html/body/div[2]/div[3]/div/div[2]/span[2]/span[13]"));
        action = driver.actions();  // Reinitialize the action object
        await driver.sleep(2000);
        await action.move().dragAndDrop(roundsSlider, { x: 80, y: 0 }).perform();
        await driver.sleep(4000);

        await driver.sleep(3000);
        let createButton = await driver.findElement(By.xpath("/html/body/div[2]/div[3]/div/div[3]/button[2]/span[2]"));
        await driver.executeScript("arguments[0].click();", createButton);
        console.log("Test create private room success: Passed");
    } catch (e) {
        console.log("Test create private room success: Failed - " + e.message);
    }
}

async function testJoinPrivateRoom(driver, password) {
    try {
        const originalWindow = await driver.getWindowHandle();
        await driver.executeScript("window.open('about:blank', '_blank');");
        const windows = await driver.getAllWindowHandles();
        let newWindow;
        for (const handle of windows) {
            if (handle !== originalWindow) {
                newWindow = handle;
                await driver.switchTo().window(newWindow);
                break;
            }
        }
        await driver.get('http://localhost:3000');
        await driver.sleep(2000);

        // Perform login in the new window
        await driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/header/div/div[2]/div[1]/input")).sendKeys("haha");
        await driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/header/div/div[2]/div[2]/input")).sendKeys("haha");
        await driver.findElement(By.id("signup")).click();
        await driver.sleep(5000);

        // Click to join the private room
        await driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/header/div/div[1]/div[2]/div[3]/ul/li/div")).click();
        await driver.sleep(2000);

        // Enter the room password
        await driver.findElement(By.xpath("/html/body/div[2]/div[3]/div/div[2]/input")).sendKeys(password);

        // Click the 'Enter' button in the password dialog
        await driver.findElement(By.xpath("/html/body/div[2]/div[3]/div/div[3]/button[2]/span[1]")).click();

        // Wait for confirmation that the room has been joined
        await driver.wait(until.urlContains('room'), 5000);
        console.log("Test join private room: Passed");
        await driver.switchTo().window(originalWindow);
        await driver.sleep(2000);

        // await driver.switchTo().window(originalWindow);
        await driver.sleep(5000);

    } catch (e) {
        console.log("Test join private room: Failed - " + e.message);
    }
}

runCreateRoomTest();
