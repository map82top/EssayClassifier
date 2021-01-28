import nltk
nltk.download('punkt')
nltk.download('stopwords')
import pandas as pd
from lecture_reader import LectureReader
from supervisor import Supervisor
from plagiat import create_plagiarism_matrix
from similarity import create_similarity_matrix

path_to_lecture = "../presentation2.pptx"
path_to_essays = "../esse2.xlsx"

lecture_reader = LectureReader()
supervisor = Supervisor()


essays = pd.read_excel(path_to_essays)['essay'].tolist()
essays.insert(0, lecture_reader.read(path_to_lecture))

essays = [supervisor.markup(essay) for essay in essays]

import seaborn as sns
import matplotlib.pyplot as plt
plagiat_matrix = create_plagiarism_matrix(essays)
sns.heatmap(plagiat_matrix)
plt.show()

similarity_matrix = create_similarity_matrix(essays)
sns.heatmap(similarity_matrix)
plt.show()


def find_all_sublings(group, idx):
    local_group = []
    for j in range(idx + 1, similarity_matrix.shape[0]):
        if similarity_matrix[idx, j] >= 10:
            if j not in essays_idx:
                continue
            essays_idx.remove(j)
            local_group.append(j)
            group.append(j)


essays_idx = [i for i in range(1, len(essays))]
groups = []

while len(essays_idx) > 0:
    group = []
    idx = essays_idx.pop(0)
    group.append(idx)
    find_all_sublings(group, idx)
    groups.append(group)

print("Группы сочинений")
for i in range(len(groups)):
    print(f"Группа {i+1}: {groups[i]}")

print('\n\n\n')

print("Зачет - Незачет")
for i in range(1, similarity_matrix.shape[0]):
    score = similarity_matrix[0, i]
    plagiat_score = round(plagiat_matrix[0, i], 1)
    result = "Зачет"
    if score < 3 or score > 18 or plagiat_score > 30:
        if score >= 2 and score <= 4 or score >= 17 and score <= 22:
            result = 'Незачет - Attention'
        else:
            result = 'Незачет'
        if plagiat_score > 10:
            result += f" Плагиат лекции на {plagiat_score}%"

    plagiat_str = None
    for j in range(1, plagiat_matrix.shape[0]):
        if j != i and plagiat_matrix[i, j] > 30:
            if plagiat_str is None:
                plagiat_str = f" Плагиат работ {j} - {round(plagiat_matrix[i, j], 1)}%"
            else:
                plagiat_str += f", {j} - {round(plagiat_matrix[i, j], 1)}%"

    if plagiat_str is not None:
        result += plagiat_str

    print(f"Работа {i} - {result}")







