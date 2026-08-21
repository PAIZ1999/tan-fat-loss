from playwright.sync_api import sync_playwright

def capture():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 900})
        page.goto('http://localhost:3000/')
        page.wait_for_load_state('networkidle')
        page.screenshot(path=r'C:\Users\Administrator\.gemini\antigravity-ide\brain\ea6d8ab1-db7a-476f-9489-b430b6d2438f\screenshot_preview.png', full_page=True)
        print("截图已成功保存！")
        browser.close()

if __name__ == '__main__':
    capture()
