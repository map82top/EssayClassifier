import {action, observable, computed} from "mobx";
import { estimatorService } from "../services";
import data from "../test/report.json";
import FileSaver from 'file-saver';
import XLSX from 'xlsx';
import dayjs from 'dayjs'

const local = false

class ReportStore {
    @observable params = {}

    constructor() {
        this.initializeStore();
    }

    initializeStore() {
        this.params = {
            lectureFile: null,
            essaysFile: null,
            local: local,
            status: local ? { 'status': 'handled' } : {},
            lecture: local ? data.lecture : null,
            essays: local ? data.essays : [],
            error: null
        }
    }

    @action selectLecture(file) {
        this.params.lectureFile = file;
    }

    @action selectEssays(file) {
        this.params.essaysFile = file;
    }

    @action updateStatus(update) {
        this.params.status = update
    }

    @action setTeacherGrade(id, teacher_grade) {
        const essay = this.findEssay(id);
        if(essay) {
            essay.labels.push({"probability":null,"reference":null,"type":`TEACHER_${teacher_grade}`});
            essay.teacher_grade = teacher_grade;
        }
    }

    @action removeTeacherGrade(id) {
        const essay = this.findEssay(id);
        if(essay) {
            this.removeTeacherGradeLabel(essay);
            essay.teacher_grade = null;
        }
    }

    findEssay(id) {
        for(let essay of this.params.essays) {
            if (essay.id === id) {
                return essay;
            }
        }

        return null;
    }

    removeTeacherGradeLabel(essay) {
        let teacherLabel = null;
        let type = `TEACHER_${essay.teacher_grade}`;
         for (let label of essay.labels) {
            if (label.type === type) {
                teacherLabel = label;
            }
        }

         if(teacherLabel) {
             essay.labels.remove(teacherLabel);
         }
    }

    @computed get textStatus() {
        const status = this.params.status
        if (status.description) {
            return status.description;
        }
        switch (status.status) {
            case 'handling':
                return 'Обрабатывается';
            case 'handled':
                 return 'Обработан';
            default:
                return 'Отправка';
        }
    }

    @action startEvaluation() {
        if(!this.params.lectureFile || !this.params.essaysFile) {
            return false;
        }

        estimatorService.startEvaluation(this.params.lectureFile, this.params.essaysFile)
            .then(resolve => {
                    this.params.lecture = resolve.data.lecture;
                    this.params.essays = resolve.data.essays;
                    this.computeInternalEssayId();
            }).catch(error => {
                this.handleException(error)
            })

        return true;
    }

    computeInternalEssayId() {
        let id = 1;
        let essaysMap = {}

        for(let essay of this.params.essays) {
            essay.internal_id = id;
            essaysMap[essay.id] = essay;
            id++;
        }

        for(let essay of this.params.essays) {
            for(let label of essay.labels) {
                if(label.reference && essaysMap[label.reference]) {
                    label.internal_reference = essaysMap[label.reference].internal_id;
                }
            }
        }
    }

    @action endEvaluation() {
        estimatorService.endEvaluation({essays: this.params.essays, lecture: this.params.lecture})
            .then(resolve => {})
            .catch(error => {});

        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        const ws = XLSX.utils.json_to_sheet(this.getSheetEssayData());
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        const reportDate = dayjs().format('YYYYMMDD');
        FileSaver.saveAs(data, `EssayGrading_${reportDate}${fileExtension}`);
    }

    getSheetEssayData() {
        const essays = this.params.essays;
        const sheetEssays = [];
        essays.forEach((essay, index, array) => {
               sheetEssays.push({
                   "Номер": index + 1,
                   "Автор": essay["author"] || '',
                   "Оценка": this.convertGrade(essay["teacher_grade"] || essay["grade"])
               })
        });

        return sheetEssays;
    }

    convertGrade(grade) {
        switch (grade.toLowerCase()) {
            case "success":
                return "Зачет";
            case "fail":
                return "Незачет";
            default:
                return "";
        }
    }

    handleException(error) {
        const data = error.response ?  error.response.data : error.data
        this.params.error = {
            text: data && data.text ? data.text : "Серверная ошибка!"
        }
    }

    @action resetState() {
        this.initializeStore();
    }
}

export default new ReportStore();