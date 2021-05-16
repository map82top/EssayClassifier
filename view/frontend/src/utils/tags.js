export function convertLectureTypeToColor(type) {
    switch (type) {
        case 'ATTENTION':
            return 'orange';
        case 'IGNORE':
            return 'purple';
        case 'LECTURE_PLAGIARISM':
        case 'ESSAY_PLAGIARISM':
        case 'FAIL':
            return 'red';
        case 'SUCCESS':
            return 'green';
        case 'TEACHER_SUCCESS':
            return 'cyan';
        case 'TEACHER_FAIL':
            return 'magenta';
    }
}

export function convertLabelToDescription(label) {
    let base = '';
    switch (label.type) {
        case 'ATTENTION':
            base = 'Спорная оценка';
            break;
        case 'IGNORE':
            base = 'Ошибка проверки'
            break;
        case 'LECTURE_PLAGIARISM':
            base = 'Плагиат лекции';
            break;
        case 'ESSAY_PLAGIARISM':
            base = 'Плагиат эссе';
            break;
        case 'FAIL':
            base = 'Незачет';
            break;
        case 'SUCCESS':
            base = 'Зачет';
            break;
        case 'TEACHER_SUCCESS':
            base = 'Преподаватель - Зачет';
            break;
        case 'TEACHER_FAIL':
            base = 'Преподаватель - Незачет';
            break;
    }

    if(label.internal_reference) {
        base += ` ${label.internal_reference}`;
    }

    if(label.probability) {
          base += ` на ${label.probability}%`;
    }

    return base;
}