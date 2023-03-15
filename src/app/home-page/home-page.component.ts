import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { tap } from 'rxjs';
import { AddPageComponent } from '../add-page/add-page.component';
import { DeleteBoxComponent } from '../delete-box/delete-box.component';
import { ITodo, ITodoID } from '../interfaces/todo';
import { TodoDataService } from '../services/todo-data.service';
import { TodoQuery } from '../state/todo.querry';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  public todoList: ITodoID[] = [];
  public isEditLoading = new Array(this.todoList.length).fill(false);
  public isButtonLoading = new Array(this.todoList.length).fill(false);

  constructor(
    private dialog: MatDialog,
    private todoDataService: TodoDataService,
    public todoQuery: TodoQuery
  ) {}

  ngOnInit(): void {
    this.todoDataService.getAllTodo();
    this.todoQuery.todos$.subscribe((data) => {
      this.todoList = data;
    });
  }

  openAddDialog() {
    this.dialog
      .open(AddPageComponent)
      .afterClosed()
      .pipe(
        tap((todoData) => {
          if (todoData) {
            const todoTask: ITodo = {
              task: todoData.get('task')?.value,
              description: todoData.get('description')?.value,
              state: false,
            };
            this.todoDataService.addTodoData(todoTask);
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
        },
      })
      .afterClosed()
      .pipe(
        tap((data) => {
          if (data) {
            this.isEditLoading[index] = true;
            this.todoDataService
              .patchTodoData(data.value, todo.id)
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
    currentTodo.state = true;
    currentTodo.isLoading = true;
    this.todoDataService
      .patchTodoData(currentTodo, currentTodo.id)
      .pipe(
        tap(() => {
          this.isButtonLoading[index] = false;
        })
      )
      .subscribe();
  }
  taskRedoState(todo: ITodoID, index: number) {
    this.isButtonLoading[index] = true;
    const currentTodo = { ...todo };
    currentTodo.state = false;
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
