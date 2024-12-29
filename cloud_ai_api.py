from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

OCR_API_URL = "https://api.ocr.space/parse/image"
API_KEY = "K89683674688957"

@app.route('/upload-image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    image_file = request.files['image']
    file_extension = image_file.filename.split('.')[-1].lower()

    if file_extension not in ['jpg', 'jpeg', 'png', 'pdf']:
        return jsonify({'error': 'Unsupported file type', 'details': 'Only JPG, PNG, and PDF are supported.'}), 400

    try:
        response = requests.post(
            OCR_API_URL,
            files={'file': image_file},
            data={'apikey': API_KEY, 'language': 'eng', 'filetype': file_extension},
        )

        if response.status_code == 200:
            result = response.json()
            if result.get("IsErroredOnProcessing"):
                return jsonify({'error': 'Failed to process the image', 'details': result.get("ErrorMessage")}), 500
            
            extracted_text = result["ParsedResults"][0]["ParsedText"]
            return jsonify({'text': extracted_text}), 200
        else:
            return jsonify({'error': 'API request failed', 'details': response.text}), response.status_code

    except Exception as e:
        return jsonify({'error': 'Unexpected error occurred', 'details': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
