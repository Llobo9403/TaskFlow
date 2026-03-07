import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";
import { Movement } from '../../../../models/movement-model.model';

@Component({
  selector: 'app-balance-dialog',
  imports: [MatDialogContent, MatSelectModule, MatDialogModule, ReactiveFormsModule],
  templateUrl: './balance-dialog.component.html',
  styleUrl: './balance-dialog.component.scss'
})
export class BalanceDialogComponent {
form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BalanceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { movement: Movement }
  ) {
    this.form = this.fb.group({
      description: [data.movement.description || '', [Validators.required, Validators.maxLength(100)]]
    });
  }

  fechar(): void {
    this.dialogRef.close();
  }

  salvar(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value.description);
    }
  }
}
