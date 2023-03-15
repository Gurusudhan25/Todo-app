import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HomePageComponent } from '../home-page/home-page.component';

@Component({
  selector: 'app-delete-box',
  templateUrl: './delete-box.component.html',
  styleUrls: ['./delete-box.component.scss'],
})
export class DeleteBoxComponent {
  constructor(
    private dialogref: MatDialogRef<HomePageComponent>,
    @Inject(MAT_DIALOG_DATA)
    public dialogData: { id: number }
  ) {}

  closeDialog() {
    this.dialogref.close();
  }
  deleteTask(id: number) {
    this.dialogref.close(id);
  }
}
