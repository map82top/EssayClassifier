from pptx import Presentation
import re
import validators


class LectureReader:
    def read_from_file(self, path):
        prs = Presentation(path)
        text = ''
        for slide in prs.slides:
            text += self.handle_slide(slide)
        return text

    def read_from_presentation(self, presentation):
        text = ''
        for slide in presentation.slides:
            text += self.handle_slide(slide)
        return text

    def handle_slide(self, slide):
        text = ''
        for element in slide.shapes:
            if hasattr(element, "text"):
                for word in re.split(' ', element.text):
                    if not validators.url(word) and word.strip() != '':
                        text += ' ' + word

        return text
