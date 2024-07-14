export class TestLogic1 {

    constructor(args) {
        this.value = (args["min"] + args["max"]) / 2;
    }

    getValue = () => this.value;
}

export class TestLogic2 {

    constructor(args) {
        this.value = args["value"];
    }

    getValue = () => this.value;
}