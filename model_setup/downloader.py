import urllib.request
from urllib.request import *
from urllib.parse import quote
from pandas import DataFrame
import http.client
import requests
import itertools
import random
import os
import json
import re


class Downloader:
    def __init__(self, categories, dir_name, limit, negate_all=[], delim=" ", never_negate=[]):
        self.categories = set(categories)
        self.n_cats = len(categories)
        self.dir_name = dir_name
        self.limit = limit
        self.count = 0
        self.negate_strings = negate_all
        self.never_negate = never_negate
        self.extensions = [".jpg", ".jpeg", ".png", ".svg", ".webp", ".ico"]
        self.delim = delim
        self.queries = self.generate_mix_queries()
        self.currtags = ""
        self.output = []

    def __call__(self):
        tags = random.choice(list(self.queries.keys()))
        query = self.queries[tags]
        raw_html = self.download_page(self.format_url(query))
        print("Searching for images for tags: ", tags)
        self.currtags = tags
        self.get_all_items(raw_html)

    def download(self):
        for tags, query in self.queries.items():
            print("Searching for images for tags: ", tags)
            print(self.format_url(query))
            raw_html = self.download_page(self.format_url(query))
            self.currtags = tags
            self.get_all_items(raw_html)
            print("done.")
        pd.DataFrame(self.output).to_csv("data.csv", index=False)

    def generate_mix_queries(self):
        # 2 way combinations of every breed
        mixes = list(itertools.combinations(self.categories, 2))
        # negate all other categories besides those in each mix
        negations = [self.categories.difference(
            set(mix)) for mix in mixes]

        # Break up queries into individual words
        # sum(X, []) merges words from the mixes into a single list
        mix_words = [sum([class_string.split("_")
                          for class_string in mix_strings], []) for mix_strings in mixes]

        # Break up negations into individual words
        negate_words = [sum([class_string.split("_")
                             for class_string in negate_strings], []) for negate_strings in negations]

        # Now remove from negations any words that are part of the desired query
        # E.g. the mix "yellow lab german shepherd" should only negate "black" from "black lab"
        negate_words = [set(negate_strings).difference(set(mix_words[i] + self.never_negate))
                        for i, negate_strings in enumerate(negate_words)]

        # append '+' to each query word for the search
        mix_strings = ["+".join(mix) for mix in mix_words]

        # append '+-' to each non-query word to negate them in the search
        negate_strings = ["+-" + "+-".join(list(negation) + self.negate_strings)
                          for negation in negate_words]

        # concatenate the words into a single string for each query
        queries = [mix + "+mix" + negate for mix,
                   negate in zip(mix_strings, negate_strings)]

        # Fastai MultiImageList expects delimited list of tags to label each image
        tags = [self.delim.join(mix) for mix in mixes]
        return dict(zip(tags, queries))

    def format_url(self, query):
        return 'https://www.google.com/search?q={0}&espv=2&biw=1366&bih=667&site=webhp&source=lnms&tbm=isch&sa=X&ei=XosDVaCXD8TasATItgE&ved=0CAcQ_AUoAg'.format(query)

    def download_page(self, url):
        try:
            headers = {}
            headers['User-Agent'] = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36"
            req = urllib.request.Request(url, headers=headers)
            resp = urllib.request.urlopen(req)
            respData = str(resp.read())
            return respData
        except Exception as e:
            return False

    def download_image(self, image_url):
        try:
            req = Request(image_url, headers={
                "User-Agent": "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.27 Safari/537.17"})

            res = urlopen(req)
            data = res.read()
            res.close()
            ext = image_url[image_url.rfind("."):]
            path = "{0}/{1}{2}".format(self.dir_name, str(self.count), ext)
            with open(path, 'wb') as f:
                f.write(data)

            self.output.append({
                "image_name": "{0}{1}".format(str(self.count), ext), "tags": self.currtags})
            self.count = self.count + 1

        except Exception as e:
            print(e)
            return False

        return True

    def get_all_items(self, raw_html):
        urls = re.findall(r'(?=http)(.*?)(?=[ "\'])',  raw_html)
        # First image is always google logo
        urls = [url for url in urls if url[-4:] in self.extensions][1:]
        for url in urls[:self.limit]:
            self.download_image(url)
