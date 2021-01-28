from flask import Flask, request, redirect, jsonify
from flask_socketio import SocketIO, emit, send
from pptx import Presentation
import pandas as pd
from analyzer.analyzer import analyze, mock_report
from datetime import date, datetime
import json

UPLOAD_FOLDER = '/uploaded_files'
ALLOWED_EXTENSIONS = {'csv', 'pptx'}


class AlchemyEncoder(json.JSONEncoder):

    def default(self, obj):
        cl = obj.__class__
        # an SQLAlchemy class
        fields = {}
        for field in [x for x in dir(obj) if not x.startswith('_') and x != 'metadata']:
            data = obj.__getattribute__(field)
            try:
                if isinstance(data, (datetime, date)):
                    data = data.isoformat()
                else:
                    json.dumps(data)
                fields[field] = data
            except TypeError:
                fields[field] = None
        # a json-encodable dict
        return fields


server = Flask(__name__,
               static_url_path='',
               static_folder='frontend/static')

server.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

socketio = SocketIO(server)


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@server.route('/')
def index():
    return server.send_static_file("index.html")


@server.route('/upload', methods=['POST'])
def upload_file():
    # if 'lecture' not in request.files or 'essays' not in request.files:
    #     return redirect(request.url)
    #
    # lecture = request.files['lecture']
    # essays = request.files['essays']
    #
    # if lecture.filename == '' or essays.filename == '':
    #     return redirect(request.url)
    #
    # lecture = Presentation(lecture)
    # essays = pd.read_excel(essays)

    socketio.emit('changed-report-status', json.dumps({'status': 'handling'}))
    # graded_essays = analyze(lecture, essays)
    graded_essays = mock_report()
    lecture = graded_essays.pop(0)
    response = {
        "lecture": lecture,
        "graded_essays": graded_essays
    }

    socketio.emit('changed-report-status', json.dumps({'status': 'handled'}))
    return jsonify(response)


if __name__ == '__main__':
    socketio.run(server, host='localhost', port=5000)
