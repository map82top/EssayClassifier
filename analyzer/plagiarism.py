import numpy as np
import binascii

functors_pos = {'NOUN', 'VERB', 'INFN'}


def create_plagiarism_matrix(essays):
    shingle_essays = []
    border_shingles = []
    coincidences = dict()

    for i, essay in enumerate(essays):
        tokens = essay.morph_tokens
        coincidences[i] = dict()

        normalize_essay = []
        border_normal_token = []
        start_position = 0
        for i, token in enumerate(tokens):
            if token.tag.POS in functors_pos:
                normalize_essay.append(token.normal_form)
                border_normal_token.append((start_position, i))
                start_position = i

        shingle_essay, border_shingle = genshingle(normalize_essay, border_normal_token)
        shingle_essays.append(shingle_essay)
        border_shingles.append(border_shingle)

    plagiarism_matrix = np.empty((len(shingle_essays), len(shingle_essays)))

    for i in range(len(shingle_essays)):
        for j in range(i, len(shingle_essays)):
            if i == j:
                plagiarism_matrix[i, j] = 100
                continue

            score, i_border, j_border = compare(shingle_essays[i], shingle_essays[j], border_shingles[i], border_shingles[j])
            plagiarism_matrix[i, j] = score
            plagiarism_matrix[j, i] = score
            coincidences[i][j] = i_border
            coincidences[j][i] = j_border

    return plagiarism_matrix, coincidences


def genshingle(tokens, border_normal_token):
    shingle_len = 10 #длина шингла
    shingles = []
    border_shingle = []
    for i in range(len(tokens) - (shingle_len - 1)):
        shingles.append(binascii.crc32(' '.join([x for x in tokens[i:i + shingle_len]]).encode('utf-8')))
        border_shingle.append((border_normal_token[i][0], border_normal_token[i + shingle_len - 1][1]))

    return shingles, border_shingle


def compare(shingles_first_text, shingles_second_text, border_shingle_first, border_shingle_second):
    same = 0
    count_shingles1 = len(shingles_first_text)
    count_shingles2 = len(shingles_second_text)
    i_border = []
    j_border = []

    for i in range(count_shingles1):
        for j in range(count_shingles2):
            if shingles_first_text[i] == shingles_second_text[j]:
                i_border.append(border_shingle_first[i])
                j_border.append(border_shingle_second[j])
                same = same + 1

    count_shingles = count_shingles1 + count_shingles2
    if count_shingles == 0:
        count_shingles = 1

    first_union_border = get_union_border(i_border)
    second_union_border = get_union_border(j_border)

    return same*2/float(count_shingles)*100, first_union_border, second_union_border

def get_union_border(border):
    if len(border) == 0:
        return border

    current_item = border[0]
    union_border = []
    for i in range(1, len(border)):
         if border[i][0] < current_item[1]:
             current_item = (current_item[0], border[i][1])
         else:
             union_border.append(current_item)
             current_item = border[i]

    union_border.append(current_item)
    return union_border


