import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  activeQuestions: boolean[] = [];

  ngOnInit(): void {
    // Initialize all questions as collapsed
    // We'll count the number of questions in the HTML
    const questionElements = document.querySelectorAll('.question-item');
    this.activeQuestions = new Array(questionElements.length).fill(false);
  }

  toggleQuestion(index: number): void {
    this.activeQuestions[index] = !this.activeQuestions[index];
  }

  isQuestionActive(index: number): boolean {
    return this.activeQuestions[index];
  }
}