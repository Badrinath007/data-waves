from flask import Flask, request, jsonify
from supabase import create_client, Client
import os
from werkzeug.utils import secure_filename
from flask_cors import CORS
import json
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Supabase configuration
SUPABASE_URL = 'https://skrpslflpbmehhjbwwdi.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrcnBzbGZscGJtZWhoamJ3d2RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMzMTU5NTIsImV4cCI6MjA0ODg5MTk1Mn0.BUL083ECTyzB5QJ0BrTEJ__ICGLdCulglsrs2l3iSKA'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Helper function to check file extension
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')  # Assume the signup form includes a 'name' field

    if not email or not password or not name:
        return jsonify({"error": "Name, email, and password are required"}), 400

    try:
        

        # Sign up the user in Supabase Auth
        response = supabase.auth.sign_up({"email": email, "password": password})

        if not response.user:
            return jsonify({"error": "Signup failed"}), 400

        # Add user to the Supabase 'users' table
        user_id = response.user.id
        supabase.from_('users').insert({
            "id": user_id,
            "email": email,
            "name": name,
            "password": password  # Store the hashed password
        }).execute()

        return jsonify({"message": "Signup successful"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    

    # Extract email and password from the request
    email = data.get('email')
    password = data.get('password')

    

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    try:
        
        response = supabase.auth.sign_in_with_password({"email": email, "password": password})
        session_data = {
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "expires_in": response.session.expires_in
        }
        return jsonify({
            "message": "Login successful",
            "session": session_data
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Route: Upload Profile Picture
@app.route('/upload-avatar', methods=['POST'])
def upload_avatar():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']
    user_id = request.form.get('user_id')

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = f"{user_id}/avatar/{filename}"

        try:
            supabase.storage.from_('avatars').upload(file_path, file, {"upsert": True})

            # Get public URL for the uploaded file
            public_url = supabase.storage.from_('avatars').get_public_url(file_path)

            return jsonify({"message": "Avatar uploaded successfully", "url": public_url}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Invalid file type"}), 400

# Route: Fetch Profile Picture
@app.route('/fetch-avatar', methods=['GET'])
def fetch_avatar():
    user_id = request.args.get('user_id')

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    try:
        avatar_path = f"{user_id}/avatar"

        # Get public URL for the avatar folder
        files = supabase.storage.from_('avatars').list(avatar_path)

        if not files:
            return jsonify({"error": "Avatar not found"}), 404

        public_url = supabase.storage.from_('avatars').get_public_url(files[0]['name'])

        return jsonify({"message": "Avatar fetched successfully", "url": public_url}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500




@app.route('/data', methods=['GET'])
def get_data():
    # Get the absolute path to the data.json file inside the backend folder
    file_path = os.path.join(os.getcwd(),'data.json')
    print("Looking for file at:", file_path)

    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    try:
        # Open the file with UTF-8 encoding
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        return data
    except UnicodeDecodeError as e:
        return jsonify({"error": f"Encoding error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
