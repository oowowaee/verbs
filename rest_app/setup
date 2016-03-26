install pip

virtualenv project
cd project
source bin/activate

cd verbs/rest_app
pip install -r requirements.txt
bower install
npm install

psql
CREATE DATABASE verbos;

./manage.py migrate


You will also need Ruby for mailcatcher to work (you only need mailcatcher to test sending emails in development, so you can skip it).
I *think* you can do:
gem install bundler
bundle install