import nltk
from storage.schema import *
from analyzer.lecture_reader import read_from_presentation
from analyzer.supervisor import Supervisor
from analyzer.plagiarism import create_plagiarism_matrix
from analyzer.similarity import create_similarity_matrix
from analyzer.exceptions import NotFoundEssayColumn
import numpy as np

nltk.download('punkt')
nltk.download('stopwords')

def column_to_lower(dataFrame):
    dataFrame.columns = [col_name.lower() for col_name in dataFrame.columns.to_list()]

class Analyzer:
    def __init__(self):
        self.supervisor = Supervisor()

    def analyze(self, lecture, essays):
        lecture_text = read_from_presentation(lecture)
        column_to_lower(essays)

        if 'essay' not in essays.columns:
            raise NotFoundEssayColumn()

        essays = essays.loc[:, 'essay'].tolist()

        essays.insert(0, lecture_text)
        essays = [self.supervisor.markup(essay) for essay in essays]

        plagiarism_matrix = create_plagiarism_matrix(essays)
        similarity_matrix = create_similarity_matrix(essays)

        groups = self.find_similarity_groups_by_rows(similarity_matrix)
        count_essays = len(essays) - 1
        graded_essays = [Essay() for _ in range(count_essays)]
        lecture = None

        for i, essay in enumerate(essays):
            if i == 0:
                lecture = self.handle_lecture(essay)
            else:
                self.handle_essay(i, essay, graded_essays, groups[i], similarity_matrix, plagiarism_matrix)

        return Report(
            lecture=lecture,
            essays=graded_essays
        )


    def handle_lecture(self, lecture):
        return Lecture(
            text=lecture.text,
            statistic=Statistic(
                num_letters=lecture.num_letters,
                num_words=lecture.num_words,
                num_sentences=lecture.num_sentences
            )
        )


    def handle_essay(self, index, essay, graded_essays, group, similarity_matrix, plagiarism_matrix):
        score = similarity_matrix[0, index]
        plagiarism_score = round(plagiarism_matrix[0, index], 1)
        grade = None
        labels = []

        if score < 3 or score > 18 or plagiarism_score > 30:
            if 2 <= score <= 4 or 17 <= score <= 22:
                grade = GradeType.FAIL
                labels.append(
                    Label(type=LabelType.ATTENTION)
                )
                labels.append(
                    Label(type=LabelType.FAIL)
                )
            else:
                grade = GradeType.FAIL
                labels.append(
                    Label(type=LabelType.FAIL)
                )
            if plagiarism_score > 25:
                labels.append(
                    Label(type=LabelType.LECTURE_PLAGIARISM, probability=plagiarism_score)
                )

        for j in range(1, plagiarism_matrix.shape[0]):
            if j != index and plagiarism_matrix[index, j] > 30:
                essay_index = j - 1
                labels.append(
                    Label(type=LabelType.ESSAY_PLAGIARISM, reference=graded_essays[essay_index], probability=round(plagiarism_matrix[index, j], 1))
                )

        if grade is None:
            grade = GradeType.SUCCESS
            labels.append(
                Label(type=LabelType.SUCCESS)
            )

        real_essay_index = index - 1
        db_essay = graded_essays[real_essay_index]
        db_essay.text = essay.text
        db_essay.grade = grade
        db_essay.group = group
        db_essay.labels = labels
        db_essay.statistic = Statistic(
                num_letters=essay.num_letters,
                num_words=essay.num_words,
                num_sentences=essay.num_sentences
            )


    def find_similarity_groups_by_rows(self, similarity_matrix):
        count_texts = similarity_matrix.shape[0]
        essays_idx = [i for i in range(1, count_texts)]
        group_by_essay = dict()
        current_group_id = 1

        while len(essays_idx) > 0:
            idx = essays_idx.pop(0)
            group_by_essay[idx] = current_group_id

            # find all siblings
            for j in range(idx + 1, similarity_matrix.shape[0]):
                if similarity_matrix[idx, j] >= 10:
                    if j not in essays_idx:
                        continue
                    essays_idx.remove(j)
                    group_by_essay[j] = current_group_id

            current_group_id += 1

        return group_by_essay


    def find_similarity_groups_by_mean_group_similarity(self, similarity_matrix):
        count_texts = similarity_matrix.shape[0]
        essays_idx = [i for i in range(1, count_texts)]
        group_by_essay = dict()
        essays_by_group = dict()
        current_group_id = 0
        essays_by_group.keys()

        while len(essays_idx) > 0:
            idx = essays_idx.pop(0)
            group_id = self.find_nearest_existed_group(idx, similarity_matrix, essays_by_group)
            if group_id is not None:
                essays_by_group[group_id].append(idx)
                group_by_essay[idx] = group_id
            else:
                current_group_id += 1
                essays_by_group[current_group_id] = [idx]
                group_by_essay[idx] = current_group_id

        return group_by_essay


    def find_nearest_existed_group(self, idx, similarity_matrix, essays_by_group):
        nearest_group_id = None
        max_mean = 0
        for group_id in essays_by_group.keys():
            mean_similarity = np.array([similarity_matrix[idx, j] for j in essays_by_group[group_id]]).mean()
            if mean_similarity >= 8 and max_mean < mean_similarity:
                nearest_group_id = group_id
                max_mean = mean_similarity

        return nearest_group_id







