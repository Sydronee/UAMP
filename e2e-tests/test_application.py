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
        phone_input = driver.find_element(By.CSS_SELECTOR, '[data-testid="input-phone"]')
        dob_input = driver.find_element(By.CSS_SELECTOR, '[data-testid="input-dob"]')
        gender_select = driver.find_element(By.CSS_SELECTOR, '[data-testid="select-gender"]')
        address_input = driver.find_element(By.CSS_SELECTOR, '[data-testid="input-address"]')
        city_input = driver.find_element(By.CSS_SELECTOR, '[data-testid="input-city"]')
        state_input = driver.find_element(By.CSS_SELECTOR, '[data-testid="input-state"]')
        country_input = driver.find_element(By.CSS_SELECTOR, '[data-testid="input-country"]')
        postal_code_input = driver.find_element(By.CSS_SELECTOR, '[data-testid="input-postalcode"]')
        next_1_button = driver.find_element(By.CSS_SELECTOR, '[data-testid="next-btn-1"]')

        # 5. Interact with elements
        first_name_input.send_keys("Jane")
        last_name_input.send_keys("Doe")
        email_input.send_keys("jane.doe@example.com")
        phone_input.send_keys("9876543210")
        dob_input.send_keys("01-01-2005")
        gender_select.send_keys("Female")
        address_input.send_keys("14 Park Street")
        city_input.send_keys("Mumbai")
        state_input.send_keys("Maharashtra")
        country_input.send_keys("India")
        postal_code_input.send_keys("400001")
        next_1_button.click()

        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="input-gpa"]')))

        gpa_input = driver.find_element(By.CSS_SELECTOR, '[data-testid="input-gpa"]')
        program_select = driver.find_element(By.CSS_SELECTOR, '[data-testid="select-program"]')
        high_school_input = driver.find_element(By.CSS_SELECTOR, '[data-testid="input-highschool"]')
        graduation_year_input = driver.find_element(By.CSS_SELECTOR, '[data-testid="input-graduation-year"]')
        entrance_score_input = driver.find_element(By.CSS_SELECTOR, '[data-testid="input-entrance-score"]')
        intake_select = driver.find_element(By.CSS_SELECTOR, '[data-testid="select-intake"]')
        sop_input = driver.find_element(By.CSS_SELECTOR, '[data-testid="input-sop"]')
        next_2_button = driver.find_element(By.CSS_SELECTOR, '[data-testid="next-btn-2"]')

        gpa_input.send_keys("8.7")
        program_select.send_keys("Computer Science")
        high_school_input.send_keys("St. Xavier High School")
        graduation_year_input.send_keys("2024")
        entrance_score_input.send_keys("88")
        intake_select.send_keys("Fall")
        sop_input.send_keys("I am highly motivated to study computer science and contribute to practical software systems for education and accessibility.")
        next_2_button.click()

        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="submit-button"]')))

        transcript_input = driver.find_element(By.CSS_SELECTOR, '[data-testid="input-transcript"]')
        id_input = driver.find_element(By.CSS_SELECTOR, '[data-testid="input-id"]')
        submit_button = driver.find_element(By.CSS_SELECTOR, '[data-testid="submit-button"]')

        transcript_input.send_keys(r"D:\sem6\UAMP\README.md")
        id_input.send_keys(r"D:\sem6\UAMP\README.md")

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
