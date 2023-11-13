import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AvailableLangs, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-translate-modal',
  templateUrl: './translate-modal.component.html',
  styleUrls: ['./translate-modal.component.scss']
})
export class TranslateModalComponent implements OnInit {

  dialogForm: FormGroup;
  availableLangs: AvailableLangs;

  constructor(
    public matDialogRef: MatDialogRef<TranslateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private _translocoService: TranslocoService) { }
  activeLang: string;
  ngOnInit(): void {
    this.availableLangs = this._translocoService.getAvailableLangs();
    this._translocoService.langChanges$.subscribe((activeLang) => {
      this.activeLang = activeLang;
    });
    this.createForm();
    this.dialogForm.setValue(this.data);
  }

  createForm() {
    this.dialogForm = null;
    const res = {};
    this.availableLangs.forEach((el) => {
      if (this.activeLang == el.id) {
        res[el.id] = new FormControl('', Validators.required);
      }
      else {
        res[el.id] = new FormControl('');
      }
    });
    this.dialogForm = this.fb.group({
      ...res
    });
  }

  onSubmit() {
    this.matDialogRef.close(this.dialogForm.value);
  }

}
