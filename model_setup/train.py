from fastai.vision import *
from fastai.metrics import error_rate
import os.path
from pathlib import Path

bs = 64
image_size = 224

path = Path("train")
data = ImageDataBunch.from_csv(path, suffix=".jpg", valid_pct=0.2,
                               size=image_size, ds_tfms=get_transforms()).normalize(imagenet_stats)

#data.show_batch(rows=3, figsize=(7,6))

learn = cnn_learner(data, models.resnet50, metrics=error_rate)

learn.fit_one_cycle(4)
learn.save('stage-1')

interp = ClassificationInterpretation.from_learner(learn)

losses, idxs = interp.top_losses()
interp.plot_top_losses(9, figsize=(15, 11))

learn.load('stage-1')
learn.unfreeze()
learn.fit_one_cycle(2, max_lr=slice(1e-6, 3e-4))

learn.load('stage-2')
learn.export()
