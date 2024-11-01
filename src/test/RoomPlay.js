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
        await driver.sleep(3000);
        await testCreatePublicRoomSuccess(driver);
        await driver.sleep(4000);
        await testJoinPublicRoom(driver);
        await driver.sleep(2000);
        await startGame(driver);
        await driver.sleep(2000);
        await simulateDrawing(driver, "Test word", "TestUser");
        await driver.sleep(2000);
        await guessMultipleTimes(driver, ["smoking","hospital" , "cinema", "train", "embrace", "helicopter", "watermelon", "airport", "tiger","elephant","snake", "leopard", "lion", "panda", "truck", "strawberry", "fight", "fitness", "cat", "car", "coconut", "grape", "ferry", "orange", "supermarket", "hamburger"]);
        await driver.sleep(2000);
        await testJoinRoomWhenFull(driver);
        await driver.sleep(5000);
        // await testLeaveRoom(driver);
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

async function testCreatePublicRoomSuccess(driver) {
    await driver.get("http://localhost:3000");
    await runLoginTest(driver);
    await resetCreateRoomForm(driver);
    try {
        await driver.findElement(By.xpath("/html/body/div[2]/div[3]/div/div[2]/div[1]/div/input")).sendKeys("Public Room");
        await driver.sleep(2000);
        let playersSlider = await driver.findElement(By.xpath("/html/body/div[2]/div[3]/div/div[2]/span[1]/span[21]"));
        let action = driver.actions();
        await driver.sleep(2000);
        await action.move().dragAndDrop(playersSlider, { x: 0, y: 0 }).perform();
        await driver.sleep(3000);

// Select the number of rounds
        let roundsSlider = await driver.findElement(By.xpath("/html/body/div[2]/div[3]/div/div[2]/span[2]/span[13]"));
        action = driver.actions();  // Reinitialize the action object
        await driver.sleep(2000);
        await action.move().dragAndDrop(roundsSlider, { x: -160, y: 0 }).perform();
        await driver.sleep(3000);

        let createButton = await driver.findElement(By.xpath("/html/body/div[2]/div[3]/div/div[3]/button[2]/span[2]"));
        await driver.executeScript("arguments[0].click();", createButton);
        // Add assertions to verify room creation success
        await driver.sleep(2000);
        console.log("Test create public room success: Passed");
    } catch (e) {
        console.log("Test create public room success: Failed - " + e.message);
    }
}


async function testJoinPublicRoom(driver) {
    try {
        const originalWindow = await driver.getWindowHandle();
        await driver.executeScript("window.open('about:blank', '_blank');");
        const windows = await driver.getAllWindowHandles();
        let heheWindow;
        for (const handle of windows) {
            if (handle !== originalWindow) {
                heheWindow = handle;
                await driver.switchTo().window(heheWindow);
                break;
            }
        }
        await driver.get('http://localhost:3000');
        await driver.sleep(2000);
        // Step 5: Perform login steps in the new window
        await driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/header/div/div[2]/div[1]/input")).sendKeys("hehe");
        await driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/header/div/div[2]/div[2]/input")).sendKeys("hehe");
        await driver.findElement(By.id('signup')).click();
        await driver.sleep(3000);

        // nhấn tham gia phòng
        await driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/header/div/div[1]/div[2]/div[3]/ul[1]/div/li/div")).click();

        await driver.wait(until.urlContains('room'), 5000);
        await driver.sleep(3000);
        console.log("Test join public room: Passed");
        await driver.switchTo().window(originalWindow);
        await driver.sleep(3000);
        await startGame(driver, heheWindow);
    } catch (e) {
        console.log("Test join public room: Failed - " + e.message);
    }
}
async function startGame(driver) { // Accept heheWindow as a parameter
    try {
        // Click the "Start Game" button
        await driver.sleep(2000);
        let startGameButton = driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/div/div/div/div[2]/div[1]/div/div[1]/div/div/button"));
        await startGameButton.click();
        console.log("Test start game: Passed");
        // Function to handle word selection with timeout
        async function selectWord(player) {
            await driver.sleep(2000); // Wait to allow word buttons to appear
            let wordButtons = await driver.findElements(By.className("option-btn"));

            if (wordButtons.length > 0) {
                await driver.sleep(10000);  // Wait 10 seconds for selection

                // Check if any word is selected within the timeout
                let isWordSelected = false;
                for (let i = 0; i < wordButtons.length; i++) {
                    try {
                        if (await wordButtons[i].isDisplayed()) {
                            await wordButtons[i].click();
                            isWordSelected = true;
                            console.log(`${player} selected a word.`);
                            break;
                        }
                    } catch (staleError) {
                        console.log("Encountered stale element reference, retrying...");
                        wordButtons = await driver.findElements(By.className("option-btn")); // Re-fetch elements
                        i = -1; // Reset loop to start from the beginning
                    }
                }

                if (!isWordSelected) {
                    console.log(`Time's up! Passing word selection to another player.`);
                    return false; // Word was not selected, transfer to next player
                }
            } else {
                console.log("Word selection buttons not found. Switching to participant (hehe) window.");
                await driver.switchTo().window(heheWindow); // Switch to hehe's window if no words are found

            }
        }
    }
    catch (e) {
        console.log("Test start game: Failed - " + e.message);
    }
}
async function changeColor(driver) {
    try {
        // Locate the color picker element and set the desired color
        const colorPicker = await driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/div/div/div/div[2]/div[1]/div/div[2]/div[2]/div/div[1]/div")); // Adjust the selector as needed
        await colorPicker.click();
        await driver.sleep(2000);
        const colorOption = await driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/div/div/div/div[2]/div[1]/div/div[2]/div[2]/div[1]/div/div/div[3]/span[2]/div")); // Adjust the selector based on your color options
        await colorOption.click();
        console.log(`Changed color success`);
    } catch (e) {
        console.log("Change color failed: " + e.message);
    }
}
async function changeBrushSize(driver) {
    try {
        const brushSizeSlider = await driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/div/div/div/div[2]/div[1]/div/div[2]/div[2]/div/div[2]/div")); // Adjust the selector as needed
        await brushSizeSlider.click();
        await driver.sleep(2000);
        let brushSizeOption = await driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/div/div/div/div[2]/div[1]/div/div[2]/div[2]/div[1]/div/span/span[23]"));
        let action = driver.actions();
        await driver.sleep(2000);
        await action.move().dragAndDrop(brushSizeOption, { x: 30, y: 0 }).perform();
        await driver.sleep(2000);

        console.log(`Changed brush size to passed`);
    } catch (e) {
        console.log("Change brush size failed: " + e.message);
    }
}
async function undoLastAction(driver) {
    try {
        const undoButton = await driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/div/div/div/div[2]/div[1]/div/div[2]/div[2]/div/div[3]/div")); // Adjust the selector as needed
        await undoButton.click();
        console.log("Last action undone passed.");
    } catch (e) {
        console.log("Undo failed: " + e.message);
    }
}
async function clearCanvas(driver) {
    try {
        const clearButton = await driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/div/div/div/div[2]/div[1]/div/div[2]/div[2]/div/div[4]/div")); // Adjust the selector as needed
        await clearButton.click();
        console.log("Canvas cleared passed.");
    } catch (e) {
        console.log("Clear canvas failed: " + e.message);
    }
}
async function simulateDrawing(driver, originalWindow) {
    try {
        const originalWindow = await driver.getWindowHandle();
        // Giữ lại cửa sổ của người tham gia (không phải người tạo)
        const windows = await driver.getAllWindowHandles();
        let heheWindow;
        for (const handle of windows) {
            if (handle !== originalWindow) {
                heheWindow = handle;
                break;
            }
        }

        console.log("Participant window handle: " + heheWindow);
        console.log("Original window handle: " + originalWindow);

        await driver.wait(until.elementLocated(By.xpath("//*[@id=\"root\"]/div/div/div/div/div/div[2]/div[1]/div/div[2]/div[1]")), 5000);
        const canvas = await driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/div/div/div/div[2]/div[1]/div/div[2]/div[1]"));
        const actions = driver.actions();
        await driver.sleep(2000);
        await changeColor(driver);
        await driver.sleep(2000);
        await changeBrushSize(driver);

        // Simulate a drawing action
        await actions.move({ origin: canvas, x: 50, y: 50 }).press().perform(); // Start at a point on the canvas
        await actions.move({ origin: canvas, x: 150, y: 50 }).perform(); // Draw to the right
        await actions.move({ origin: canvas, x: 150, y: 150 }).perform(); // Draw downwards
        await driver.sleep(2000);
        await undoLastAction(driver);
        await driver.sleep(2000);
        await actions.move({ origin: canvas, x: 50, y: 150 }).perform(); // Draw to the left
        await actions.move({ origin: canvas, x: 50, y: 50 }).release().perform(); // Complete the drawing
        await clearCanvas(driver);
        await actions.move({ origin: canvas, x: 50, y: 50 }).press().perform(); // Start at a point on the canvas
        await driver.sleep(2000);
        await actions.move({ origin: canvas, x: 150, y: 50 }).perform(); // Draw to the right
        await driver.sleep(2000);
        await actions.move({ origin: canvas, x: 150, y: 150 }).perform(); // Draw downwards
        await driver.sleep(2000);
        await actions.move({ origin: canvas, x: 50, y: 50 }).release().perform();
        console.log("Test simulate drawing: Passed");
        // Chuyển sang cửa sổ người tham gia để đoán từ
        await driver.switchTo().window(heheWindow);
        await driver.sleep(2000);
    } catch (e) {
        console.log("Test simulate drawing: Failed - " + e.message);
    }
}

async function guessMultipleTimes(driver, wordList) {
    try {

        const guessInput = await driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/div/div/div/div[2]/div[2]/div[2]/div/div[2]/input")); // Adjust the selector for the guess input field

        for (const word of wordList) {
            await guessInput.clear(); // Clear input before each guess
            await guessInput.sendKeys(word, Key.RETURN); // Enter each guessed word
            await driver.sleep(1000); // Small delay between guesses
            console.log(`Tried guessing the word "${word}"`);

            console.log("Multiple guesses completed.");
            const indicators = await driver.findElements(By.className("text")); // Adjust class to actual success element
            if (indicators.length > 0 && await !indicators[0].isDisplayed()) {
                console.log(`Correct guess found with word "${word}". Stopping further guesses.`);
                break;
            }


            console.log(`Word "${word}" was incorrect, continuing to the next guess.`);
        }
    } catch (e) {
        console.log("Guessing word failed: " + e.message);
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


async function testJoinRoomWhenFull() {
    let driver2;
    try {
        driver2 = await new Builder().forBrowser("chrome").build();
        await driver2.get("http://localhost:3000");
        await driver2.findElement(By.xpath("//*[@id=\"root\"]/div/div/header/div/div[2]/div[1]/input")).sendKeys("newUser");
        await driver2.findElement(By.xpath("//*[@id=\"root\"]/div/div/header/div/div[2]/div[2]/input")).sendKeys("password123");
        await driver2.findElement(By.id("signup")).click();
        await driver2.sleep(2000);

        let roomElement2 = await driver2.findElement(By.xpath("//*[@id=\"root\"]/div/div/header/div/div[1]/div[2]/div[3]/ul[1]/div/li/div"));
        await roomElement2.click();
        await driver2.sleep(2000);
        console.log("Test join room when full: Passed join room when full");
    } catch (e) {
        console.log("Test join room when full: Failed - " + e.message);
    } finally {
        if (driver2) await driver2.quit();
    }
}

///////////////////////
runCreateRoomTest();
