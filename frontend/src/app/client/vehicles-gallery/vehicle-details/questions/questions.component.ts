import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  activeQuestions: boolean[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Initialize all questions as collapsed
      // We'll count the number of questions in the HTML
      const questionElements = document.querySelectorAll('.question-item');
      this.activeQuestions = new Array(questionElements.length).fill(false);
    } else {
      // For SSR, initialize with a default size
      this.activeQuestions = new Array(5).fill(false);
    }
  }

  toggleQuestion(index: number): void {
    this.activeQuestions[index] = !this.activeQuestions[index];
  }

  isQuestionActive(index: number): boolean {
    return this.activeQuestions[index];
  }
}