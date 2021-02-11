import nltk
nltk.download('punkt')
nltk.download('stopwords')
import pandas as pd
from lecture_reader import LectureReader
from supervisor import Supervisor
from plagiarism import create_plagiarism_matrix
from similarity import create_similarity_matrix
import numpy as np

path_to_lecture = "/home/ilya/Documents/Diplom/EssayClassifier/presentation.pptx"
path_to_essays = "/home/ilya/Documents/Diplom/EssayClassifier/esse.xlsx"

lecture_reader = LectureReader()
supervisor = Supervisor()


essays = pd.read_excel(path_to_essays)['essay'].tolist()
essays.insert(0, lecture_reader.read_from_file(path_to_lecture))

essays = [supervisor.markup(essay) for essay in essays]

import seaborn as sns
import matplotlib.pyplot as plt
plagiat_matrix = create_plagiarism_matrix(essays)
sns.heatmap(plagiat_matrix)
plt.show()

similarity_matrix = create_similarity_matrix(essays)
sns.heatmap(similarity_matrix)
plt.show()

def find_similarity_groups(similarity_matrix):
    count_texts = similarity_matrix.shape[0]
    essays_idx = [i for i in range(1, count_texts)]
    group_by_essay = dict()
    essays_by_group = dict()
    current_group_id = 0
    essays_by_group.keys()

    while len(essays_idx) > 0:
        idx = essays_idx.pop(0)
        group_id = find_nearest_existed_group(idx, similarity_matrix, essays_by_group)
        if group_id is not None:
            essays_by_group[group_id].append(idx)
            group_by_essay[idx] = group_id
        else:
            current_group_id += 1
            essays_by_group[current_group_id] = [idx]
            group_by_essay[idx] = current_group_id

    return list(essays_by_group.values())

def find_nearest_existed_group(idx, similarity_matrix, essays_by_group):
    nearest_group_id = None
    max_mean = 0
    for group_id in essays_by_group.keys():
        groups_similarity = np.asarray([similarity_matrix[idx, j] for j in essays_by_group[group_id]])
        mean_similarity = groups_similarity.mean()
        if mean_similarity >= 9 and max_mean < mean_similarity:
            nearest_group_id = group_id
            max_mean = mean_similarity

    return nearest_group_id


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
groups = find_similarity_groups(similarity_matrix)

# while len(essays_idx) > 0:
#     group = []
#     idx = essays_idx.pop(0)
#     group.append(idx)
#     find_all_sublings(group, idx)
#     groups.append(group)

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







