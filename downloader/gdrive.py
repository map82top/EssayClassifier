from __future__ import print_function
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
import os
import io
from googleapiclient.http import MediaIoBaseDownload

# If modifying these scopes, delete the file token.json.
SCOPES = []

class Drive():
    def __init__(self, resource_directory):
        self.scopes = ['https://www.googleapis.com/auth/drive']
        self.credentials_path = os.path.join(resource_directory, 'credentials.json')
        self.token_path = os.path.join(resource_directory, 'token.json')
        self._load_service()

    def _load_service(self):
        creds = None
        if os.path.exists(self.token_path):
            creds = Credentials.from_authorized_user_file(self.token_path, SCOPES)
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    self.credentials_path, self.scopes)
                creds = flow.run_local_server(port=0)
            with open(self.token_path, 'w') as token:
                token.write(creds.to_json())

        self.service = build('drive', 'v3', credentials=creds)

    def download_text_file(self, file_id):
        try:
            request = self.service.files().export_media(fileId=file_id, mimeType='text/plain')
            fh = io.BytesIO()
            downloader = MediaIoBaseDownload(fd=fh, request=request)
            done = False
            while not done:
                status, done = downloader.next_chunk()

            fh.seek(0)
            wrapper = io.TextIOWrapper(fh, encoding='utf-8')
            return wrapper.read()

        except Exception as e:
            print(e)
            return ''
