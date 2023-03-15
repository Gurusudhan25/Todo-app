import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HomePageComponent } from '../home-page/home-page.component';
import { ITodoID, ITodo } from '../interfaces/todo';
import { TodoStore } from '../state/todo.store';
import { TodoServiceService } from './todo-service.service';

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
    this.todoService
      .getTodos()
      .pipe(
        tap((res: any) => {
          this.todoStore.setLoading(true);
          this.todoStore.set(res);
          this.todoStore.setLoading(false);
        })
      )
      .subscribe();
  }

  addTodoData(todo: ITodo) {
    this.todoStore.setLoading(true);
    this.todoService
      .addTodo(todo)
      .pipe(
        tap(() => {
          this.todoStore.add(todo);
          this.todoStore.setLoading(false);
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

  deleteDataTodo(id: string) {
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
