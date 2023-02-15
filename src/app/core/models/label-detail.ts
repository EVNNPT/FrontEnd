export class LabelDetail {
    text: string = '';
    fontSize: number = 14;
    fontFamily: string = '';
    fontColor: string = '';
    isBold: boolean = false;
    isItalic: boolean = false;
    constructor(
        text: string, 
        fontSize: number,
        fontFamily: string,
        fontColor: string,
        isBold: boolean = false,
        isItalic: boolean = false) 
    {
        this.text = text;
        this.fontSize = fontSize;
        this.fontFamily = fontFamily;
        this.fontColor = fontColor;
        this.isBold = isBold;
        this.isItalic = isItalic;
    }
}