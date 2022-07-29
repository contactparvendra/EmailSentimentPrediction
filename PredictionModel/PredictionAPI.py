from flask import Flask, render_template, redirect, url_for,request
from flask import make_response
import pickle
app = Flask(__name__)

text_classifier = pickle.load(open('/Users/parvendra/SentimentAPI/model.pkl', 'rb'))
vectorizer = pickle.load(open('/Users/parvendra/SentimentAPI/vectorizer.pkl', 'rb'))

def predict_sentiment(text):    
    s_features = []
    s_features.append(text)
    testvect = vectorizer.transform(s_features).toarray()
    s_prediction = text_classifier.predict(testvect)
    return s_prediction[0]

@app.route("/")
def home():
    return "hi"
@app.route("/index")

@app.route('/sentiment', methods=['GET', 'POST'])
def login():
   message = None
   if request.method == 'POST':
        text = request.form['t']
        result = predict_sentiment(text)
        resp = make_response(result)
        resp.headers['Content-Type'] = "text/html"
        resp.headers['Access-Control-Allow-Origin'] = "*"
        return resp

if __name__ == "__main__":
    app.run(debug = True)