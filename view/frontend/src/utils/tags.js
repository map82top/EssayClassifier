export function convertLectureTypeToColor(type) {
    switch (type) {
        case 'attention':
            return 'orange';
        case 'lecture_plagiarism':
        case 'essay_plagiarism':
        case 'fail':
            return 'red';
        case 'success':
            return 'green';
        case 'teacher-success':
            return 'cyan';
        case 'teacher-fail':
            return 'magenta';
    }
}

export function convertLabelToDescription(label) {
    let base = '';
    switch (label.type) {
        case 'attention':
            base = 'Спорная оценка';
            break;
        case 'lecture_plagiarism':
            base = 'Плагиат лекции';
            break;
        case 'essay_plagiarism':
            base = 'Плагиат эссе';
            break;
        case 'fail':
            base = 'Незачет';
            break;
        case 'success':
            base = 'Зачет';
            break;
        case 'teacher-success':
            base = 'Преподаватель - Зачет';
            break;
        case 'teacher-fail':
            base = 'Преподаватель - Незачет';
            break;
    }

    if(label.reference) {
        base += ` ${label.reference}`;
    }

    if(label.probability) {
          base += ` на ${label.probability}%`;
    }

    return base;
}