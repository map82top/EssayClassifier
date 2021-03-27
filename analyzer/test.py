first_text = "Когда человек сознательно или интуитивно выбирает себе в жизни какую-то цель, жизненную задачу, он невольно дает себе оценку. По тому, ради чего человек живет, можно судить и о его самооценке - низкой или высокой."
second_text = "Если человек живет, чтобы приносить людям добро, облегчать их страдания, давать людям радость, то он оценивает себя на уровне этой своей человечности. Он ставит себе цель, достойную человека."
third_text = "Только такая цель позволяет человеку прожить свою жизнь с достоинством и получить настоящую радость. Да, радость! Подумайте: если человек ставит себе задачей увеличивать в жизни добро, приносить людям счастье, какие неудачи могут его постигнуть? Не тому помочь? Но много ли людей не нуждаются в помощи?"
fourth_text = "Если жить только для себя, своими мелкими заботами о собственном благополучии, то от прожитого не останется и следа. Если же жить для других, то другие сберегут то, чему служил, чему отдавал силы."
fifth_text = "Можно по-разному определять цель своего существования, но цель должна быть. Надо иметь и принципы в жизни. Одно правило в жизни должно быть у каждого человека, в его цели жизни, в его принципах жизни, в его поведении: надо прожить жизнь с достоинством, чтобы не стыдно было вспоминать."
lecture_text = "Жизнь - прежде всего творчество, но это не значит, что каждый человек, чтобы жить, должен родиться художником, балериной или ученым. Можно творить просто добрую атмосферу вокруг себя. Человек может принести с собой атмосферу подозрительности, какого-то тягостного молчания, а может внести сразу радость, свет. Вот это и есть творчество."


def mock_report():
    graded_essays = []

    graded_essays.append(EssayData(
        "",
        lecture_text,
        GradeType.SUCCESS,
        None,
        None,
        True
    ))

    graded_essays.append(EssayData(
        "1",
        first_text,
        GradeType.SUCCESS,
        1,
        [
            LabelData(LabelType.SUCCESS),
            LabelData(LabelType.ATTENTION)
        ],
        False
    ))

    graded_essays.append(EssayData(
        "2",
        second_text,
        GradeType.SUCCESS,
        1,
        [
            LabelData(LabelType.SUCCESS)
        ],
        False
    ))

    graded_essays.append(EssayData(
        "3",
        third_text,
        GradeType.FAIL,
        1,
        [
            LabelData(LabelType.FAIL),
            LabelData(LabelType.ATTENTION),
            LabelData(LabelType.LECTURE_PLAGIARISM, probability=0.56),
            LabelData(LabelType.ESSAY_PLAGIARISM, 5, 0.58)
        ],
        False
    ))

    graded_essays.append(EssayData(
        "4",
        fourth_text,
        GradeType.SUCCESS,
        1,
        [
            LabelData(LabelType.SUCCESS),
            LabelData(LabelType.ATTENTION),
            LabelData(LabelType.LECTURE_PLAGIARISM, probability=0.2),
        ],
        False
    ))

    graded_essays.append(EssayData(
        "5",
        fifth_text,
        GradeType.FAIL,
        1,
        [
            LabelData(LabelType.FAIL),
            LabelData(LabelType.LECTURE_PLAGIARISM, probability=0.76),
            LabelData(LabelType.ESSAY_PLAGIARISM, 3, 0.4)
        ],
        False
    ))

    return graded_essays