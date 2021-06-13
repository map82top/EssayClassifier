from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field, SQLAlchemySchemaOpts
from storage.schema import *
from marshmallow_sqlalchemy.fields import Nested
from marshmallow import EXCLUDE


class LabelSchema(SQLAlchemySchema):
    class Meta:
        model = Label
        load_instance = True
        unknown = EXCLUDE

    id = auto_field()
    type = auto_field()
    probability = auto_field()
    reference = auto_field()


class StatisticSchema(SQLAlchemySchema):
    class Meta:
        model = Statistic
        load_instance = True
        unknown = EXCLUDE

    id = auto_field()
    num_letters = auto_field()
    num_words = auto_field()
    num_sentences = auto_field()


class EssaySchema(SQLAlchemySchema):
    class Meta:
        model = Essay
        load_instance = True
        unknown = EXCLUDE

    id = auto_field()
    text = auto_field()
    grade = auto_field()
    teacher_grade = auto_field()
    group = auto_field()
    author = auto_field()
    coincidence = auto_field()
    statistic = Nested(StatisticSchema)
    labels = Nested(LabelSchema, many=True)


class LectureSchema(SQLAlchemySchema):
    class Meta:
        model = Lecture
        load_instance = True
        unknown = EXCLUDE

    id = auto_field()
    text = auto_field()
    coincidence = auto_field()
    statistic = Nested(StatisticSchema)


class ReportSchema(SQLAlchemySchema):
    class Meta:
        model = Report
        load_instance = True
        unknown = EXCLUDE

    id = auto_field()
    lecture = Nested(LectureSchema)
    essays = Nested(EssaySchema, many=True)
