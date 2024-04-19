## Canine Classifier
React + Django app to classify your dog. 

## Backend
- Note that the pytorch download included in requirements.txt will not work for local development
- Start postgres: `pg_ctl -D /usr/local/var/postgres start`
- Stop postgres: `pg_ctl -D /usr/local/var/postgres stop`
- Changes to DB models etc: `python manage.py makemigrations && python manage.py migrate`
- run with `manage.py runserver`
- main app code under /personal_site
- deep model code under /model_setup
- current working python 3.9.1. Update runtime.txt if changing.

## Frontend
- Run with `npm run start`
- frontend code under /src

## Deploying to Heroku
- Build frontend with `npm run build`
- herokuapp name is devoeelias
- add + commit to git normally, then `git push heroku master`


## TODO
- Use the new text-to-image models to build a dataset of hybrid dogs. Update fine tuning loss to binary cross entropy to allow multiclass prediction. Market the app as a workaround to genetic testing.
- Catch error for camera not found on mobile - make sure camera access is allowed on your mobile browser!