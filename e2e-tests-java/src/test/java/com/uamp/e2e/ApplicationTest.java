package com.uamp.e2e;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class ApplicationTest {

    private WebDriver driver;

    @BeforeAll
    public static void setupClass() {
        // Selenium 4.6.0+ includes Selenium Manager, which automatically
        // manages the browser driver binaries. We don't need WebDriverManager.
    }

    @BeforeEach
    public void setupTest() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless"); // Run in headless mode for CI/CD
        driver = new ChromeDriver(options);
    }

    @AfterEach
    public void teardown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    public void testApplicationLoads() {
        // Change URL to match your frontend server
        driver.get("http://localhost:5173");
        
        String title = driver.getTitle();
        // Just an example check, this depends on your actual app's title
        assertTrue(title != null && !title.isEmpty(), "The page should have a title");
    }
}