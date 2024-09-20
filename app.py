from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

# Load your OpenAI API key from an environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route('/complete', methods=['POST'])
def complete():
    data = request.get_json()
    prompt = data.get('prompt', '')

    try:
        response = openai.Completion.create(
            engine='code-davinci-002',  # Use OpenAI's code-davinci-002 model
            prompt=prompt,
            max_tokens=100,
            temperature=0,
            n=1,
            stop=None
        )
        completion = response.choices[0].text
        return jsonify({'completion': completion})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=8000)
