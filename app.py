from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import os
import json
import uuid
from datetime import datetime
import cv2
import numpy as np
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = 'furia_know_your_fan_secret_key'  # Chave para sessão

# Configurações de upload
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Função auxiliar para verificar extensões permitidas
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Armazenamento temporário de usuários (em produção seria um banco de dados)
users = {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        # Obter dados do formulário
        user_data = {
            'id': str(uuid.uuid4()),
            'name': request.form['name'],
            'email': request.form['email'],
            'cpf': request.form['cpf'],
            'address': request.form['address'],
            'favorite_games': request.form.getlist('favorite_games'),
            'events_attended': request.form.getlist('events_attended'),
            'registration_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
        # Processar upload de foto
        if 'photo' in request.files:
            file = request.files['photo']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], user_data['id'] + '_' + filename)
                file.save(file_path)
                user_data['photo_path'] = file_path.replace('static/', '')
                
                # Simulação de validação de identidade usando OpenCV (simplificado)
                user_data['identity_verified'] = True
        
        # Salvar usuário
        users[user_data['id']] = user_data
        session['user_id'] = user_data['id']
        
        return redirect(url_for('social_connect'))
    
    return render_template('register.html')

@app.route('/social-connect', methods=['GET', 'POST'])
def social_connect():
    if 'user_id' not in session:
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        user_id = session['user_id']
        
        # Simular conexão com redes sociais
        users[user_id]['social_profiles'] = {
            'twitter': request.form.get('twitter', ''),
            'instagram': request.form.get('instagram', ''),
            'facebook': request.form.get('facebook', ''),
            'twitch': request.form.get('twitch', '')
        }
        
        users[user_id]['esports_profiles'] = {
            'faceit': request.form.get('faceit', ''),
            'battlefy': request.form.get('battlefy', ''),
            'challengermode': request.form.get('challengermode', '')
        }
        
        # Análise simulada de perfil
        if users[user_id]['social_profiles']['twitter'] or users[user_id]['social_profiles']['instagram']:
            users[user_id]['profile_analysis'] = {
                'engagement_score': 75,
                'furia_affinity': 85,
                'content_relevance': 90
            }
        
        return redirect(url_for('dashboard'))
    
    return render_template('social.html')

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session or session['user_id'] not in users:
        return redirect(url_for('index'))
    
    user_data = users[session['user_id']]
    
    # Gerar insights (dados simulados para o protótipo)
    insights = {
        'recommended_events': ['FURIA Fan Fest 2025', 'CS:GO Major Viewing Party'],
        'merchandise_recommendations': ['FURIA Pro Jersey', 'Limited Edition Mouse Pad'],
        'content_preferences': ['Livestreams', 'Behind the scenes content'],
        'engagement_opportunities': ['Fan club membership', 'Beta tester program']
    }
    
    return render_template('dashboard.html', user=user_data, insights=insights)

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)