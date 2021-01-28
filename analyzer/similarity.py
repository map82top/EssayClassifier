from nltk.corpus import stopwords
import numpy as np
from gensim import models, corpora
stop_words = stopwords.words('russian')

allowable_pos = {'NOUN', 'ADJF', 'ADJS'}

def create_similarity_matrix(essays):
    clean_essays = []
    dictionary = dict()

    for essay in essays:
        clean_essay_tokens = []
        for token in essay.morph_tokens:
            if token.normal_form not in stop_words and token.tag.POS in allowable_pos:
                clean_essay_tokens.append(token.normal_form)
                dictionary[token.normal_form] = ''

        clean_essays.append(clean_essay_tokens)

    comparing_matrix = np.empty((len(essays), len(essays)))

    reference_dct = corpora.Dictionary([dictionary.keys()])

    for i in range(len(clean_essays)):
        reference = clean_essays[i]
        reference_corpus = reference_dct.doc2bow(reference)

        lsi = models.LsiModel(
            corpus=[reference_corpus],
            id2word=reference_dct)

        for j in range(len(clean_essays)):
            if i == j:
                comparing_matrix[i, j] = 0
                continue

            essay_corpus = reference_dct.doc2bow(clean_essays[j])
            comparing_matrix[i, j] = np.max(lsi[essay_corpus])

    return comparing_matrix
