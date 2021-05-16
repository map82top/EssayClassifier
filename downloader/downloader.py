import pandas as pd
import os
from downloader.parser import text_from_html
import re
from downloader.cleaner import clean_text
import numpy as np

def is_file(path):
    return re.search(r'\.\w+$', path) is not None

def download_archive(drive, archive, item_callback):
    names = archive.namelist()
    essays = pd.DataFrame(columns=["author", "tag", "text"], index=np.arange(len(names)))
    names = list(filter(is_file, names))

    for i in range(len(names)):
        file_name = names[i]
        item = {"author": file_name.split('_')[0]}
        html_file = archive.read(os.path.join(file_name))
        html_text = text_from_html(html_file)
        links = re.findall(r'http[s]?://docs.google.com/[^ ]+', html_text)

        if len(links) == 0:
            clean_html_text = clean_text(html_text)
            if clean_html_text.strip() != '':
                item["text"] = clean_html_text
                item["tag"] = "TEXT"
            else:
                item["text"] = html_text
                item["tag"] = "IGNORE"
        elif len(links) == 1:
            print(links)
            link_content = drive.download_text_file(re.findall(r"d/\w+", links[0])[0][2:])
            if link_content.strip() != '':
                item["text"] = clean_text(link_content)
                item["tag"] = "LINK"
            else:
                item["text"] = html_text
                item["tag"] = "IGNORE"
        else:
            item["text"] = html_text
            item["tag"] = "IGNORE"

        essays.loc[i, :] = pd.Series(item)
        item_callback(i, len(names))

    return essays