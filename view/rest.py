from flask import Flask, request, redirect, jsonify
from flask_socketio import SocketIO, emit, send
from pptx import Presentation
import pandas as pd
from analyzer.analyzer import Analyzer
from storage.core import run_orm
from storage.entities import ReportSchema
import json

UPLOAD_FOLDER = '/uploaded_files'
ALLOWED_EXTENSIONS = {'csv', 'pptx'}

server = Flask(__name__,
               static_url_path='',
               static_folder='frontend/static')

server.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

socketio = SocketIO(server)
session_maker = run_orm()
analyzer = Analyzer()

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@server.route('/')
def index():
    return server.send_static_file("index.html")


@server.route('/upload', methods=['POST'])
def upload_task():
    try:
        if 'lecture' not in request.files or 'essays' not in request.files:
            return redirect(request.url)

        lecture = request.files['lecture']
        essays = request.files['essays']

        if lecture.filename == '' or essays.filename == '':
            return redirect(request.url)

        lecture = Presentation(lecture)
        essays = pd.read_excel(essays)

        socketio.emit('changed-report-status', json.dumps({'status': 'handling'}))
        session = session_maker()

        report = analyzer.analyze(lecture, essays)
        report_schema = ReportSchema()
        session.add(report)
        session.commit()

        socketio.emit('changed-report-status', json.dumps({'status': 'handled'}))
        return report_schema.dump(report)

    except Exception:
        return json.dumps({"status": "error", "text": "Ошибка анализа загруженных эссе"}), 500


@server.route('/end_check', methods=['POST'])
def end_check():
    try:
        session = session_maker()
        report_schema = ReportSchema()
        json_data = json.loads(request.data)
        report = report_schema.load(data=json_data, session=session)
        session.commit()
        return json.dumps({"status": "success", "text": "Результаты проверки эссе успешно сохранены"})

    except Exception:
        return json.dumps({"status": "error", "text": "Ошибка сохранения резултатов проверки"}), 500


if __name__ == '__main__':
    socketio.run(server, host='localhost', port=5000)
