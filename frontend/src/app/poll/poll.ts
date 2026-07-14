import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PollService } from '../poll.service';
import { CreatePollRequest, Poll } from '../poll.models';

@Component({
  selector: 'app-poll',
  imports: [CommonModule, FormsModule],
  templateUrl: './poll.html',
  styleUrl: './poll.css',
})
export class PollComponent implements OnInit {
  newPoll = {
    question: '',
    options: [] as string[]
  };
  optionCount = 2;

  polls = signal<Poll[]>([]);

  constructor(private pollService: PollService) {}

  ngOnInit(): void {
    this.loadPolls();
    this.onOptionCountChange();
  }

  onOptionCountChange() {
    const count = Math.max(2, Math.min(10, this.optionCount || 2));
    this.optionCount = count;
    this.newPoll.options = Array.from({ length: count }, (_, i) => this.newPoll.options[i] || '');
  }

  createPoll() {
    if (!this.newPoll.question.trim() || this.newPoll.options.some(opt => !opt.trim())) {
      alert('Please fill in the question and all options.');
      return;
    }

    const payload: CreatePollRequest = {
      question: this.newPoll.question,
      options: this.newPoll.options.map(text => ({ optionText: text }))
    };

    this.pollService.createPoll(payload).subscribe({
      next: () => {
        this.newPoll = { question: '', options: [] };
        this.optionCount = 2;
        this.loadPolls();

        const modalEl = document.getElementById('createPollModal');
        const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
        modal?.hide();
      },
      error: (error) => console.log('Error creating poll!!', error)
    });
  }

  loadPolls() {
    this.pollService.getPolls().subscribe({
      next: (data) => {
        this.polls.set(data);
      },
      error: (error) => {
        console.log("Error while fetching polls!!", error);
      }
    });
  }

  vote(pollId: number, optionIndex: number) {
    this.pollService.vote(pollId, optionIndex).subscribe({
      next: () => {
        console.log('Vote success for:', { pollId, optionIndex });
        this.polls.update(polls =>
          polls.map(poll => {
            if (poll.id !== pollId) return poll;
            return {
              ...poll,
              options: poll.options.map((opt, idx) =>
                idx === optionIndex ? { ...opt, voteCount: opt.voteCount + 1 } : opt
              )
            };
          })
        );
      },
      error: (error) => {
        console.log("Error while voting!!", error);
      }
    });
  }

  deletePoll(pollId: number) {
    if (!confirm('Are you sure you want to delete this poll?')) return;

    this.pollService.deletePoll(pollId).subscribe({
      next: () => {
        this.polls.update(polls => polls.filter(p => p.id !== pollId));
      },
      error: (error) => console.log('Error deleting poll!!', error)
    });
  }

  trackByPollId(index: number, poll: Poll): number {
    return poll.id;
  }

  trackByIndex(index: number): number {
    return index;
  }

}