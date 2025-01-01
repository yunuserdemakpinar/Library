from flask import Flask, request, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# OCR.space API bilgileri
OCR_API_URL = "https://api.ocr.space/parse/image"
API_KEY = "K89683674688957"  # Bu API anahtarını güvenli bir şekilde saklayın!

@app.route('/upload-image', methods=['POST'])
def upload_image():
    # Resim kontrolü
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    # Yüklenen dosyayı al
    image_file = request.files['image']
    file_extension = image_file.filename.split('.')[-1].lower()

    # Dosya türü doğrulama
    if file_extension not in ['jpg', 'jpeg', 'png', 'pdf']:
        return jsonify({'error': 'Unsupported file type', 'details': 'Only JPG, PNG, and PDF are supported.'}), 400

    try:
        # OCR API'ye istek gönder
        response = requests.post(
            OCR_API_URL,
            files={'file': image_file},
            data={'apikey': API_KEY, 'language': 'eng', 'filetype': file_extension},
        )

        # API yanıtını kontrol et
        if response.status_code == 200:
            result = response.json()

            if result.get("IsErroredOnProcessing"):
                return jsonify({'error': 'Failed to process the image', 'details': result.get("ErrorMessage")}), 500

            # Metni çıkar
            extracted_text = result.get("ParsedResults", [{}])[0].get("ParsedText", "").strip()

            if not extracted_text:
                return jsonify({'error': 'No text found in the image'}), 400

            return jsonify({'text': extracted_text}), 200
        else:
            return jsonify({'error': 'API request failed', 'details': response.text}), response.status_code

    except requests.exceptions.RequestException as e:
        # API isteği sırasında oluşan hatalar
        return jsonify({'error': 'Network error occurred', 'details': str(e)}), 500

    except Exception as e:
        # Genel hatalar
        return jsonify({'error': 'Unexpected error occurred', 'details': str(e)}), 500


if __name__ == '__main__':
    # Flask'ı tüm ağ arayüzlerinde başlat
    app.run(host='0.0.0.0', port=5000, debug=True)
