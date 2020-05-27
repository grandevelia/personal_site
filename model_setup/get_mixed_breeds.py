from pathlib import Path
import json
import pandas as pd
from downloader import Downloader

path = 'data'
cats = list(set(list(pd.read_table("labels_to_use.txt", header=None)[0])))

# These are common words that show images of other mixes
max_images = 1  # Images of each mix to get

dl = Downloader(cats, path, max_images, never_negate=["dog"])
dl.download()
