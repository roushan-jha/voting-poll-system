import { Injectable } from '@angular/core';
import { CreatePollRequest, Poll } from './poll.models';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class PollService {
  private apiUrl = "http://localhost:8080/v1/api/polls";

  constructor(private http: HttpClient) {}

  getPolls(): Observable<Poll[]> {
    return this.http.get<Poll[]>(this.apiUrl);
  }

  // createPoll(poll: Poll): Observable<Poll> {
  //   return this.http.post<Poll>(this.apiUrl, poll);
  // }

  createPoll(poll: CreatePollRequest): Observable<Poll> {
    return this.http.post<Poll>(this.apiUrl, poll);
  }

  vote(pollId : number, optionIndex : number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/vote`, { pollId, optionIndex });
  }

  deletePoll(pollId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${pollId}`);
  }
}
