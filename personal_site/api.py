from rest_framework.parsers import MultiPartParser
from rest_framework import viewsets
from rest_framework.response import Response

from .apps import PredictorConfig

from fastai.vision import open_image
from io import BytesIO

import base64

class DogAPI(viewsets.ModelViewSet):
    parser_classes = [MultiPartParser]

    def dog_class(self, request, *args, **kwawrgs):
        raw_data = request.data.get('image')[len("data:image/png;base64,"):]
        bytes = base64.b64decode(raw_data)
        return self.predict_image_from_bytes(bytes)

    def predict_image_from_bytes(self, bytes):
        img = open_image(BytesIO(bytes))
        learner = PredictorConfig.dog_classifier
        _, _, losses = learner.predict(img)
        classes = learner.data.classes
        out = sorted(
            zip(classes,
                map(float, losses)),
            key=lambda p: p[1],
            reverse=True
        )
        out = [(a.replace("_", " ").title(), round(b, 3)) for a, b in out[:10]]

        return Response({
            "predictions": out[:10]
        })
