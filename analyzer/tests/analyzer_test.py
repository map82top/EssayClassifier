import unittest
import json
from analyzer.analyzer import Analyzer
from analyzer.supervisor import Supervisor
import analyzer.plagiarism as plagiarism
import analyzer.similarity as similarity
import analyzer.lecture_reader as lecture_reader
from nltk.tokenize import sent_tokenize
from storage.schema import LabelType, GradeType
from pptx import Presentation
import numpy as np
import pandas as pd
from analyzer.exceptions import *
from analyzer.lecture_reader import read_from_presentation

TEST_DATA_PATH = "resources/test_data.json"
TEST_PRESENTATION_PATH = "resources/test_presentation.pptx"

def read_test_data():
    with open(TEST_DATA_PATH) as json_file:
        return json.load(json_file)

class PlagiarismTest(unittest.TestCase):
    def setUp(self):
        self.analyzer = Analyzer()
        self.supervisor = Supervisor()
        self.test_data = read_test_data()

    def tearDown(self):
        pass

    def test_find_similarity_groups_by_rows(self):
        similarity_matrix = np.asarray([[0, 6, 12, 8, 1],
                                        [5, 0, 4, 14, 9],
                                        [11, 5, 0, 7, 3],
                                        [7, 12, 8, 0, 14],
                                        [2, 10, 4, 12, 0]
        ])

        result = self.analyzer.find_similarity_groups_by_rows(similarity_matrix)
        self.assertEqual(result[1], 1)
        self.assertEqual(result[2], 2)
        self.assertEqual(result[3], 1)
        self.assertEqual(result[4], 3)

    def test_find_similarity_groups_by_mean_group_similarity(self):
        similarity_matrix = np.asarray([[0, 6, 12, 8, 1],
                                        [5, 0, 4, 14, 9],
                                        [11, 5, 0, 7, 3],
                                        [7, 12, 8, 0, 14],
                                        [2, 10, 4, 12, 0]
        ])
        result = self.analyzer.find_similarity_groups_by_mean_group_similarity(similarity_matrix)
        self.assertEqual(result[1], 1)
        self.assertEqual(result[2], 2)
        self.assertEqual(result[3], 1)
        self.assertEqual(result[4], 1)

    def test_analyze_test_via_supervisor(self):
        text = self.test_data["observer_test_text"]
        result = self.supervisor.markup(text)
        self.assertEqual(result.text, text)
        self.assertEqual(result.num_letters, 377)
        self.assertEqual(result.num_sentences, 10)
        self.assertEqual(result.num_words, 62)
        self.assertEqual(len(result.tokens), 62)
        self.assertEqual(len(result.morph_tokens), 62)

    def test_create_plagiarism_matrix(self):
        essays = self.test_data["plagiarism_test_essays"]
        essays = [self.supervisor.markup(essay) for essay in essays]
        matrix, coincidences = plagiarism.create_plagiarism_matrix(essays)

        self.assertEqual((matrix.shape == np.array([len(essays), len(essays)])).all(), True)
        # для полюсного эссе номер 1
        self.assertEqual(matrix[0, 1] == 100, True) # эссе имеет сходство по 100% предолжений
        self.assertEqual(matrix[0, 2] > 33 and matrix[0, 2] < 65, True) # эссе имеет сходство по 50% предолжений
        self.assertEqual(matrix[0, 3] == 0, True)

        # для полюсного эссе номер 2
        self.assertEqual(matrix[3, 0] == 0, True)
        self.assertEqual(matrix[3, 1] == 0, True) # эссе имеет сходство по 0% предолжений
        self.assertEqual(matrix[3, 2] > 35 and matrix[3, 2] < 65, True) # эссе имеет сходство по 50% предолжений

    def test_similarity_matrix(self):
        essays = self.test_data["similarity_test_essays"]
        essays = [self.supervisor.markup(essay) for essay in essays]
        result = similarity.create_similarity_matrix(essays)

        self.assertEqual((result.shape == np.array([len(essays), len(essays)])).all(), True)
        # для эссе номер 1
        self.assertEqual(result[0, 1] > 13, True)  # эссе на ту же тему
        self.assertEqual(result[0, 2] > 4 and result[0, 2] < 10, True)  # эссе на пересекающуюся тему
        self.assertEqual(result[0, 3] < 4, True)  # эссе на обособленную тему

    def test_read_from_file(self):
        expected_text = self.test_data["lecture_reader_expected_text"].strip()
        presentation_text = lecture_reader.read_from_file(TEST_PRESENTATION_PATH).strip()
        self.assertEqual(presentation_text, expected_text)

    def test_analyzer(self):
        lecture = Presentation(TEST_PRESENTATION_PATH)
        lecture_text = read_from_presentation(lecture)
        essays = self.test_data["analyzer_test_essays"]
        pd_essays = pd.DataFrame(data=essays, columns=["text"])
        report = self.analyzer.analyze(lecture_text, pd_essays)
        self.assert_lecture(self.test_data["lecture_reader_expected_text"], report.lecture, 176)
        self.assert_essay(essays[0], report.essays[0], GradeType.FAIL, 1, [LabelType.FAIL, LabelType.LECTURE_PLAGIARISM], 302)
        self.assert_essay(essays[1], report.essays[1], GradeType.SUCCESS, 1, [LabelType.SUCCESS], 338)
        self.assert_essay(essays[2], report.essays[2], GradeType.FAIL, 2, [LabelType.FAIL], 246)

    def assert_lecture(self, text, lecture, num_words):
        self.assertEqual(lecture.text, text)
        self.assertEqual(lecture.statistic.num_letters, len(text))
        self.assertEqual(lecture.statistic.num_sentences, len(sent_tokenize(text)))
        self.assertEqual(lecture.statistic.num_words, num_words)

    def assert_essay(self, text, essay, grade, group, labels, num_words):
        self.assertEqual(essay.text, text)
        self.assertEqual(essay.statistic.num_letters, len(text))
        self.assertEqual(essay.statistic.num_sentences, len(sent_tokenize(text)))
        self.assertEqual(essay.statistic.num_words, num_words)
        self.assertEqual(essay.grade, grade)
        self.assertEqual(essay.group, group)
        self.assertEqual(len(labels), len(essay.labels))
        for label in essay.labels:
            if label.type in labels:
                labels.remove(label.type)
            else:
                self.assertEqual(True, False)

        self.assertEqual(len(labels), 0)

    def test_analyzer_incorrect_essay_list(self):
        lecture = Presentation(TEST_PRESENTATION_PATH)
        essays = self.test_data["analyzer_test_essays"]
        pd_essays = pd.DataFrame(data=essays, columns=["roles"])
        self.assertRaises(NotFoundEssayColumn, self.analyzer.analyze, lecture, pd_essays)

if __name__ == "__main__":
    unittest.main()