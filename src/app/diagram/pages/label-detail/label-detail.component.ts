import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-label-detail',
  templateUrl: './label-detail.component.html',
  styleUrls: ['./label-detail.component.css']
})
export class LabelDetailComponent {

  @Output() formEvent = new EventEmitter<any>();
  
  public fontFamilys = ['Times New Roman', 'Georgia', 'Garamond', 'Arial', 'Verdana', 'Helvetica', 'Courier New', 'Lucida Console', 'Monaco'];

  public labelForm = new FormGroup({
    text: new FormControl(''),
    fontSize: new FormControl('14'),
    fontFamily: new FormControl(this.fontFamilys[0]),
    fontColor: new FormControl(''),
    isBold: new FormControl(false),
    isItalic: new FormControl(false) 
  });

  onConfirm(){
    let formData = this.labelForm.getRawValue();  
    this.formEvent.emit({
      isConfirm: true,
      formData: formData
    })  
  }

  onCancel() {
    this.formEvent.emit({
      isConfirm: false,
      formData: null
    })  
  }

}
