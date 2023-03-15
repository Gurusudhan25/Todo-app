import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITodo } from '../interfaces/todo';
import { TodoStore } from '../state/todo.store';

@Injectable({
  providedIn: 'root',
})
export class TodoServiceService {
  public URL = 'https://63fa2035473885d837d8e04b.mockapi.io/todos';
  constructor(private http: HttpClient, private todoStore: TodoStore) {}

  getTodos(): Observable<ITodo> {
    return this.http.get<ITodo>(this.URL);
  }

  addTodo(todo: ITodo): Observable<ITodo> {
    return this.http.post<ITodo>(this.URL, todo);
  }

  patchTodo(patchedTodo: ITodo, id: string): Observable<ITodo> {
    return this.http.put<ITodo>(`${this.URL}/${id}`, patchedTodo);
  }

  deleteTodo(id: string): Observable<ITodo> {
    return this.http.delete<ITodo>(`${this.URL}/${id}`);
  }
}
