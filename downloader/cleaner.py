import re

def clean_text(text):
    clean_paragraphs = []
    paragraphs = text.split('\n')
    for paragraph in paragraphs:
        paragraph = re.sub(r'http[s]?[^ ]+', '', paragraph)

        paragraph = re.sub(r'\[\w\].+', '', paragraph)

        paragraph = re.sub(r'[^\w\s.?!-%#;№()]', '', paragraph)

        if paragraph.strip() == '':
            continue

        clean_paragraphs.append(paragraph)

    return ' '.join(clean_paragraphs)