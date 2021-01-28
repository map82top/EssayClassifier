import {action, observable, computed} from "mobx";
import { estimatorService } from "../services";

class ReportStore {
    data = JSON.parse('{"graded_essays":[{"grade":"success","group":1,"is_lecture":false,"key":"1","labels":[{"probability":null,"reference":null,"type":"success"},{"probability":null,"reference":null,"type":"attention"}],"text":"Когда человек сознательно или интуитивно выбирает себе в жизни какую-то цель, жизненную задачу, он невольно дает себе оценку. По тому, ради чего человек живет, можно судить и о его самооценке - низкой или высокой."},{"grade":"success","group":1,"is_lecture":false,"key":"2","labels":[{"probability":null,"reference":null,"type":"success"}],"text":"Если человек живет, чтобы приносить людям добро, облегчать их страдания, давать людям радость, то он оценивает себя на уровне этой своей человечности. Он ставит себе цель, достойную человека."},{"grade":"fail","group":2,"is_lecture":false,"key":"3","labels":[{"probability":null,"reference":null,"type":"fail"},{"probability":null,"reference":null,"type":"attention"},{"probability":0.56,"reference":null,"type":"lecture_plagiarism"},{"probability":0.58,"reference":5,"type":"essay_plagiarism"}],"text":"Только такая цель позволяет человеку прожить свою жизнь с достоинством и получить настоящую радость. Да, радость! Подумайте: если человек ставит себе задачей увеличивать в жизни добро, приносить людям счастье, какие неудачи могут его постигнуть? Не тому помочь? Но много ли людей не нуждаются в помощи?"},{"grade":"success","group":1,"is_lecture":false,"key":"4","labels":[{"probability":null,"reference":null,"type":"success"},{"probability":null,"reference":null,"type":"attention"},{"probability":0.2,"reference":null,"type":"lecture_plagiarism"}],"text":"Если жить только для себя, своими мелкими заботами о собственном благополучии, то от прожитого не останется и следа. Если же жить для других, то другие сберегут то, чему служил, чему отдавал силы."},{"grade":"fail","group":2,"is_lecture":false,"key":"5","labels":[{"probability":null,"reference":null,"type":"fail"},{"probability":0.76,"reference":null,"type":"lecture_plagiarism"},{"probability":0.4,"reference":3,"type":"essay_plagiarism"}],"text":"Можно по-разному определять цель своего существования, но цель должна быть. Надо иметь и принципы в жизни. Одно правило в жизни должно быть у каждого человека, в его цели жизни, в его принципах жизни, в его поведении: надо прожить жизнь с достоинством, чтобы не стыдно было вспоминать."}],"lecture":{"grade":"success","group":null,"is_lecture":true,"key":"","labels":null,"text":"Жизнь - прежде всего творчество, но это не значит, что каждый человек, чтобы жить, должен родиться художником, балериной или ученым. Можно творить просто добрую атмосферу вокруг себя. Человек может принести с собой атмосферу подозрительности, какого-то тягостного молчания, а может внести сразу радость, свет. Вот это и есть творчество."}}');

    @observable params = {
        lectureFile: null,
        essaysFile : null,
        status : 'handled',
        lecture: this.data.lecture,
        gradedEssays : this.data.graded_essays,
        groupType: 'none'
    }

    @action setGroupType(groupType) {
        this.params.groupType = groupType;
    }

    @action selectLecture(file) {
        this.params.lectureFile = file;
    }

    @action selectEssays(file) {
        this.params.essaysFile = file;
    }

    @action updateStatus(status) {
        this.params.status = status;
    }

    @computed get textStatus() {
        switch (this.params.status) {
            case 'handling':
                return 'Обрабатывается';
            case 'handled':
                 return 'Обработан';
            default:
                return 'Отправка';
        }
    }

    @action sendOnEvaluation() {
        if(!this.params.lectureFile || !this.params.essaysFile) {
            return;
        }

        estimatorService.evaluateEssays(this.params.lectureFile, this.params.essaysFile)
            .then(
                resolve => {
                    console.log('report getting')
                    debugger;
                    this.params.lecture = resolve.data.lecture;
                    this.params.gradedEssays = resolve.data.graded_essays;
                }
            ).catch(
                error => {

                }
            )
    }
}

const reportStore = new ReportStore();

export default reportStore;