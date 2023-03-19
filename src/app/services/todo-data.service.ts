import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { HomePageComponent } from '../home-page/home-page.component';
import { ITodoID, ITodo } from '../interfaces/todo';
import { TodoStore } from '../state/todo.store';
import { TodoServiceService } from './todo-service.service';
import { flattenDeep } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class TodoDataService {
  public loadData: Observable<boolean> = new Observable();

  constructor(
    private todoService: TodoServiceService,
    private todoStore: TodoStore
  ) {}

  getAllTodo() {
    this.todoStore.setLoading(true);
    this.todoService
      .getTodos()
      .pipe(
        tap((res: any) => {
          // let tagsArr: any = [];
          // res.forEach((todo: ITodo) => {
          //   tagsArr.push(todo.tags);
          // });
          // const newtagsArr = flattenDeep(tagsArr);
          // // console.log(newtagsArr);

          this.todoStore.set(res);
          this.todoStore.setLoading(false);
        })
      )
      .subscribe();
  }

  addTodoData(todo: ITodo): void {
    this.todoStore.setLoading(true);
    this.todoService
      .addTodo(todo)
      .pipe(
        tap(() => {
          this.todoStore.add(todo);
          this.todoStore.setLoading(false);
        }),
        catchError((err) => {
          return throwError(err);
        })
      )
      .subscribe();
  }

  patchTodoData(todo: ITodoID, id: string) {
    return this.todoService.patchTodo(todo, id).pipe(
      tap(() => {
        this.todoStore.upsert(id, todo);
      })
    );
  }

  deleteDataTodo(id: string): void {
    this.todoService
      .deleteTodo(id)
      .pipe(
        tap(() => {
          this.todoStore.remove(id);
        })
      )
      .subscribe();
  }
}
