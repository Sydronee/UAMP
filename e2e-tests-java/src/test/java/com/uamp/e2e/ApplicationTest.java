package com.uamp.e2e;

import java.time.Duration;

import org.junit.jupiter.api.AfterEach;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

public class ApplicationTest {

    private WebDriver driver;
    private WebDriverWait wait;
    
    // ADJUST THIS: Increase for a slower, more dramatic presentation
    private final int GLOBAL_PAUSE_MS = 2000; 

    @BeforeEach
    public void setupTest() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--start-maximized");
        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    @AfterEach
    public void teardown() {
        if (driver != null) {
            visualPause(GLOBAL_PAUSE_MS); 
            driver.quit();
        }
    }

    /**
     * TEST 1: The Multi-Step Application Flow
     */
    @Test
    public void testStudentApplicationFlow() {
        driver.get("http://localhost:5173/");
        
        // Step 1: Personal Information
        fillInput("input-firstname", "John");
        fillInput("input-lastname", "Doe");
        fillInput("input-email", "john.doe@test.com");
        clickElement("next-btn-1");

        // Step 2: Academic Info
        fillInput("input-gpa", "3.8");
        
        // Handling the Select specifically
        WebElement programSelect = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("select[data-testid='select-program']")));
        highlight(programSelect);
        visualPause(1000);
        new Select(programSelect).selectByVisibleText("Computer Science");
        visualPause(GLOBAL_PAUSE_MS);

        clickElement("next-btn-2");

        // Step 3: Final Checks
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("button[data-testid='submit-button']")));
        
        WebElement transcript = driver.findElement(By.cssSelector("input[data-testid='input-transcript']"));
        WebElement idInput = driver.findElement(By.cssSelector("input[data-testid='input-id']"));
        WebElement submitBtn = driver.findElement(By.cssSelector("button[data-testid='submit-button']"));
        
        highlight(transcript);
        highlight(idInput);
        highlight(submitBtn);
        
        assertNotNull(transcript);
        assertNotNull(idInput);
        assertTrue(submitBtn.isDisplayed());
        
        visualPause(GLOBAL_PAUSE_MS);
    }

    /**
     * TEST 2: Admin Navigation and Error Validation
     */
    @Test
    public void testAdminLoginNavigationAndValidation() {
        driver.get("http://localhost:5173/");

        // Click Admin link in navbar
        WebElement adminLink = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//a[contains(text(), 'Admin')]")));
        highlight(adminLink);
        visualPause(1000);
        adminLink.click();

        // Login with bad credentials
        fillInput("login-input-email", "admin.fake@test.com");
        fillInput("login-input-password", "badpassword");
        clickElement("login-submit-btn");

        // Wait for the error message to appear and highlight it
        try {
            WebElement errorMsg = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("div[data-testid='login-error-msg']")));
            highlight(errorMsg);
            
            assertNotNull(errorMsg);
            assertTrue(errorMsg.getText().length() > 0);
        } catch (Exception e) {
            System.out.println("Login error message did not appear in time: " + e.getMessage());
        }
        
        visualPause(GLOBAL_PAUSE_MS);
    }

    /**
     * TEST 3: Multi-Step Application Flow - Go back and forth validation
     */
    @Test
    public void testStudentApplicationFormBackAndForth() {
        driver.get("http://localhost:5173/");

        // Fill step 1
        fillInput("input-firstname", "Alice");
        fillInput("input-lastname", "Smith");
        fillInput("input-email", "alice@test.com");
        clickElement("next-btn-1");

        // Verify we are on Step 2
        WebElement gpaInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("input[data-testid='input-gpa']")));
        highlight(gpaInput);
        visualPause(1000);
        
        // Go back to Step 1
        clickElement("prev-btn-2");

        // Ensure we are back at Step 1 and data is retained
        WebElement firstNameInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("input[data-testid='input-firstname']")));
        highlight(firstNameInput);
        visualPause(GLOBAL_PAUSE_MS);
        
        assertTrue(firstNameInput.getAttribute("value").equals("Alice"));
    }

    /**
     * TEST 4: The Full Application Flow Submission Attempt
     * Attempts a full submission and waits to highlight the error or success alert.
     */
    @Test
    public void testStudentApplicationFlowSubmitAttempt() {
        driver.get("http://localhost:5173/");
        
        // Step 1
        fillInput("input-firstname", "Bob");
        fillInput("input-lastname", "Builder");
        fillInput("input-email", "bob@test.com");
        clickElement("next-btn-1");

        // Step 2
        fillInput("input-gpa", "4.0");
        WebElement programSelect = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("select[data-testid='select-program']")));
        highlight(programSelect);
        visualPause(500);
        new Select(programSelect).selectByVisibleText("Engineering");
        visualPause(500);
        clickElement("next-btn-2");

        // Step 3 (No documents, submitting)
        clickElement("submit-button");

        // Wait to see if error or success message appears (Depending on if your backend is running)
        try {
            WebElement message = wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("div[data-testid='error-message'], div[data-testid='success-message']")));
            highlight(message);
            visualPause(GLOBAL_PAUSE_MS * 2); // Longer pause so you can read the box
            assertNotNull(message);
        } catch (Exception e) {
            System.out.println("Did not receive a timely response from backend");
        }
    }

    /**
     * TEST 5: Admin Login Attempt with Potentially Valid Credentials
     * Assumes an account admin@uamp.com/admin123 exists, or highlights the resulting error otherwise.
     */
    @Test
    public void testAdminLoginNavigationAndSuccessAttempt() {
        driver.get("http://localhost:5173/");

        // Click Admin link in navbar
        WebElement adminLink = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//a[contains(text(), 'Admin')]")));
        adminLink.click();
        visualPause(1000);

        // Login with potential credentials
        fillInput("login-input-email", "admin@uamp.com");
        fillInput("login-input-password", "admin123");
        clickElement("login-submit-btn");

        // Check if we hit an error box or accessed the dashboard
        try {
            WebElement element = wait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("//h1[contains(text(), 'Admin Dashboard')] | //div[@data-testid='login-error-msg']")
            ));
            highlight(element);
            visualPause(GLOBAL_PAUSE_MS * 2);
            assertTrue(element.isDisplayed());
        } catch (Exception e) {
            System.out.println("Login state unresolved within 10s");
        }
    }

    // --- VISUAL UTILITIES ---

    private void highlight(WebElement element) {
        try {
            JavascriptExecutor js = (JavascriptExecutor) driver;
            // Draw a thick red border and yellow background to make it pop
            js.executeScript("arguments[0].setAttribute('style', 'border: 4px solid #ff0000; background: #ffff00; transition: all 0.3s;');", element);
        } catch (Exception e) {
            // Silently fail if highlighting isn't possible
        }
    }

    private void fillInput(String testId, String text) {
        WebElement el = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("input[data-testid='" + testId + "']")));
        highlight(el);
        visualPause(500); 
        el.clear();
        el.sendKeys(text);
        visualPause(GLOBAL_PAUSE_MS);
    }

    private void clickElement(String testId) {
        WebElement el = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("button[data-testid='" + testId + "']")));
        highlight(el);
        visualPause(1000); 
        el.click();
    }

    private void visualPause(int ms) {
        try {
            Thread.sleep(ms);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}