import numpy as np
import binascii

functors_pos = {'NOUN', 'VERB', 'INFN'}


def create_plagiarism_matrix(essays):
    shingle_essays = []

    for essay in essays:
        tokens = essay.morph_tokens

        normalize_essay = [token.normal_form for token in tokens if token.tag.POS in functors_pos]

        shingle_essay = genshingle(normalize_essay)
        shingle_essays.append(shingle_essay)

    plagiarism_matrix = np.empty((len(shingle_essays), len(shingle_essays)))

    for i in range(len(shingle_essays)):
        for j in range(i, len(shingle_essays)):
            if i == j:
                plagiarism_matrix[i, j] = 100
                continue

            score = compare(shingle_essays[i], shingle_essays[j])
            plagiarism_matrix[i, j] = score
            plagiarism_matrix[j, i] = score

    return plagiarism_matrix


def genshingle(tokens):
    shingle_len = 10 #длина шингла
    shingles = []
    for i in range(len(tokens) - (shingle_len - 1)):
        shingles.append(binascii.crc32(' '.join([x for x in tokens[i:i + shingle_len]]).encode('utf-8')))

    return shingles


def compare(shingles_first_text, shingles_second_text):
    same = 0
    count_shingles1 = len(shingles_first_text)
    count_shingles2 = len(shingles_second_text)

    for i in range(count_shingles1):
        if shingles_first_text[i] in shingles_second_text:
            same = same + 1

    return same/(count_shingles1/100)



