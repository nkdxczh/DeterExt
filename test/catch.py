from selenium import webdriver
from selenium.webdriver.common.keys import Keys

driver = webdriver.Chrome('/home/jason/project/deterfox/test/chromedriver')
driver.get('https://www.alexa.com/login')

email = driver.find_element_by_id('email')
password = driver.find_element_by_id('pwd')

email.send_keys("deterex2018@gmail.com")
password.send_keys("alexaczh1994")

driver.find_element_by_id("submit").click()

page = 0

for page in range(20):
    driver.get("https://www.alexa.com/topsites/countries;" + str(page) + "/US")
    elems = driver.find_elements_by_class_name("site-listing")
    #print len(elems)

    for e in elems:
        link = e.find_elements_by_tag_name('a')[0]
        print link.text
