from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import exists
from storage.schema import *
from storage.entities import *


def run_orm():
    engine = create_database()
    return sessionmaker(bind=engine, expire_on_commit=True)


# def save_report(session, report: ReportData):
#     lecture = Lecture(
#         text=report.lecture.text,
#         statistic=_create_statistic(report.lecture.statistic)
#     )
#
#     db_essays = [Essay(text=essay.text,
#               grade=essay.grade,
#               group=essay.group,
#               statistic=_create_statistic(essay.statistic)
#     ) for essay in report.essays]
#
#     for i, essay in enumerate(db_essays):
#         essay.labels = _create_labels(report.essays[i].labels, db_essays)
#
#     report = Report(
#         essays=db_essays,
#         lecture=lecture
#     )
#
#     session.add(report)
#     session.commit()
#
#
# def _create_labels(labels, essays):
#     db_labels = []
#     for label in labels:
#         db_label = Label(
#             type=label.type,
#             probability=label.probability,
#         )
#         if label.reference is not None:
#             db_label.reference = essays[label.reference]
#
#     return db_labels
#
#
# def _create_statistic(statistic):
#     return Statistic(
#         num_letters=statistic.num_letters,
#         num_words=statistic.num_words,
#         num_sentences=statistic.num_sentences
#     )
