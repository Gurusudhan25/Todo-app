import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { filter, map, Observable, startWith } from 'rxjs';
import { HomePageComponent } from '../home-page/home-page.component';

@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.scss'],
})
export class AddPageComponent implements OnInit {
  public tagsArr: string[] = [];
  public todoData: FormGroup = new FormGroup({
    task: new FormControl('', [Validators.required, Validators.nullValidator]),
    description: new FormControl(''),
    tags: new FormControl(''),
  });

  public filteredTags$: Observable<string> | any;

  constructor(
    private dialogref: MatDialogRef<HomePageComponent>,
    @Inject(MAT_DIALOG_DATA)
    public dialogData: { task: string; description: string; tags: string[] }
  ) {}
  
  ngOnInit(): void {
    if (this.dialogData) {
      this.todoData.controls['task'].setValue(this.dialogData.task);
      this.todoData.controls['description'].setValue(
        this.dialogData.description
      );
      this.todoData.controls['tags'].setValue('');
      this.tagsArr = this.dialogData.tags;
    }

    this.filteredTags$ = this.todoData.get('tags')?.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) =>
        tag ? this.filterTag(tag) : this.tagsArr.slice()
      )
    );
  }

  filterTag(value: string): string[] {
    const tag = value.toLowerCase();
    return this.tagsArr.filter((tags) => tags.toLowerCase().indexOf(tag) === 0);
  }

  addTag(): void {
    const newTag = this.todoData.get('tags')?.value.trim();
    if (newTag && !this.tagsArr.includes(newTag)) {
      const tags = [...this.tagsArr];
      tags.push(newTag);
      this.todoData.controls['tags'].setValue(newTag);
      this.tagsArr = [...tags];
    }
  }

  removeTag(tag: string) {
    this.tagsArr = this.tagsArr.filter((tags) => tags !== tag);
  }

  addTodoData() {
    const todoWithTags = {
      task: this.todoData.controls['task'].value,
      description: this.todoData.controls['description'].value,
      state: false,
      tags: this.tagsArr,
    };
    this.dialogref.close(todoWithTags);
  }
}
