import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

import time

class MyBrowser:
    def __init__(self, driver_path, extension_path):
        self.driver_path = driver_path
        self.extension_path = extension_path
        self.init()

    def init(self):
        executable_path = self.driver_path
        os.environ["webdriver.chrome.driver"] = executable_path

        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument("--start-maximized")
        if self.extension_path != None:
            chrome_options.add_argument('--load-extension=/home/jason/deterfox_extension')
            self.driver = webdriver.Chrome(executable_path=executable_path, chrome_options=chrome_options)
        else:
            self.driver = webdriver.Chrome(executable_path=executable_path, chrome_options=chrome_options)

        #self.driver.set_page_load_timeout(30)

        self.driver.get('https://gamil.com')

        time.sleep(3)

    def browse(self, url, path, name):
        finish = False
        while not finish:
            try:
                start = time.time()
                self.driver.get(url)
                end = time.time()
                time.sleep(2)
                self.screenshot(path, name)
                finish = True
            except:
                self.close()
                self.init()

        return end - start

    def close(self):
        self.driver.quit()

    def screenshot(self, path, name):
        self.driver.save_screenshot(path + name)

if __name__ == '__main__':
    browser = MyBrowser('/home/jason/deterfox_extension/test/chromedriver', None)
    dir = 'old1/'
    skip = True
    with open('list') as f:
        for url in f:
            '''if skip and url.strip() != "Playstation.com":
                continue
            skip = False
            if url.strip() == "Playstation.com":
                continue'''
            
            print url.strip()
            print browser.browse("http://" + url, dir, url.strip())
    browser.close()

