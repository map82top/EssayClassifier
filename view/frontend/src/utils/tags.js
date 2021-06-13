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

export function getBackgroundColor(color) {
     switch (color) {
         case "magenta":
             return "#fff0f6"
         case "orange":
              return "#fff7e6"
          case "purple":
              return "#f9f0ff"
         case "green":
              return "#f6ffed"
         case "red":
              return "#fff1f0"
          case "cyan":
              return "#e6fffb"
     }
}

export function getBorderColor(color) {
     switch (color) {
         case "magenta":
             return "#ffadd2"
         case "orange":
              return "#ffd591"
          case "purple":
              return "#d3adf7"
         case "green":
              return "#b7eb8f"
         case "red":
              return "#ffa39e"
          case "cyan":
              return "#87e8de"
     }
}

export function getTextColor(color) {
     switch (color) {
         case "magenta":
             return "#c41d7f"
         case "orange":
              return "#d46b08"
          case "purple":
              return "#531dab"
         case "green":
              return "#389e0d"
         case "red":
              return "#cf1322"
          case "cyan":
              return "#08979c"
     }
}

export function getId(pre) {
    return `${ pre }_${ new Date().getTime() }`;
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