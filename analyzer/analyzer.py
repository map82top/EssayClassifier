import nltk
import enum
from analyzer.lecture_reader import LectureReader
from analyzer.supervisor import Supervisor
from analyzer.plagiarism import create_plagiarism_matrix
from analyzer.similarity import create_similarity_matrix
from dataclasses import dataclass

nltk.download('punkt')
nltk.download('stopwords')

lecture_reader = LectureReader()
supervisor = Supervisor()

first_text = "Когда человек сознательно или интуитивно выбирает себе в жизни какую-то цель, жизненную задачу, он невольно дает себе оценку. По тому, ради чего человек живет, можно судить и о его самооценке - низкой или высокой."
second_text = "Если человек живет, чтобы приносить людям добро, облегчать их страдания, давать людям радость, то он оценивает себя на уровне этой своей человечности. Он ставит себе цель, достойную человека."
third_text = "Только такая цель позволяет человеку прожить свою жизнь с достоинством и получить настоящую радость. Да, радость! Подумайте: если человек ставит себе задачей увеличивать в жизни добро, приносить людям счастье, какие неудачи могут его постигнуть? Не тому помочь? Но много ли людей не нуждаются в помощи?"
fourth_text = "Если жить только для себя, своими мелкими заботами о собственном благополучии, то от прожитого не останется и следа. Если же жить для других, то другие сберегут то, чему служил, чему отдавал силы."
fifth_text = "Можно по-разному определять цель своего существования, но цель должна быть. Надо иметь и принципы в жизни. Одно правило в жизни должно быть у каждого человека, в его цели жизни, в его принципах жизни, в его поведении: надо прожить жизнь с достоинством, чтобы не стыдно было вспоминать."
lecture_text = "Жизнь - прежде всего творчество, но это не значит, что каждый человек, чтобы жить, должен родиться художником, балериной или ученым. Можно творить просто добрую атмосферу вокруг себя. Человек может принести с собой атмосферу подозрительности, какого-то тягостного молчания, а может внести сразу радость, свет. Вот это и есть творчество."


def mock_report():
    graded_essays = []

    graded_essays.append(GradedEssay(
        "",
        lecture_text,
        GradeType.SUCCESS,
        None,
        None,
        True
    ))

    graded_essays.append(GradedEssay(
        "1",
        first_text,
        GradeType.SUCCESS,
        1,
        [
            Label(LabelType.SUCCESS),
            Label(LabelType.ATTENTION)
        ],
        False
    ))

    graded_essays.append(GradedEssay(
        "2",
        second_text,
        GradeType.SUCCESS,
        1,
        [
            Label(LabelType.SUCCESS)
        ],
        False
    ))

    graded_essays.append(GradedEssay(
        "3",
        third_text,
        GradeType.FAIL,
        1,
        [
            Label(LabelType.FAIL),
            Label(LabelType.ATTENTION),
            Label(LabelType.LECTURE_PLAGIARISM, probability=0.56),
            Label(LabelType.ESSAY_PLAGIARISM, 5, 0.58)
        ],
        False
    ))

    graded_essays.append(GradedEssay(
        "4",
        fourth_text,
        GradeType.SUCCESS,
        1,
        [
            Label(LabelType.SUCCESS),
            Label(LabelType.ATTENTION),
            Label(LabelType.LECTURE_PLAGIARISM, probability=0.2),
        ],
        False
    ))

    graded_essays.append(GradedEssay(
        "5",
        fifth_text,
        GradeType.FAIL,
        1,
        [
            Label(LabelType.FAIL),
            Label(LabelType.LECTURE_PLAGIARISM, probability=0.76),
            Label(LabelType.ESSAY_PLAGIARISM, 3, 0.4)
        ],
        False
    ))

    return graded_essays


def analyze(lecture, essays):
    lecture_text = lecture_reader.read_from_presentation(lecture)
    essays = essays['essay'].tolist()

    essays.insert(0, lecture_text)
    essays = [supervisor.markup(essay) for essay in essays]

    plagiarism_matrix = create_plagiarism_matrix(essays)
    similarity_matrix = create_similarity_matrix(essays)

    groups = find_similarity_groups(similarity_matrix)

    graded_essays = []
    for i, essay in enumerate(essays):
        score = similarity_matrix[0, i]
        plagiarism_score = round(plagiarism_matrix[0, i], 1)
        grade = None
        labels = []

        if score < 3 or score > 18 or plagiarism_score > 30:
            if score >= 2 and score <= 4 or score >= 17 and score <= 22:
                grade = GradeType.FAIL
                labels.append(
                    Label(LabelType.ATTENTION)
                )
                labels.append(
                    Label(LabelType.FAIL)
                )
            else:
                grade = GradeType.FAIL
                labels.append(
                    Label(LabelType.FAIL)
                )
            if plagiarism_score > 10:
                labels.append(
                    Label(type=LabelType.LECTURE_PLAGIARISM, probability=plagiarism_score)
                )

        for j in range(1, plagiarism_matrix.shape[0]):
            if j != i and plagiarism_matrix[i, j] > 30:
                labels.append(
                    Label(LabelType.ESSAY_PLAGIARISM, j, round(plagiarism_matrix[i, j], 1))
                )

        if grade is None:
            grade = GradeType.SUCCESS
            labels.append(
                Label(LabelType.SUCCESS)
            )

        is_lecture = False
        group = None
        if i == 0:
            is_lecture = True
        else:
            group = groups[i]

        graded_essays.append(GradedEssay(
            f'essay-{i}',
            essay.text,
            grade,
            group,
            labels,
            is_lecture,
            Statistic(
                essay.num_letters,
                essay.num_words,
                essay.num_sentences
            )
        ))

    return graded_essays


def find_similarity_groups(similarity_matrix):
    count_texts = similarity_matrix.shape[0]
    essays_idx = [i for i in range(1, count_texts)]
    essay_group = dict()
    current_group_id = 1

    while len(essays_idx) > 0:
        idx = essays_idx.pop(0)
        essay_group[idx] = current_group_id

        #find all siblings
        for j in range(idx + 1, similarity_matrix.shape[0]):
            if similarity_matrix[idx, j] >= 10:
                if j not in essays_idx:
                    continue
                essays_idx.remove(j)
                essay_group[j] = current_group_id

        current_group_id += 1

    return essay_group


class GradeType(str, enum.Enum):
    SUCCESS = 'success'
    FAIL = 'fail'


class LabelType(str, enum.Enum):
    ATTENTION = 'attention'
    LECTURE_PLAGIARISM = 'lecture_plagiarism'
    ESSAY_PLAGIARISM = 'essay_plagiarism'
    SUCCESS = 'success'
    FAIL = 'fail'


@dataclass
class Label:
    type: LabelType
    reference: int = None
    probability: int = None

@dataclass
class Statistic:
    num_letters: int
    num_words: int
    num_sentences: int


@dataclass
class GradedEssay:
    key: str
    text: str
    grade: GradeType
    group: int
    labels: list
    is_lecture: bool
    statistic: Statistic






