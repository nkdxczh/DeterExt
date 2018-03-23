from selenium import webdriver
from selenium.webdriver.common.keys import Keys

import time

driver = webdriver.Chrome('/home/jason/project/deterfox/test/chromedriver')

driver.get("http://dromaeo.com/?id=271303")
time.sleep(2)
#elems = driver.find_elements_by_class_name("results")
elems = driver.find_elements_by_class_name("test")

'''for e in elems:
    results = e.find_elements_by_tag_name('li')
    for r in results:
        res = r.text
        #print r.text
        name = res.split(":\n")[0].strip()
        time = res.split(":\n")[1].split("r")[0].strip()
        print name, "," ,time'''

for e in elems:
    #name = e.find_elements_by_tag_name('b')[0].text[:-1]
    name = e.text.split('\n')[0][:-1].strip()
    time = e.text.split('\n')[1].split('r')[0].strip()
    print e.text
    #print name, ',', time

driver.close()
