import enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import MetaData, Column, Integer, Text, create_engine, Enum, ForeignKey, Table
from sqlalchemy.orm import relationship

metadata = MetaData()
Base = declarative_base(metadata)


class GradeType(str, enum.Enum):
    SUCCESS = 'SUCCESS'
    FAIL = 'FAIL'


class LabelType(str, enum.Enum):
    ATTENTION = 'ATTENTION'
    LECTURE_PLAGIARISM = 'LECTURE_PLAGIARISM'
    ESSAY_PLAGIARISM = 'ESSAY_PLAGIARISM'
    SUCCESS = 'SUCCESS'
    TEACHER_SUCCESS = 'TEACHER_SUCCESS'
    TEACHER_FAIL = 'TEACHER_FAIL'
    FAIL = 'FAIL'


class Report(Base):
    __tablename__ = 'report'
    id = Column(Integer, primary_key=True)

    # relations
    essays = relationship('Essay', backref="report")
    lecture_id = Column(Integer, ForeignKey('lecture.id'))
    lecture = relationship('Lecture', uselist=False, backref='report')


class Essay(Base):
    __tablename__ = 'essay'
    id = Column(Integer, primary_key=True)

    # field
    text = Column(Text)
    grade = Column(Enum(GradeType))
    teacher_grade = Column(Enum(GradeType), nullable=True)
    group = Column(Integer)

    # relations
    report_id = Column(Integer, ForeignKey('report.id'))
    statistic_id = Column(Integer, ForeignKey('statistic.id'))
    statistic = relationship('Statistic', backref='essay')





    # labels = relationship('Label', backref='essay')

class Lecture(Base):
    __tablename__ = 'lecture'

    # field
    id = Column(Integer, primary_key=True)
    text = Column(Text)

    # relations
    statistic_id = Column(Integer, ForeignKey('statistic.id'))
    statistic = relationship('Statistic', backref="lecture")


class Statistic(Base):
    __tablename__ = 'statistic'
    id = Column(Integer, primary_key=True)

    # field
    num_letters = Column(Integer)
    num_words = Column(Integer)
    num_sentences = Column(Integer)


class Label(Base):
    __tablename__ = 'label'
    id = Column(Integer, primary_key=True)

    # field
    type = Column(Enum(LabelType))
    probability = Column(Integer, nullable=True)

    # relations
    essay_id = Column(Integer, ForeignKey('essay.id'))
    reference_id = Column(Integer, ForeignKey('essay.id'), nullable=True)
    essay = relationship("Essay", backref="labels", foreign_keys=[essay_id])
    reference = relationship("Essay", backref="label_reference", foreign_keys=[reference_id])


def create_database():
    engine = create_engine('sqlite:///essay_reviser.db', echo=False, connect_args={'check_same_thread': False})
    Base.metadata.create_all(engine)
    return engine
