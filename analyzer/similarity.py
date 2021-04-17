from nltk.corpus import stopwords
import numpy as np
from gensim import models, corpora
stop_words = stopwords.words('russian')

allowable_pos = {'NOUN', 'ADJF', 'ADJS'}

def create_similarity_matrix(essays):
    clean_essays = []
    dictionary = list()

    for essay in essays:
        clean_essay_tokens = []
        for token in essay.morph_tokens:
            if token.normal_form not in stop_words and token.tag.POS in allowable_pos:
                clean_essay_tokens.append(token.normal_form)
                dictionary.append(token.normal_form)

        clean_essays.append(clean_essay_tokens)

    similarity_matrix = np.empty((len(clean_essays), len(clean_essays)))

    reference_dct = corpora.Dictionary([dictionary])

    for i in range(len(clean_essays)):
        reference = clean_essays[i]
        reference_corpus = reference_dct.doc2bow(reference)

        lsi = models.LsiModel(
            corpus=[reference_corpus],
            id2word=reference_dct)

        for j in range(len(clean_essays)):
            if i == j:
                similarity_matrix[i, j] = 0
                continue

            essay_corpus = reference_dct.doc2bow(clean_essays[j])

            similarity_score = lsi[essay_corpus]
            if type(similarity_score) is list:
                if len(similarity_score) == 1:
                    similarity_matrix[i, j] = lsi[essay_corpus][0][1]
                elif len(similarity_score) == 0:
                    similarity_matrix[i, j] = 0
                else:
                    a = 10

    return similarity_matrix
