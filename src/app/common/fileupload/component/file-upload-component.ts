import {Component, Input, OnChanges, SimpleChanges, forwardRef} from '@angular/core';
import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR
} from "@angular/forms";
@Component({
    selector: 'custom-file-upload',
    template: '<input id="filesToUpload" (change)="fileChangeEvent($event)" name="filesToUpload"   type="file"  placeholder="Upload file..." />',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FileUploadComponent), multi: true }
    ]
})


export class FileUploadComponent implements ControlValueAccessor, OnChanges {

    propagateChange:any = () => {};

    fileChangeEvent(fileInput: any) : void{
        this.propagateChange(<File> fileInput.target.files[0]);
    }

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    writeValue(obj: any): void {}
    setDisabledState(isDisabled: boolean): void {}
    ngOnChanges(changes: SimpleChanges): void {}
    registerOnTouched() {}

}