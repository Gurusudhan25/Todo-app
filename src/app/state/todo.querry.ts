import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { ITodoID } from '../interfaces/todo';
import { TodoStore } from './todo.store';
import { flattenDeep } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class TodoQuery extends QueryEntity<ITodoID[]> {
  
  isLoaded$: Observable<boolean> = this.selectLoading();

  tags$: Observable<any> = this.selectAll({
    filterBy: (entites: any) => entites.tags.length,
  });

  constructor(private todoStore: TodoStore) {
    super(todoStore);
  }

  allTodo(): Observable<any> {
    return this.selectAll();
  }

  filteredTodo(state: boolean): Observable<any> {
    return this.selectAll({
      filterBy: (entity: any) => entity.state === state,
    });
  }

  filterTagTodo(tag: string) {
    return this.selectAll({
      filterBy: (todos: any) => todos.tags.includes(tag),
    });
  }
}
