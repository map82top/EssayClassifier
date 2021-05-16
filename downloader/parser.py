from bs4 import BeautifulSoup
from bs4.element import Comment


def text_from_html(body):
    soup = BeautifulSoup(body, 'lxml')
    texts = soup.findAll(text=True)
    visible_texts = filter(_tag_visible, texts)
    return u" ".join(t.strip() for t in visible_texts)


def _tag_visible(element):
    if element.parent.name in ['style', 'script', 'head', 'title', 'meta', '[document]']:
        return False
    if isinstance(element, Comment):
        return False
    return True

