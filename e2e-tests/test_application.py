from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import requests

def reset_database():
    """Resets the backend data to ensure a clean state for the test."""
    print("Resetting database...")
    response = requests.post("http://localhost:3000/api/test/reset")
    if response.status_code == 200:
        print("Database reset successful.")
    else:
        raise Exception("Failed to reset database.")

def test_student_application():
    # 1. Start with a fresh backend
    reset_database()

    # 2. Setup WebDriver (Assuming Chrome)
    driver = webdriver.Chrome()
    wait = WebDriverWait(driver, 10)

    try:
        print("Navigating to application form...")
        # 3. Navigate to the React frontend
        driver.get("http://localhost:5173") # Default Vite port

        # Wait for the form to load
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="application-form"]')))

        print("Filling out form...")
        # 4. Locate elements using the custom data-testid attributes
        first_name_input = driver.find_element(By.CSS_SELECTOR, '[data-testid="input-firstname"]')
        last_name_input = driver.find_element(By.CSS_SELECTOR, '[data-testid="input-lastname"]')
        email_input = driver.find_element(By.CSS_SELECTOR, '[data-testid="input-email"]')
        program_select = driver.find_element(By.CSS_SELECTOR, '[data-testid="select-program"]')
        submit_button = driver.find_element(By.CSS_SELECTOR, '[data-testid="submit-button"]')

        # 5. Interact with elements
        first_name_input.send_keys("Jane")
        last_name_input.send_keys("Doe")
        email_input.send_keys("jane.doe@example.com")
        program_select.send_keys("Computer Science")

        # 6. Submit form
        submit_button.click()

        print("Waiting for success message...")
        # 7. Verify the success message appears
        success_msg = wait.until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, '[data-testid="success-message"]'))
        )
        
        assert "Application submitted successfully" in success_msg.text
        print("E2E Test Passed successfully!")

    finally:
        # 8. Teardown
        driver.quit()

if __name__ == "__main__":
    test_student_application()
