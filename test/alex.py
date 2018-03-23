import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

import time

import json
import sys

from selenium.webdriver.firefox.firefox_profile import AddonFormatError

class FirefoxProfileWithWebExtensionSupport(webdriver.FirefoxProfile):
    def _addon_details(self, addon_path):
        '''try:
            return super()._addon_details(addon_path)
        except AddonFormatError:'''
        try:
            with open(os.path.join(addon_path, 'manifest.json'), 'r') as f:
                manifest = json.load(f)
                return {
                        'id': manifest['applications']['gecko']['id'],
                        'version': manifest['version'],
                        'name': manifest['name'],
                        'unpack': False,
                        }
        except (IOError, KeyError) as e:
            raise AddonFormatError(str(e), sys.exc_info()[2])

class MyBrowser:
    def __init__(self, driver_path, extension_path, flag):
        self.driver_path = driver_path
        self.extension_path = extension_path
        self.flag = flag
        self.init()

    def init(self):
        executable_path = self.driver_path
        os.environ["webdriver.chrome.driver"] = executable_path

        if self.flag == 0:
            chrome_options = webdriver.ChromeOptions()
            chrome_options.add_argument("--start-maximized")
            if self.extension_path != None:
                chrome_options.add_argument('--load-extension=/home/jason/deterfox_extension')
                self.driver = webdriver.Chrome(executable_path=executable_path, chrome_options=chrome_options)
            else:
                self.driver = webdriver.Chrome(executable_path=executable_path, chrome_options=chrome_options)
        else:
            profile=FirefoxProfileWithWebExtensionSupport()
            if self.extension_path != None:
                profile.add_extension(self.extension_path) # for adblockplus
            self.driver = webdriver.Firefox(profile)

        #self.driver.set_page_load_timeout(50000)

        self.driver.get('http://deterfox.com')

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
                self.save(path,name)
                finish = True
            except Exception as e:
                #print e
                try:
                    self.close()
                except:
                    pass
                self.init()

        return end - start

    def close(self):
        self.driver.quit()

    def screenshot(self, path, name):
        self.driver.save_screenshot(path + name)

    def save(self, path, name):
        html = self.driver.page_source.encode('utf-8')
        with open(path + name + '.source', 'w') as f:
            f.write(html)

if __name__ == '__main__':
    #browser = MyBrowser('/home/jason/deterfox_extension/test/chromedriver', '/home/jason/project/deterext/extension/', 1)
    browser = MyBrowser('/home/jason/deterfox_extension/test/chromedriver', None, 1)
    dir = 'data/old1/'
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

