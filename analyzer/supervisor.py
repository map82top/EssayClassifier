from nltk.tokenize import sent_tokenize, word_tokenize, TweetTokenizer
from nltk.corpus import stopwords
stop_words = stopwords.words('russian')
import pymorphy2
import re


class Supervisor:
    def __init__(self):
        self.morph = pymorphy2.MorphAnalyzer()
        self.tokenizer = TweetTokenizer()

    def markup(self, text):
        statistic = dict()

        statistic['text'] = text
        statistic['num_letters'] = len(text)
        statistic['num_sentences'] = len(sent_tokenize(text, 'russian'))
        statistic['tokens'] = self.tokenize(text)
        statistic['num_words'] = len(statistic['tokens'])
        statistic['morph_tokens'] = [self.morph.parse(token)[0] for token in statistic['tokens']]

        return TextMarkup(statistic)

    def tokenize(self, text):
        tokens = self.tokenizer.tokenize(text)
        return [token.lower() for token in tokens if not self.is_rubbish(token.lower())]

    def is_rubbish(self, token):
        return self.is_punctuation(token) or re.match(r'\D*\d+\D*', token)

    def is_punctuation(self, token):
        match = re.match('^[.,\/#!$%\'\^&\*\";:{}=\-_`~()]$', token)
        return match is not None


class TextMarkup:
    def __init__(self, stats):
        self.stats = stats

    @property
    def text(self):
        return self.stats['text']

    @property
    def tokens(self):
        return self.stats['tokens']

    @property
    def morph_tokens(self):
        return self.stats['morph_tokens']


    @property
    def num_letters(self):
        return self.stats['num_letters']

    @property
    def num_words(self):
        return self.stats['num_words']

    @property
    def num_sentences(self):
        return self.stats['num_sentences']