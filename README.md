## Canine Classifier
React + Django app to classify your dog. 

## Backend
- Note that the pytorch download included in requirements.txt will not work for local development
- Start postgres: `brew services start postgresql`
- Stop postgres: `brew services stop postgresql`
- Changes to DB models etc: `python manage.py makemigrations && python manage.py migrate`
- run with `manage.py runserver`
- main app code under /personal_site
- deep model code under /model_setup
- current working python 3.9.1

## Frontend
- Run with `npm run start`
- frontend code under /src

## Deploying to Heroku
- Build frontend with `npm run build`
- herokuapp name is devoeelias
- add + commit to git normally, then `git push heroku master`
