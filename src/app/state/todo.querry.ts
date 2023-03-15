import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { ITodoID } from '../interfaces/todo';
import { TodoStore } from './todo.store';

@Injectable({
  providedIn: 'root',
})
export class TodoQuery extends QueryEntity<ITodoID[]> {
  constructor(private todoStore: TodoStore) {
    super(todoStore);
  }
  todos$: Observable<any> = this.selectAll();
  isLoaded$: Observable<boolean> = this.selectLoading();
}
