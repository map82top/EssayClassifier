class NotFoundEssayColumn(Exception):
    def __init__(self):
        super()

    def __str__(self):
        return "Ошибка чтения файла с эссе. Не найдена колонка 'text'"


class NotSupportEssayExtensionType(Exception):
    def __init__(self, extension):
        self.extension = extension
        super()

    def __str__(self):
        return f"Расширение файла эссе {self.extension} не поддерживается"


class NotSupportLectureExtensionType(Exception):
    def __init__(self, extension):
        self.extension = extension
        super()

    def __str__(self):
        return f"Расширение файла лекции {self.extension} не поддерживается"
