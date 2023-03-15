import { Injectable } from '@angular/core';
import { EntityStore, StoreConfig } from '@datorama/akita';
import { ITodo, ITodoID } from '../interfaces/todo';

const InitialTodo: ITodoID[] = [
  {
    id: '',
    task: '',
    description: '',
    state: false,
    isLoading: false,
  },
];

@Injectable({
  providedIn: 'root',
})
@StoreConfig({
  name: 'todo',
})
export class TodoStore extends EntityStore<ITodoID[]> {
  constructor() {
    super(InitialTodo);
  }
}
