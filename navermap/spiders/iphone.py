# -*- coding: utf-8 -*-
import scrapy
#from RecipeCrawler.items import RecipeItem, StepItem

class NaverMapSpider(scrapy.Spider):
    name = 'iphone.py'
    #start_url = 'https://m.map.naver.com/search2/interestSpot.nhn?type=DINING&sm=clk&centerCoord='
    start_lat = 37.5247713
    start_lon = 126.86593819999999
    lat_interval = 0.01
    lon_interval = 0.01

    # hand out every pages to "parse recipe list" method
    def start_requests(self):
        
        for i in range(0, 10): # after testing, try to slice Korea into several boxes which cover the entire territory
            coordination = str(start_lat + i * lat_interval) + ':' + str(start_lon + i * lon_interval)
            url = 'https://m.map.naver.com/search2/interestSpot.nhn?type=DINING&sm=clk&centerCoord={}'.format(coordination)
            request = scrapy.Request(url=url, callback=self.parseRestaurantList)
            yield request

    # parse lists in the page into seperate restaurants
    def parseRestaurantList(self, response):
        #links = LinkExtractor(restrict_xpaths='//div[@class="recipe_list"]') # not sure how to use
