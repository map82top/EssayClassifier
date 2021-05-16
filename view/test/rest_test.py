import unittest
from view.rest import EstimatorServer
import io
from werkzeug.datastructures import FileStorage
import os
import json
from storage.schema import LabelType, GradeType
from nltk.tokenize import sent_tokenize


TEST_DATA_PATH = "resources/test_data.json"


def read_test_data():
    with open(TEST_DATA_PATH) as json_file:
        return json.load(json_file)


class RestTest(unittest.TestCase):
    def setUp(self):
        self.server = EstimatorServer("../../downloader/resources")
        self.flask_client = self.server.server.test_client()
        self.socket_client = self.server.socketio.test_client(self.server.server,
                                                              flask_test_client=self.flask_client)
        self.test_data = read_test_data()
        pass

    def tearDown(self):
        pass

    def test_socketio_connect(self):
        self.assertTrue(self.socket_client.is_connected())
        self.socket_client.disconnect()
        self.assertFalse(self.socket_client.is_connected())

    def test_index(self):
        response = self.flask_client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.data)

    def test_upload(self):
        data = {}
        lecture = FileStorage(
            stream=open("resources/test_presentation.pptx", "rb"),
            filename="test_presentation.pptx",
        )
        essays = FileStorage(
            stream=open("resources/test_essays_list.xlsx", "rb"),
            filename="test_essays_list.xlsx",
        ),
        data['lecture'] = lecture
        data['essays'] = essays

        response = self.flask_client.post('/upload', content_type='multipart/form-data', data=data)
        socket_response = self.socket_client.get_received()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(socket_response), 3)
        handling_notification = socket_response[0]
        self.assertEqual(handling_notification['name'], 'changed-report-status')
        self.assertEqual(len(handling_notification['args']), 1)
        status_message = json.loads(handling_notification['args'][0])
        self.assertEqual(status_message["status"], "handling")

        handled_notification = socket_response[2]
        self.assertEqual(handled_notification['name'], 'changed-report-status')
        self.assertEqual(len(handled_notification['args']), 1)
        status_message = json.loads(handled_notification['args'][0])
        self.assertEqual(status_message["status"], "handled")

        report = json.loads(response.data)
        essays = self.test_data["upload_test_essays"]
        self.assert_lecture(self.test_data["lecture_expected_text"], report["lecture"], 176)
        self.assert_essay(essays[0], report["essays"][0], GradeType.FAIL, 1,
                          [LabelType.FAIL, LabelType.LECTURE_PLAGIARISM], 302)
        self.assert_essay(essays[1], report["essays"][1], GradeType.SUCCESS, 1, [LabelType.SUCCESS], 338)
        self.assert_essay(essays[2], report["essays"][2], GradeType.FAIL, 2, [LabelType.FAIL], 246)

    def assert_lecture(self, text, lecture, num_words):
        self.assertEqual(lecture["text"], text)
        self.assertEqual(lecture["statistic"]["num_letters"], len(text))
        self.assertEqual(lecture["statistic"]["num_sentences"], len(sent_tokenize(text)))
        self.assertEqual(lecture["statistic"]["num_words"], num_words)

    def assert_essay(self, text, essay, grade, group, labels, num_words):
        self.assertEqual(essay["text"], text)
        self.assertEqual(essay["statistic"]["num_letters"], len(text))
        self.assertEqual(essay["statistic"]["num_sentences"], len(sent_tokenize(text)))
        self.assertEqual(essay["statistic"]["num_words"], num_words)
        self.assertEqual(essay["grade"], grade)
        self.assertEqual(essay["group"], group)
        self.assertEqual(len(labels), len(essay["labels"]))
        for label in essay["labels"]:
            if label["type"] in labels:
                labels.remove(label["type"])
            else:
                self.assertEqual(True, False)

        self.assertEqual(len(labels), 0)

    def test_upload_incorrect_essay_list(self):
        data = {}
        lecture = FileStorage(
            stream=open("resources/test_presentation.pptx", "rb"),
            filename="test_presentation.pptx",
        )
        essays = FileStorage(
            stream=open("resources/test_incorrect_list.xlsx", "rb"),
            filename="test_incorrect_list.xlsx",
        ),
        data['lecture'] = lecture
        data['essays'] = essays

        response = self.flask_client.post('/upload', content_type='multipart/form-data', data=data)
        socket_response = self.socket_client.get_received()

        self.assertEqual(response.status_code, 500)
        self.assertEqual(len(socket_response), 2)
        handling_notification = socket_response[0]
        self.assertEqual(handling_notification['name'], 'changed-report-status')
        self.assertEqual(len(handling_notification['args']), 1)
        status_message = json.loads(handling_notification['args'][0])
        self.assertEqual(status_message["status"], "handling")

        exception = json.loads(response.data)
        self.assertEqual(exception["status"], "error")
        self.assertIsNotNone(exception["text"])

    def test_upload_without_files(self):
        data = {}

        response = self.flask_client.post('/upload', content_type='multipart/form-data', data=data)
        socket_response = self.socket_client.get_received()

        self.assertEqual(response.status_code, 302)
        self.assertEqual(len(socket_response), 0)

    def test_upload_incorrect_files(self):
        data = {}
        lecture = FileStorage(
            stream=io.BytesIO(b"Empty file"),
            filename="test_presentation.pptx",
        )
        essays = FileStorage(
            stream=io.BytesIO(b"Empty file"),
            filename="test_incorrect_list.xlsx",
        ),
        data['lecture'] = lecture
        data['essays'] = essays

        response = self.flask_client.post('/upload', content_type='multipart/form-data', data=data)
        socket_response = self.socket_client.get_received()

        self.assertEqual(500, response.status_code)
        self.assertEqual(1, len(socket_response))
        exception = json.loads(response.data)
        self.assertEqual(exception["status"], "error")
        self.assertIsNotNone(exception["text"])


    def test_end_check(self):
        data = {}
        lecture = FileStorage(
            stream=open("resources/test_presentation.pptx", "rb"),
            filename="test_presentation.pptx",
        )
        essays = FileStorage(
            stream=open("resources/test_essays_list.xlsx", "rb"),
            filename="test_essays_list.xlsx",
        ),
        data['lecture'] = lecture
        data['essays'] = essays

        response = self.flask_client.post('/upload', content_type='multipart/form-data', data=data)
        socket_response = self.socket_client.get_received()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(socket_response), 3)

        report = json.loads(response.data)
        change_essay = report["essays"][0]
        change_essay["teacher_grade"] = "SUCCESS"
        change_essay["labels"].append({"type": "TEACHER_SUCCESS"})
        json_report = json.dumps(report)

        response = self.flask_client.post('/end_check', data=json_report)
        socket_response = self.socket_client.get_received()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(socket_response), 0)
        success = json.loads(response.data)
        self.assertEqual(success["status"], "success")
        self.assertIsNotNone(success["text"])

    def test_end_check_incorrect_data(self):
        json_report = json.dumps({"data": "incorrect"})
        response = self.flask_client.post('/end_check', data=json_report)
        socket_response = self.socket_client.get_received()

        self.assertEqual(response.status_code, 500)
        self.assertEqual(len(socket_response), 0)
        exception = json.loads(response.data)
        self.assertEqual(exception["status"], "error")
        self.assertIsNotNone(exception["text"])


if __name__ == '__main__':
    unittest.main()