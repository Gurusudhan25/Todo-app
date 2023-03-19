import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { flattenDeep } from 'lodash';
import { map, tap } from 'rxjs';

import { AddPageComponent } from '../add-page/add-page.component';
import { DeleteBoxComponent } from '../delete-box/delete-box.component';
import { ITodoID } from '../interfaces/todo';
import { TodoDataService } from '../services/todo-data.service';
import { TodoQuery } from '../state/todo.querry';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  public todoList: ITodoID[] = [];
  public tagsList: string[] = [];
  public emptyData: boolean = false;
  public queryState: boolean = false;

  public filterSelector: FormControl = new FormControl('');
  public filterTag: FormControl = new FormControl('');

  public isEditLoading = new Array(this.todoList.length).fill(false);
  public isButtonLoading = new Array(this.todoList.length).fill(false);

  constructor(
    private dialog: MatDialog,
    private todoDataService: TodoDataService,
    public todoQuery: TodoQuery
  ) {}

  ngOnInit(): void {
    this.todoDataService.getAllTodo();
    this.allTodoData();
    this.todoQuery.tags$
      .pipe(
        map((todos) => {
          const TODOS: ITodoID[] = todos;
          const tags: string[][] = [];
          TODOS.forEach((todo) => tags.push(todo.tags));
          this.tagsList = flattenDeep(tags);
        })
      )
      .subscribe();
  }

  filterTagged() {
    this.todoQuery
      .filterTagTodo(this.filterTag.value)
      .subscribe((todo: any) => {
        this.todoList = todo;
      });
  }

  filteredTodo(state: boolean) {
    this.todoQuery
      .filteredTodo(state)
      .pipe(
        tap((data) => {
          data.length
            ? ((this.todoList = data), (this.emptyData = false))
            : (this.emptyData = true);
        })
      )
      .subscribe();
  }

  clearData() {
    this.allTodoData();
    this.filterTag.setValue('');
  }

  allTodoData() {
    this.filterSelector.setValue('');
    this.todoQuery.allTodo().subscribe((data) => {
      this.todoList = data;
      this.emptyData = false;
    });
  }

  openAddDialog() {
    this.dialog
      .open(AddPageComponent)
      .afterClosed()
      .pipe(
        tap((todoData) => {
          if (todoData) {
            this.todoDataService.addTodoData(todoData);
          }
        })
      )
      .subscribe();
  }

  openEditDialog(todo: ITodoID, index: number) {
    this.dialog
      .open(AddPageComponent, {
        data: {
          task: todo.task,
          description: todo.description,
          tags: todo.tags,
        },
      })
      .afterClosed()
      .pipe(
        tap((data) => {
          if (data) {
            this.isEditLoading[index] = true;
            this.todoDataService
              .patchTodoData(data, todo.id)
              .subscribe(() => (this.isEditLoading[index] = false));
          }
        })
      )
      .subscribe();
  }

  openDeleteDialog(todo: ITodoID) {
    this.dialog
      .open(DeleteBoxComponent, {
        data: { id: todo.id },
      })
      .afterClosed()
      .pipe(
        tap((data) => {
          if (data) {
            this.todoDataService.deleteDataTodo(todo.id);
          }
        })
      )
      .subscribe();
  }

  taskState(todo: ITodoID, index: number) {
    this.isButtonLoading[index] = true;
    const currentTodo = { ...todo };
    currentTodo.state = !currentTodo.state;

    this.todoDataService
      .patchTodoData(currentTodo, currentTodo.id)
      .pipe(
        tap(() => {
          this.isButtonLoading[index] = false;
        })
      )
      .subscribe();
  }
}
