class calcController {

    constructor() {
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale = "pt-BR";
        this._dateEl = document.querySelector("#date");
        this._timeEl = document.querySelector("#time");        
        this._displayCalcEl = document.querySelector("#display");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
    }
    
    initialize(){
        this.setDisplayDateTime();

        setInterval(()=>{
            this.setDisplayDateTime();
        }, 1000);

        this.setLastNumberToDisplay();
    }

    //Evento criado para tratar multiplos eventos
    addEventListenerAll(element, events, fn){
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        });
    }

    clearAll(){
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();
    }

    clearEntry(){
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    getLastOperation(){
        return this._operation[this._operation.length-1];
    }

    setLastOperation(value){
        this._operation[this._operation.length - 1] = value;
    }

    isOperator(value){

       return (['+', '-', '*', '/', '%'].indexOf(value) > -1) ;
         
    }

    pushOperation(value) {
        
        this._operation.push(value);

        if (this._operation.length > 3){

            this.calc();

        }

    }

    getResult() {
        return eval(this._operation.join(""));
    }

    calc(){

        let last = '';

        this._lastOperator = this.getLastItem();

        if(this._operation.length < 3) {

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];

        }

        if(this._operation.length > 3) {

            last = this._operation.pop();
            this._lastNumber = this.getResult();

        }else if(this._operation.length == 3) {

            this._lastNumber = this.getLastItem(false);

        }
        
        let result = this.getResult();

        if(last == '%') {

            result /= 100; 

            this._operation = [result];

        } else {

            this._operation = [result];

            if (last) this._operation.push(last);

        }

        this.setLastNumberToDisplay();


    }

    getLastItem(isOperator = true){

        let lastItem;

        for(let i = this._operation.length-1; i >= 0; i--){
            
            if(this.isOperator(this._operation[i]) == isOperator){
                lastItem = this._operation[i];
                break;
            }

        }

        if(!lastItem) {
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }
        
        return lastItem;

    }

    setLastNumberToDisplay() {

        let lastNumber = this.getLastItem(false);

        if(!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;

    }

    addOperation(value){


        if(isNaN(this.getLastOperation())) {
             
            if(this.isOperator(value)){

                this.setLastOperation(value);

            }else {

                this.pushOperation(value);
                this.setLastNumberToDisplay();

            }

        }else {

           if(this.isOperator(value)){

                this.pushOperation(value);

           } else {

                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);
                this.setLastNumberToDisplay();

           } 

        }
    }
    
    setError(){
        this.displayCalc = "ERROR";
    }

    addDot(){

        let lastOperation = this.getLastOperation();

        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if (this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation('0.');
        } else {
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();
    }

    execBtn(value){
        
        switch (value){
            case 'ac':
                this.clearAll();
            break;
            case 'ce':
                this.clearEntry()
            break;
            case 'soma':
                this.addOperation('+');
            break;
            case 'subtracao':
                this.addOperation('-');
            break;
            case 'divisao':
                this.addOperation('/');
            break;
            case 'multiplicacao':
                this.addOperation('*');
            break;
            case 'porcento':
                this.addOperation('%');
            break;
            case 'ponto':
                this.addDot('.');
            break;
            case 'igual':
                this.calc();
            break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseFloat(value));
            break;

            default:
                this.setError();
            break;
        }
        
    }

    initButtonsEvents(){
       let buttons = document.querySelectorAll(".buttons > button");
       
        buttons.forEach((btn, index)=>{
            this.addEventListenerAll(btn, 'click drag', e=>{
                let textBtn = btn.id.replace("btn","");
                this.execBtn(textBtn);
            });
        });
    }

    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale);
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }


    //exibindo valores
    get displayTime(){
        return this._timeEl.innerHTML;
    }
    get displayDate(){
        return this._dateEl.innerHTML;
    }
    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }
    get currentDate(){
        return new Date();
    }

    //Alterando valores
    set displayTime(value){
        this._timeEl.innerHTML = value;
    }
    set displayDate(value){
        this._dateEl.innerHTML = value;
    }
    set displayCalc(value){

        if (value.toString().length > 10){
            this.setError();
            return false;
        }
        this._displayCalcEl.innerHTML = value;
    }
    set currentDate(value){
        this._currentDate = value;
    }

}














                     /* Explicações */                                 

//Metodo get usado para exibir ou retornar um valor
//Metodo set usado para alterar o valor ou conteúdo de um atributo
// result /= 100; => quando o resultado for a própria variavel é possivel fazer desta forma subistituindo result = result / 100