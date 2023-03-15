import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HomePageComponent } from '../home-page/home-page.component';

@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.scss'],
})
export class AddPageComponent implements OnInit {
  public todoData: FormGroup = new FormGroup({
    task: new FormControl('', [Validators.required, Validators.nullValidator]),
    description: new FormControl(''),
  });

  constructor(
    private dialogref: MatDialogRef<HomePageComponent>,
    @Inject(MAT_DIALOG_DATA)
    public dialogData: { task: string; description: string }
  ) {}
  ngOnInit(): void {
    this.todoData.patchValue(this.dialogData);
  }
}
