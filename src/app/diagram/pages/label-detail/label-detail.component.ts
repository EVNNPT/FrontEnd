import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LabelDetail } from 'src/app/core/models/label-detail';

@Component({
  selector: 'app-label-detail',
  templateUrl: './label-detail.component.html',
  styleUrls: ['./label-detail.component.css'],
})
export class LabelDetailComponent implements OnInit {
  @Output() formEvent = new EventEmitter<any>();

  public fontColorDefault = "#000000";

  public fontFamilys = [
    'Times New Roman',
    'Georgia',
    'Garamond',
    'Arial',
    'Verdana',
    'Helvetica',
    'Courier New',
    'Lucida Console',
    'Monaco',
  ];

  private _labelDefault = new LabelDetail('', 14, this.fontFamilys[0], this.fontColorDefault);

  public labelForm = new FormGroup({
    text: new FormControl(this._labelDefault.text),
    fontSize: new FormControl(this._labelDefault.fontSize),
    fontFamily: new FormControl(this._labelDefault.fontFamily),
    fontColor: new FormControl(this._labelDefault.fontColor),
    isBold: new FormControl(this._labelDefault.isBold),
    isItalic: new FormControl(this._labelDefault.isItalic),
  });

  ngOnInit(): void {
    
  }

  setFormData(formData: LabelDetail | null) {
    if(formData instanceof LabelDetail) {
      // Set value
      this.labelForm.patchValue({
        text: formData.text,
        fontSize: formData.fontSize,
        fontFamily: formData.fontFamily,
        fontColor: formData.fontColor,
        isBold: formData.isBold,
        isItalic: formData.isItalic,
      });
    } else {
      // Clear
      this.labelForm.patchValue({
        text: this._labelDefault.text,
        fontSize: this._labelDefault.fontSize,
        fontFamily: this._labelDefault.fontFamily,
        fontColor: this._labelDefault.fontColor,
        isBold: this._labelDefault.isBold,
        isItalic: this._labelDefault.isItalic,
      });
    }
    
  }

  onConfirm() {
    let formData = this.labelForm.getRawValue();
    this.formEvent.emit({
      isConfirm: true,
      formData: formData,
    });
  }

  onCancel() {
    this.formEvent.emit({
      isConfirm: false,
      formData: null,
    });
  }
}
